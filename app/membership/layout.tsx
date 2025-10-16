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
    <div className="w-screen h-auto flex bg-gradient-to-b from-[#E6FFF4] from-60% to-white">
        <Sidebar 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          user={user}
        />
        <div className='w-full md:hidden '>
            <Navbar 
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              user={user}
            />
             <div className="">
                {children}
            </div>
        </div>

       
        
        {isMobileMenuOpen ? (
          <div className='w-3/4 lg:w-4/5 xl:w-6/7 hidden md:block'>
            <Navbar
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              user={user}
            />
             <div className="">
                {children}
            </div>
        </div>
        ) :
         <div className='w-full hidden md:block'>
            <Navbar 
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              user={user}
            />
             <div className="  ">
                {children}
            </div>
        </div>
        
        }
        
    </div>
  );
}