"use client";
import Image from "next/image";
import { ChevronDown, Menu} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function Navbar() {
    const [dropAbout, setDropAbout] = useState(false);
    const [dropService, setDropService] = useState(false);
    const [dropArchive, setDropArchive] = useState(false);
    const [dropProject, setDropProject] = useState(false);
    const [dropLocation, setDropLocation] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropAboutRef = useRef<HTMLDivElement>(null);
    const dropServiceRef = useRef<HTMLDivElement>(null);
    const dropArchiveRef = useRef<HTMLDivElement>(null);
    const dropProjectRef = useRef<HTMLDivElement>(null);
    const dropLocationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropAboutRef.current && !dropAboutRef.current.contains(event.target as Node)) {
                setDropAbout(false);
            }
            if (dropServiceRef.current && !dropServiceRef.current.contains(event.target as Node)) {
                setDropService(false);
            }
            if (dropArchiveRef.current && !dropArchiveRef.current.contains(event.target as Node)) {
                setDropArchive(false);
            }
            if (dropProjectRef.current && !dropProjectRef.current.contains(event.target as Node)) {
                setDropProject(false);
            }
            if (dropLocationRef.current && !dropLocationRef.current.contains(event.target as Node)) {
                setDropLocation(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <div className="lg:hidden w-full h-20 z-0 bg-[#3b6907]">
                <div className="w-full h-full p-2 lg:px-10 items-center justify-between flex ">
                    <div className="w-15 h-15 cursor-pointer">
                        <Image
                            src="https://firebasestorage.googleapis.com/v0/b/foundation-fm.firebasestorage.app/o/AMF%20Website%20Media%2Flogo4.png?alt=media&token=f3c0fb24-3911-4151-a50d-c41656b1d2ea"
                            alt="logo"
                            width={100}
                            height={200}
                        />
                    </div>
                    <button onClick={() => {setIsMobileMenuOpen(!isMobileMenuOpen)}}>
                        <Menu className="w-10 h-10 text-white cursor-pointer" />
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="lg:hidden fixed h-screen w-screen inset-0 bg-black/40 z-10" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="absolute right-0 top-0 z-30 w-64 h-full bg-[#3b6907]" onClick={(e) => e.stopPropagation()}>
                <div className="w-full h-full gap-y-5 flex flex-col p-2 items-center justify-start">
                    <div className="text-center text-sm font-bold border-0 border-amber-400">                        
                            <span>AFRICANO MANDE FOUNDATION</span>
                        </div>

                        
                    <div className="w-full h-200 items-center justify-start flex flex-col gap-y-2 border-0 border-amber-500 overflow-y-scroll">

                        {/* About Us */}
                        <div className="border w-full border-gray rounded-4xl py-3 px-4" ref={dropAboutRef}>
                            <button
                                className="items-center flex-col justify-between w-full text-white text-sm"
                                onClick={() => setDropAbout(!dropAbout)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span>About us</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${dropAbout ? 'rotate-180' : ''}`} />
                                </div>
                                
                            </button>
                            {dropAbout && (
                                <div className="w-full text-sm">
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Our Mission</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Our Vision</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Core Values</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Governance and Management</button>
                                </div>
                            )}
                            
                        </div>

                        {/* Services */}
                        <div className="border w-full border-gray rounded-4xl py-3 px-4" ref={dropServiceRef}>
                            <button
                                className="items-center flex-col justify-between w-full text-white text-sm text-left"
                                onClick={() => setDropService(!dropService)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span>Our Services</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${dropService ? 'rotate-180' : ''}`} />
                                </div>
                                
                            </button>
                            {dropService && (
                                <div className="w-full text-sm">
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Health Services</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Education Services</button>
                                    <button className="w-full py-3 px-2 flex items-center text-left justify-start border-b border-white text-white">Production and Livelihood Services</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Media and ICT Services</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Technical Services</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Volunteer Services</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Corporate Services</button>
                                </div>
                            )}
                            
                        </div>

                        {/* Archive */}
                        <div className="border w-full border-gray rounded-4xl py-3 px-4" ref={dropArchiveRef}>
                            <button
                                className="items-center flex-col justify-between w-full text-white text-sm"
                                onClick={() => setDropArchive(!dropArchive)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span>Archives</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${dropArchive ? 'rotate-180' : ''}`} />
                                </div>
                                
                            </button>
                            {dropArchive && (
                                <div className="w-full text-sm text-left">
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Project Documents</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Historical Documents</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Project Pictorial</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Project Videos</button>
                                </div>
                            )}
                            
                        </div>


                        {/* Project */}
                        <div className="border w-full border-gray rounded-4xl py-3 px-4" ref={dropProjectRef}>
                            <button
                                className="items-center flex-col justify-between w-full text-white text-sm"
                                onClick={() => setDropProject(!dropProject)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span>Projects</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${dropProject ? 'rotate-180' : ''}`} />
                                </div>
                                
                            </button>
                            {dropProject && (
                                <div className="w-full text-sm">
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Maridi Organics</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Foundation FM</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Foundation Medical Center</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Maridi International University</button>
                                </div>
                            )}
                            
                        </div>


                        {/* Location */}
                        <div className="border w-full border-gray rounded-4xl py-3 px-4" ref={dropLocationRef}>
                            <button
                                className="items-center flex-col justify-between w-full text-white text-sm"
                                onClick={() => setDropLocation(!dropLocation)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span>Location</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${dropLocation ? 'rotate-180' : ''}`} />
                                </div>
                                
                            </button>
                            {dropLocation && (
                                <div className="w-full text-sm">
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Google Map</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Maridi State Link</button>
                                </div>
                            )}
                            
                        </div>

                        {/* Project */}
                        <div className="border w-full border-gray rounded-4xl py-3 px-4" ref={dropProjectRef}>
                            <button
                                className="items-center flex-col justify-between w-full text-white text-sm"
                                
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span>Contact Us</span>
                                </div>
                                
                            </button>
                          </div>  
                        

                        <div className="w-full h-auto mt-2 items-center justify-center flex flex-col text-sm text-center font-bold gap-y-2">
                            <Link href="" className="w-full py-3 px-4 rounded-4xl bg-[#fff] text-[#005e84]">Become a Member</Link>
                            <Link href="" className="w-full py-3 px-4 rounded-4xl bg-[#005e84] text-[#fff]">Login</Link>

                        </div>
                    </div>

                    
                    
                </div>
            </div>

                </div>)}

        
        {/* Desktop Navbar */}
        <div className="hidden lg:block w-screen h-25 bg-[#3b6907]">

            <div className="w-full h-full items-center justify-between 2xl:justify-center 2xl:gap-x-10 lg:px-5 xl:px-20 2xl:px-0 3xl:px-100 flex">
                <div className="items-center justify-center flex flex-col text-sm border-0 border-amber-500 cursor-pointer gap-y-1">
                        <Image
                            src="https://firebasestorage.googleapis.com/v0/b/foundation-fm.firebasestorage.app/o/AMF%20Website%20Media%2Flogo4.png?alt=media&token=f3c0fb24-3911-4151-a50d-c41656b1d2ea"
                            alt="logo"
                            width={100}
                            height={200}
                            className="w-18"
                        />
                        <span className="text-center text-xs">AFRICANO MANDE FOUNDATION</span>
                    </div>

        {/* About Us Dropdown */}
        <div className=" items-center justify-center flex gap-x-1">
            <div className="dropdown ">
            <button className="flex items-center xl:px-4 xl:py-2 px-2 py-2 rounded-4xl border border-white text-white cursor-pointer hover:bg-[#7eaf58] hover:text-[#032303] hover:border-[#032303] font-light text-xs xl:text-sm focus:outline-none transition-all duration-300 ease-in-out">
                About Us
                <ChevronDown className="ml-2 w-4 h-4" />
            </button>
            <div className="small-menu">
                <Link href="#" className="">Our Mission</Link>
                <Link href="#" className="">Our Vision</Link>
                <Link href="#" className="">Core Values</Link>
                <Link href="#" className="">Governance and Management</Link>
            </div>
            </div>

            <div className="dropdown ">
            <button className="flex items-center xl:px-4 xl:py-2 px-2 py-2 rounded-4xl border border-white text-white cursor-pointer hover:bg-[#7eaf58] hover:text-[#032303] hover:border-[#032303] font-light text-xs xl:text-sm focus:outline-none transition-all duration-300 ease-in-out">
                Services
                <ChevronDown className="ml-2 w-4 h-4" />
            </button>
            <div className="small-menu">
                <Link href="#" className="">Health Services</Link>
                <Link href="#" className="">Education Services</Link>
                <Link href="#" className="">Production and Livelihood Services</Link>
                <Link href="#" className="">Media and ICT services</Link>
                <Link href="#" className="">Technical Services</Link>
                <Link href="#" className="">Volunteer Services</Link>
                <Link href="#" className="">Corporate Services</Link>
            </div>
            </div>


            <div className="dropdown ">
            <button className="flex items-center xl:px-4 xl:py-2 px-2 py-2 rounded-4xl border border-white text-white cursor-pointer hover:bg-[#7eaf58] hover:text-[#032303] hover:border-[#032303] font-light text-xs xl:text-sm focus:outline-none transition-all duration-300 ease-in-out">
                Archives
                <ChevronDown className="ml-2 w-4 h-4" />
            </button>
            <div className="small-menu">
                <Link href="#" className="">Project documents</Link>
                <Link href="#" className="">Historic documents</Link>
                <Link href="#" className="">Project pictorials</Link>
                <Link href="#" className="">Project videos</Link>
            </div>
            </div>


            <div className="dropdown ">
            <button className="flex items-center xl:px-4 xl:py-2 px-2 py-2 rounded-4xl border border-white text-white cursor-pointer hover:bg-[#7eaf58] hover:text-[#032303] hover:border-[#032303] font-light text-xs xl:text-sm focus:outline-none transition-all duration-300 ease-in-out">
                Projects
                <ChevronDown className="ml-2 w-4 h-4" />
            </button>
            <div className="small-menu">
                <Link href="#" className="">Maridi Organics</Link>
                <Link href="#" className="">Foundation FM</Link>
                <Link href="#" className="">Foundation Medical Center</Link>
                <Link href="#" className="">Maridi International University</Link>
            </div>
            </div>


            <div className="dropdown ">
            <button className="flex items-center xl:px-4 xl:py-2 px-2 py-2 rounded-4xl border border-white text-white cursor-pointer hover:bg-[#7eaf58] hover:text-[#032303] hover:border-[#032303] font-light text-xs xl:text-sm focus:outline-none transition-all duration-300 ease-in-out">
                Location
                <ChevronDown className="ml-2 w-4 h-4" />
            </button>
            <div className="small-menu">
                <Link href="#" className="">Google Map</Link>
                <Link href="#" className="">Maridi State Link</Link>
                <Link href="#" className="">Core Values</Link>
                <Link href="#" className="">Governance and Management</Link>
            </div>
            </div>

            <div>
                <button className="flex items-center xl:px-4 xl:py-2 px-2 py-2 rounded-4xl border border-white text-white cursor-pointer hover:bg-[#7eaf58] hover:text-[#032303] hover:border-[#032303] font-light text-xs xl:text-sm focus:outline-none transition-all duration-300 ease-in-out">
                    Contact Us
                </button>
            </div>


        </div>
        <div className=" items-center justify-center flex gap-x-2">
            <button className="flex items-center xl:px-4 xl:py-2 px-2 py-2 rounded-4xl border border-[#fff] bg-[#fff] text-[#005e84] cursor-pointer hover:bg-[#005e84] hover:text-[#fff] hover:border-[#005e84] text-xs xl:text-base font-bold focus:outline-none transition-all duration-300 ease-in-out">
                    Become a Member
                </button>
            <button className="flex items-center xl:px-6 xl:py-2 px-3 py-2 rounded-4xl border border-[#005e84] bg-[#005e84] text-white cursor-pointer hover:bg-[#fff] hover:text-[#005e84] hover:border-[#fff] text-xs xl:text-base font-bold focus:outline-none transition-all duration-300 ease-in-out">
                    Log In
                </button>

        </div>
        
        
    </div>
</div>


            
        </>
    );
}