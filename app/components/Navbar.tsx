"use client";
import Image from "next/image";
import { ChevronDown, Menu } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function Navbar() {
    const [dropAbout, setDropAbout] = useState(false);
    const dropAboutRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropAboutRef.current && !dropAboutRef.current.contains(event.target as Node)) {
                setDropAbout(false);
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
                    </div>
                    <div>
                        {/* Other menu items can go here */}
                    </div>
                </div>
            </div>
        </>
    );
}