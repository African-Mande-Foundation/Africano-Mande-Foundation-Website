"use client";
import { ReactNode, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import LoadingBar from "../components/LoadingBar";
import { User } from "@/lib/types";

interface MembershipLayoutProps {
  children: ReactNode;
}


export default function MembershipLayout({ children }: MembershipLayoutProps) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFetchingUser, setIsFetchingUser] = useState(false);

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
          
          if (data.role) {
            // Check if role is an object with name property or just a string
            const roleName = typeof data.role === 'object' ? data.role.name : data.role;
            
            if (roleName === "Volunteer") {
              userStatus = "volunteer";
            } else if (roleName === "Authenticated") {
              userStatus = "member";
            }
          }

          console.log('User role:', data.role, 'Status set to:', userStatus);

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
            status: userStatus, // Use the determined status
            email: data.email || session.user?.email || "",
            photoUrl: userImage && userImage.trim() !== "" 
              ? userImage 
              : ""
          });
        } catch (error) {
          console.error("Error fetching user:", error);
          
          const firstName = session.user?.name?.split(" ")[0] || "";
          const lastName = session.user?.name?.split(" ")[1] || "";
          const userImage = session.user?.image;
          
          // Fallback to session data if API fails
          setUser({
            id: 0,
            documentId: "",
            provider: "google",
            confirmed: true,
            blocked: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
            firstName,
            lastName,
            username: session.user?.name || "",
            status: "member", // Default to member if API fails
            email: session.user?.email || "",
            photoUrl: userImage && userImage.trim() !== "" 
              ? userImage 
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=04663A&color=ffffff&size=128`
          });
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
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <p className="text-lg font-semibold">Please sign in to access this page.</p>
      </div>
    );
  }

  if (status === "authenticated" && !user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <p className="text-lg font-semibold">
          Failed to load your profile data.
        </p>
        <p className="text-sm mt-2">Please try refreshing the page.</p>
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
