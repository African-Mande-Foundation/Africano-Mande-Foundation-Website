import {
  LayoutDashboard,
  ListChecks,
  Newspaper,
  FolderKanban,
  HeartHandshake,
  HelpingHand,
  CalendarDays,
  UserCog,
  User, 
  X,
} from "lucide-react";
import Link from "next/link";

interface User {
  firstName: string;
  lastName: string;
  status: "member" | "volunteer";
}

interface sidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (show: boolean) => void;
  user: User; 
}

export default function Sidebar({isMobileMenuOpen, setIsMobileMenuOpen, user}: sidebarProps) {
    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/membership/dashboard" },
        { icon: ListChecks, label: "Tasks", href: "/membership/tasks" },
        { icon: Newspaper, label: "News", href: "/membership/news" },
        { icon: FolderKanban, label: "Projects", href: "/membership/projects" },
        { icon: HeartHandshake, label: "Donations", href: "/membership/donations" },
        { icon: HelpingHand, label: "Volunteer", href: "/membership/volunteer" },
        { icon: CalendarDays, label: "Events", href: "/membership/events" },
        { icon: UserCog, label: "Settings", href: "/membership/settings" },
    ];

    return(
        <div>
            {isMobileMenuOpen && (
                <div className="md:hidden w-screen h-screen absolute z-30 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="w-2/3 absolute flex flex-col gap-y-5 z-40 h-full left-0 top-0 bg-[#04663A] p-2" onClick={(e) => e.stopPropagation()}>
                        <div className="w-full flex items-center justify-end">
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <X className="text-white"/>
                            </button>   
                        </div>
                        <div className="w-full p-2 flex gap-x-4 items-center justify-left">
                            <div className="p-3 border border-white rounded-full"> 
                                <User className="w-6 h-6 text-white"/>
                            </div>
                            <div className="flex flex-col items-center justify-center w-2/3 gap-y-1 text-left text-white text-sm">
                                <span>{user.firstName} {user.lastName}</span> 
                                <span className="capitalize">{user.status}</span> 
                            </div>
                        </div>
                        <div className="w-full overflow-hidden flex flex-col gap-y-2 overflow-y-scroll">
                            {navItems.map((item) => (
                                <Link 
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-center gap-x-3 p-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            
        </div>
    )
}