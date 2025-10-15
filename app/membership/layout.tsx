import { ReactNode } from 'react';
import Sidebar from './components/Sidebar';

interface MembershipLayoutProps {
  children: ReactNode;
}

export default function MembershipLayout({ children }: MembershipLayoutProps) {
  return (
    <div className="w-screen h-auto">
        <Sidebar/>
        <div className=''>
             <div className="">
                {children}
            </div>
        </div>
     
      
    </div>
  );
}