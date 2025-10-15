import Image from "next/image";
import { LogOut, Menu} from "lucide-react";

interface User {
  firstName: string;
  lastName: string;
  status: "member" | "volunteer";
}

interface navbarProps {
  setIsMobileMenuOpen: (show: boolean) => void;
  user: User; 
}

export default function Navbar({setIsMobileMenuOpen, user}: navbarProps) {
    return(
        <div className="w-full flex items-center justify-between h-auto p-2 bg-white">
            <div className="flex items-center justify-center gap-x-2 h-full" >
                <button onClick={() => {
                    setIsMobileMenuOpen(true);
                }}>
                    <Menu className="text-black w-10"/>
                </button>
                
                <p className="text-[#032303] text-base font-bold">Hello, {user.firstName}</p>
            </div>
            <div className="flex items-center justify-center gap-x-2 h-full">
                <button>
                    <LogOut className="text-black"/>
                </button>
                
                <Image src="https://firebasestorage.googleapis.com/v0/b/foundation-fm.firebasestorage.app/o/AMF%20Website%20Media%2Flogo1.png?alt=media&token=2a0f76b1-4a0b-4f12-935c-5cb6cfc03f10" alt="logo" className="w-12 mb-5" width={500} height={500}/> 
            </div>
        </div>
    )
}