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
      if (status === "authenticated") {
        setIsFetchingUser(true);
        try {
          const res = await fetch("/api/user");
          if (!res.ok) throw new Error("Failed to fetch user");
          const data = await res.json();

          setUser({
            firstName: data.firstName || data.username?.split(" ")[0] || "",
            lastName: data.lastName || "",
            username: data.username,
            status: "member",
            email: data.email,
            photoUrl: data.photoUrl,
          });
        } catch (error) {
          console.error("Error fetching user:", error);
        } finally {
          setIsFetchingUser(false);
        }
      }
    };

    fetchUser();
  }, [status]);

  if (status === "loading" || isFetchingUser) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-white">
        <LoadingBar className="w-24 h-24" />
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
    <div className="w-screen h-auto flex items-start justify-between bg-gradient-to-b from-[#E6FFF4] from-60% to-white">
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        user={user!}
      />
      <div className="w-full md:hidden">
        <Navbar setIsMobileMenuOpen={setIsMobileMenuOpen} user={user!} />
        <div>{children}</div>
      </div>

      {isMobileMenuOpen ? (
        <div className="w-3/4 lg:w-4/5 xl:w-6/7 hidden md:block transition-all duration-700 ease-in-out">
          <Navbar setIsMobileMenuOpen={setIsMobileMenuOpen} user={user!} />
          <div>{children}</div>
        </div>
      ) : (
        <div className="w-full hidden md:block transition-all duration-700 ease-in-out">
          <Navbar setIsMobileMenuOpen={setIsMobileMenuOpen} user={user!} />
          <div>{children}</div>
        </div>
      )}
    </div>
  );
}
