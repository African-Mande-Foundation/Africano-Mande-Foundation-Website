"use client";
import Image from "next/image";
import { ChevronDown, Menu } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function Navbar() {
    const [dropAbout, setDropAbout] = useState(false);
    const [dropService, setDropService] = useState(false);
    const [dropArchive, setDropArchive] = useState(false);
    const [dropProject, setDropProject] = useState(false);
    const [dropLocation, setDropLocation] = useState(false);
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
            <div className="w-full h-20 z-0 bg-[#3b6907]">
                <div className="w-full h-full p-2 items-center justify-between flex ">
                    <div className="w-15 h-15 cursor-pointer">
                        <Image
                            src="https://firebasestorage.googleapis.com/v0/b/foundation-fm.firebasestorage.app/o/AMF%20Website%20Media%2Flogo4.png?alt=media&token=f3c0fb24-3911-4151-a50d-c41656b1d2ea"
                            alt="logo"
                            width={100}
                            height={200}
                        />
                    </div>
                    <div>
                        <Menu className="w-10 h-10 text-white cursor-pointer" />
                    </div>
                </div>
            </div>

            <div className="absolute right-0 top-0 z-30 w-64 h-screen bg-[#3b6907]">
                <div className="w-full h-full flex flex-col p-2 items-center justify-center">
                    <div className="w-full h-auto">
                        <div className="border border-gray rounded-4xl p-4" ref={dropAboutRef}>
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
                                    <button className="w-full py-3 px-2 flex items-center justify-start border-b border-white text-white">Our Mission</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start border-b border-white text-white">Our Vision</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start border-b border-white text-white">Core Values</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start border-b border-white text-white">Governance and Management</button>
                                </div>
                            )}
                            
                        </div>

                        {/* Services */}
                        <div className="border border-gray rounded-4xl p-4" ref={dropServiceRef}>
                            <button
                                className="items-center flex-col justify-between w-full text-white text-sm"
                                onClick={() => setDropService(!dropService)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span>About us</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${dropService ? 'rotate-180' : ''}`} />
                                </div>
                                
                            </button>
                            {dropService && (
                                <div className="w-full text-sm">
                                    <button className="w-full py-3 px-2 flex items-center justify-start border-b border-white text-white">Our Mission</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start border-b border-white text-white">Our Vision</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start border-b border-white text-white">Core Values</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start border-b border-white text-white">Governance and Management</button>
                                </div>
                            )}
                            
                        </div>

                        {/* Archive */}
                        <div className="border border-gray rounded-4xl p-4" ref={dropArchiveRef}>
                            <button
                                className="items-center flex-col justify-between w-full text-white text-sm"
                                onClick={() => setDropArchive(!dropArchive)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span>About us</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${dropArchive ? 'rotate-180' : ''}`} />
                                </div>
                                
                            </button>
                            {dropArchive && (
                                <div className="w-full text-sm">
                                    <button className="w-full py-3 px-2 flex items-center justify-start border-b border-white text-white">Our Mission</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start border-b border-white text-white">Our Vision</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start border-b border-white text-white">Core Values</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start border-b border-white text-white">Governance and Management</button>
                                </div>
                            )}
                            
                        </div>


                        {/* Project */}
                        <div className="border border-gray rounded-4xl p-4" ref={dropProjectRef}>
                            <button
                                className="items-center flex-col justify-between w-full text-white text-sm"
                                onClick={() => setDropProject(!dropProject)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span>About us</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${dropProject ? 'rotate-180' : ''}`} />
                                </div>
                                
                            </button>
                            {dropProject && (
                                <div className="w-full text-sm">
                                    <button className="w-full py-3 px-2 flex items-center justify-start border-b border-white text-white">Our Mission</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start border-b border-white text-white">Our Vision</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start border-b border-white text-white">Core Values</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start border-b border-white text-white">Governance and Management</button>
                                </div>
                            )}
                            
                        </div>


                        {/* Location */}
                        <div className="border border-gray rounded-4xl p-4" ref={dropLocationRef}>
                            <button
                                className="items-center flex-col justify-between w-full text-white text-sm"
                                onClick={() => setDropLocation(!dropLocation)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span>About us</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${dropLocation ? 'rotate-180' : ''}`} />
                                </div>
                                
                            </button>
                            {dropLocation && (
                                <div className="w-full text-sm">
                                    <button className="w-full py-3 px-2 flex items-center justify-start border-b border-white text-white">Our Mission</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start border-b border-white text-white">Our Vision</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start border-b border-white text-white">Core Values</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start border-b border-white text-white">Governance and Management</button>
                                </div>
                            )}
                            
                        </div>
                    </div>
                    <div>
                        {/* Other menu items can go here */}
                    </div>
                </div>
            </div>
        </>
    );
}