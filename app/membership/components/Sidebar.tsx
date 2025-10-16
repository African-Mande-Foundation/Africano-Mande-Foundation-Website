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
  Menu
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
        <>
            {/* Mobile Sidebar */}
            <div className={`md:hidden fixed inset-0 z-30 transition-all duration-500 ease-out ${
                isMobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
            }`}>
                <div 
                    className="w-screen h-screen absolute bg-black/50 transition-opacity duration-500 ease-out" 
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                <div className={`w-2/3 absolute flex flex-col gap-y-5 z-40 h-full left-0 top-0 bg-[#04663A] p-2 transform transition-all duration-500 ease-out ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`} onClick={(e) => e.stopPropagation()}>
                    <div className="w-full flex items-center justify-end">
                        <button onClick={() => setIsMobileMenuOpen(false)} className="transition-all duration-300 ease-out hover:scale-110 hover:rotate-90">
                            <X className="text-white"/>
                        </button>   
                    </div>
                    <div className="w-full p-2 flex gap-x-2 items-center justify-left">
                        <div className="p-3 border border-white rounded-full transition-all duration-300 ease-out hover:bg-white/20 hover:scale-105"> 
                            <User className="w-6 h-6 text-white"/>
                        </div>
                        <div className="flex flex-col items-start justify-start w-2/3 gap-y-1 text-left text-white text-sm">
                            <span className="transition-all duration-300 ease-out">{user.firstName} {user.lastName}</span> 
                            <span className="capitalize transition-all duration-300 ease-out">{user.status}</span> 
                        </div>
                    </div>
                    <div className="w-full overflow-hidden flex flex-col gap-y-2 overflow-y-scroll">
                        {navItems.map((item, index) => (
                            <Link 
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-x-3 p-3 text-white hover:bg-white/20 rounded-lg transition-all duration-300 ease-out hover:translate-x-2 hover:scale-105"
                                onClick={() => setIsMobileMenuOpen(false)}
                                style={{
                                    transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms'
                                }}
                            >
                                <item.icon className="w-5 h-5 transition-all duration-300 ease-out" />
                                <span className="transition-all duration-300 ease-out">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className={`hidden md:block h-screen bg-[#04663A] transition-all duration-700 ease-in-out ${
                isMobileMenuOpen ? 'w-1/4 lg:w-1/5 xl:w-1/7' : 'w-16'
            }`}>
                <div className="w-full flex flex-col gap-y-5 h-full bg-[#04663A] p-2">
                    <div className={`w-full flex items-center  ${isMobileMenuOpen ? 'justify-end':'justify-start'}`}>
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                            className="transition-all duration-300 ease-out hover:scale-110 cursor-pointer hover:bg-white/10 p-2 rounded-lg"
                        >
                            {isMobileMenuOpen ? (
                                <X className="text-white w-6 h-6 transition-all duration-300 ease-out hover:rotate-90"/>
                            ) : (
                                <Menu className="text-white w-6 h-6 transition-all duration-300 ease-out hover:rotate-180"/>
                            )}
                        </button>   
                    </div>
                    
                    <div className={`flex items-center transition-all duration-500 ease-in-out ${
                        isMobileMenuOpen ? 'h-[80px] gap-x-2 justify-left' : 'h-[80px] justify-center'
                    }`}>
                        <div className="p-3 border cursor-pointer border-white rounded-full transition-all duration-300 ease-out hover:bg-white/20 hover:scale-110"> 
                            <User className="w-5 h-5 text-white"/>
                        </div>
                        <div className={`flex flex-col items-start justify-start gap-y-1 text-left text-white text-sm transition-all duration-500 ease-in-out overflow-hidden ${
                            isMobileMenuOpen ? 'w-2/3 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-4'
                        }`}>
                            <span className="transition-all duration-300 ease-out">{user.firstName} {user.lastName}</span>
                            <span className="capitalize whitespace-nowrap transition-all duration-500 ease-in-out">{user.status}</span> 
                        </div>
                    </div>
                    
                    <div className="w-full overflow-hidden flex flex-col gap-y-2">
                        {navItems.map((item, index) => (
                            <Link 
                                key={item.label}
                                href={item.href}
                                className="flex items-center cursor-pointer p-3 text-white hover:bg-white/20 rounded-lg transition-all duration-300 ease-out group hover:scale-105 gap-x-3 justify-start"
                                title={!isMobileMenuOpen ? item.label : undefined}
                                style={{
                                    transitionDelay: `${index * 30}ms`
                                }}
                            >
                                <item.icon className="w-5 h-5 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-12 flex-shrink-0" />
                                <span className={`whitespace-nowrap transition-all duration-500 ease-in-out overflow-hidden ${
                                    isMobileMenuOpen ? 'opacity-100 translate-x-0 max-w-full' : 'opacity-0 -translate-x-4 max-w-0'
                                }`}>
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}