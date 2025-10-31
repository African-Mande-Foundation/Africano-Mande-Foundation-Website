"use client";

import { ReactNode, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import LoadingBar from "../components/LoadingBar";
import { User } from "@/lib/types";

interface MembershipLayoutProps {
  children: ReactNode;
}

export default function VolunteerLayout({ children }: MembershipLayoutProps) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      if (status === "authenticated" && session) {
        setIsFetchingUser(true);
        try {
          const res = await fetch("/api/user");
          if (!res.ok) throw new Error("Failed to fetch user");
          const data = await res.json();

          const firstName = data.firstName || data.username?.split(" ")[0] || session.user?.name?.split(" ")[0] || "";
          const lastName = data.lastName || session.user?.name?.split(" ")[1] || "";
          const userImage = session.user?.image;

          // Determine user status based on role
          let userStatus = "member"; // Default status
          let hasVolunteerAccess = false;
          
          if (data.role) {
            // Check if role is an object with name property or just a string
            const roleName = typeof data.role === 'object' ? data.role.name : data.role;
            
            if (roleName === "Volunteer") {
              userStatus = "volunteer";
              hasVolunteerAccess = true;
            } else if (roleName === "Authenticated") {
              userStatus = "member";
              hasVolunteerAccess = false;
            }
          }

          console.log('User role:', data.role, 'Status set to:', userStatus, 'Volunteer access:', hasVolunteerAccess);

          // Check if user has volunteer access
          if (!hasVolunteerAccess) {
            console.log('Access denied: User does not have Volunteer role');
            setAccessDenied(true);
            setIsFetchingUser(false);
            return;
          }

          setUser({
            id: data.id || 0,
            documentId: data.documentId || "",
            provider: data.provider || "google",
            confirmed: data.confirmed || true,
            blocked: data.blocked || false,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
            publishedAt: data.publishedAt || new Date().toISOString(),
            firstName,
            lastName,
            username: data.username || session.user?.name || "",
            status: userStatus,
            email: data.email || session.user?.email || "",
            photoUrl: userImage && userImage.trim() !== "" 
              ? userImage 
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=04663A&color=ffffff&size=128`
          });
        } catch (error) {
          console.error("Error fetching user:", error);
          setAccessDenied(true);
        } finally {
          setIsFetchingUser(false);
        }
      }
    };

    fetchUser();
  }, [status, session]);

  if (status === "loading" || isFetchingUser) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-white">
        <LoadingBar className="w-24 h-24" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600 bg-gradient-to-b from-[#E6FFF4] from-60% to-white px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <p className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</p>
          <p className="text-gray-600 mb-6">Please sign in to access the volunteer portal.</p>
          <button
            onClick={() => router.push('/auth/signin')}
            className="bg-[#04663A] text-white px-6 py-2 rounded-lg hover:bg-[#035530] transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600 bg-gradient-to-b from-[#E6FFF4] from-60% to-white px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
          </div>
          <p className="text-xl font-semibold text-gray-800 mb-2">Access Denied</p>
          <p className="text-gray-600 mb-4">
            This portal is restricted to volunteers only. You need to have volunteer privileges to access this area.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            If you believe this is an error, please contact support or apply to become a volunteer.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/membership')}
              className="bg-[#04663A] text-white px-6 py-2 rounded-lg hover:bg-[#035530] transition-colors"
            >
              Go to Member Portal
            </button>
            <button
              onClick={() => router.push('/membership/volunteer/apply')}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Apply to Volunteer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "authenticated" && !user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600 bg-gradient-to-b from-[#E6FFF4] from-60% to-white">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Failed to load your profile data.</p>
          <p className="text-sm mb-4">Please try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#04663A] text-white px-4 py-2 rounded-lg hover:bg-[#035530] transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-start justify-between bg-gradient-to-b from-[#E6FFF4] from-60% to-white">
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        user={user!}
      />
      <div className="w-full h-full flex flex-col md:hidden">
        <Navbar setIsMobileMenuOpen={setIsMobileMenuOpen} user={user!} />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>

      {isMobileMenuOpen ? (
        <div className="w-3/4 lg:w-4/5 xl:w-6/7 h-full hidden md:flex md:flex-col transition-all duration-700 ease-in-out">
          <Navbar setIsMobileMenuOpen={setIsMobileMenuOpen} user={user!} />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      ) : (
        <div className="w-full h-full hidden md:flex md:flex-col transition-all duration-700 ease-in-out ">
          <Navbar setIsMobileMenuOpen={setIsMobileMenuOpen} user={user!} />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      )}
    </div>
  );
}
