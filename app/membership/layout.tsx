"use client";
import { ReactNode, useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

interface User {
  firstName: string;
  lastName: string;
  status: "member" | "volunteer";
}

interface MembershipLayoutProps {
  children: ReactNode;
}

export default function MembershipLayout({ children }: MembershipLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);

  // Dummy user data
  const user: User = {
    firstName: "Nelida",
    lastName: "Joseph",
    status: "member" 
  };

  return (
    <div className="w-screen h-auto bg-white">
        <Sidebar 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          user={user}
        />
        <div className='w-full'>
            <Navbar 
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              user={user}
            />
             <div className="">
                {children}
            </div>
        </div>
    </div>
  );
}