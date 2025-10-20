"use client";
import Image from "next/image";
import { ChevronDown, Menu, LogOut } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Contact from "../components/Contact";
import { useSession, signOut } from "next-auth/react";

interface ContactProps {
  showContactModal: boolean;
  setShowContactModal: (show: boolean) => void;
}

export default function Navbar({
  showContactModal,
  setShowContactModal,
}: ContactProps) {
  const { data: session, status } = useSession();
  const [dropAbout, setDropAbout] = useState(false);
  const [dropService, setDropService] = useState(false);
  const [dropArchive, setDropArchive] = useState(false);
  const [dropProject, setDropProject] = useState(false);
  const [dropLocation, setDropLocation] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const dropAboutRef = useRef<HTMLDivElement>(null);
  const dropServiceRef = useRef<HTMLDivElement>(null);
  const dropArchiveRef = useRef<HTMLDivElement>(null);
  const dropProjectRef = useRef<HTMLDivElement>(null);
  const dropLocationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropAboutRef.current &&
        !dropAboutRef.current.contains(event.target as Node)
      )
        setDropAbout(false);
      if (
        dropServiceRef.current &&
        !dropServiceRef.current.contains(event.target as Node)
      )
        setDropService(false);
      if (
        dropArchiveRef.current &&
        !dropArchiveRef.current.contains(event.target as Node)
      )
        setDropArchive(false);
      if (
        dropProjectRef.current &&
        !dropProjectRef.current.contains(event.target as Node)
      )
        setDropProject(false);
      if (
        dropLocationRef.current &&
        !dropLocationRef.current.contains(event.target as Node)
      )
        setDropLocation(false);
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      )
        setShowLogout(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAuthenticated = status === "authenticated";
  if (isAuthenticated) console.log(session.user?.image);
  return (
    <>
      <div className="lg:hidden w-screen fixed h-20 z-50 bg-[#3b6907]">
        <div className="w-full h-full p-2 lg:px-10 items-center justify-between flex ">
          <div className="w-15 h-15 cursor-pointer">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/foundation-fm.firebasestorage.app/o/AMF%20Website%20Media%2Flogo4.png?alt=media&token=f3c0fb24-3911-4151-a50d-c41656b1d2ea"
              alt="logo"
              width={100}
              height={200}
            />
          </div>
          <button
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
          >
            <Menu className="w-10 h-10 text-white cursor-pointer" />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed h-screen w-screen inset-0 bg-black/40 z-60"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="absolute right-0 top-0 z-30 w-64 h-full bg-[#3b6907]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-full gap-y-5 flex flex-col p-2 items-center justify-start">
              <div className="text-white text-center text-sm font-bold border-0 border-amber-400">
                <span>AFRICANO MANDE FOUNDATION</span>
              </div>

              <div className="w-full h-200 items-center justify-start flex flex-col gap-y-2 border-0 border-amber-500 overflow-y-scroll">
                {/* About Us */}
                <div
                  className="border w-full border-white rounded-4xl py-3 px-4"
                  ref={dropAboutRef}
                >
                  <button
                    className="items-center flex-col justify-between w-full text-white text-sm"
                    onClick={() => setDropAbout(!dropAbout)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>About us</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${dropAbout ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>
                  {dropAbout && (
                    <div className="w-full text-sm">
                      <button
                        className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white"
                        onClick={() => {
                          const el = document.getElementById("about-us");
                          if (el) {
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                          setDropAbout(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Our Mission
                      </button>
                      <button
                        className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white"
                        onClick={() => {
                          const el = document.getElementById("about-us");
                          if (el) {
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                          setDropAbout(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Our Vision
                      </button>
                      <button
                        className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white"
                        onClick={() => {
                          const el = document.getElementById("about-us");
                          if (el) {
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                          setDropAbout(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Core Values
                      </button>
                      <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">
                        Governance and Management
                      </button>
                    </div>
                  )}
                </div>

                {/* Services */}
                <div
                  className="border w-full border-white rounded-4xl py-3 px-4"
                  ref={dropServiceRef}
                >
                  <button
                    className="items-center flex-col justify-between w-full text-white text-sm text-left"
                    onClick={() => setDropService(!dropService)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>Our Services</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${dropService ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>
                  {dropService && (
                    <div className="w-full text-sm">
                      <button
                        className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white"
                        onClick={() => {
                          const el = document.getElementById("service-1");
                          if (el) {
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                          setDropAbout(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Health Services
                      </button>
                      <button
                        className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white"
                        onClick={() => {
                          const el = document.getElementById("service-2");
                          if (el) {
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                          setDropAbout(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Education Services
                      </button>
                      <button
                        className="w-full py-3 px-2 flex items-center text-left justify-start border-b border-white text-white"
                        onClick={() => {
                          const el = document.getElementById("service-3");
                          if (el) {
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                          setDropAbout(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Production and Livelihood Services
                      </button>
                      <button
                        className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white"
                        onClick={() => {
                          const el = document.getElementById("service-4");
                          if (el) {
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                          setDropAbout(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Media and ICT Services
                      </button>
                      <button
                        className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white"
                        onClick={() => {
                          const el = document.getElementById("service-5");
                          if (el) {
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                          setDropAbout(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Technical Services
                      </button>
                      <button
                        className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white"
                        onClick={() => {
                          const el = document.getElementById("service-6");
                          if (el) {
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                          setDropAbout(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Volunteer Services
                      </button>
                      <button
                        className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white"
                        onClick={() => {
                          const el = document.getElementById("service-7");
                          if (el) {
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                          setDropAbout(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Corporate Services
                      </button>
                    </div>
                  )}
                </div>

                {/* Archive */}
                <div
                  className="border w-full border-white rounded-4xl py-3 px-4"
                  ref={dropArchiveRef}
                >
                  <button
                    className="items-center flex-col justify-between w-full text-white text-sm"
                    onClick={() => setDropArchive(!dropArchive)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>Archives</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${dropArchive ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>
                  {dropArchive && (
                    <div className="w-full text-sm text-left">
                      <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">
                        Project Documents
                      </button>
                      <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">
                        Historical Documents
                      </button>
                      <button
                        className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white"
                        onClick={() => {
                          const el = document.getElementById("gallery");
                          if (el) {
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                          setDropAbout(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Project Pictorial
                      </button>
                      <button
                        className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white"
                        onClick={() => {
                          const el = document.getElementById("video");
                          if (el) {
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                          setDropAbout(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Project Videos
                      </button>
                    </div>
                  )}
                </div>

                {/* Project */}
                <div
                  className="border w-full border-white rounded-4xl py-3 px-4"
                  ref={dropProjectRef}
                >
                  <button
                    className="items-center flex-col justify-between w-full text-white text-sm"
                    onClick={() => setDropProject(!dropProject)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>Projects</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${dropProject ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>
                  {dropProject && (
                    <div className="w-full text-sm">
                      <button
                        className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white"
                        onClick={() => {
                          const el = document.getElementById("organics");
                          if (el) {
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                          setDropAbout(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Maridi Organics
                      </button>
                      <button
                        className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white"
                        onClick={() => {
                          const el = document.getElementById("fm");
                          if (el) {
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                          setDropAbout(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Foundation FM
                      </button>
                      <button
                        className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white"
                        onClick={() => {
                          const el = document.getElementById("medical");
                          if (el) {
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                          setDropAbout(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Foundation Medical Center
                      </button>
                      <button
                        className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white"
                        onClick={() => {
                          const el = document.getElementById("university");
                          if (el) {
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                          setDropAbout(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Maridi International University
                      </button>
                    </div>
                  )}
                </div>

                {/* Location */}
                <div
                  className="border w-full border-white rounded-4xl py-3 px-4"
                  ref={dropLocationRef}
                >
                  <button
                    className="items-center flex-col justify-between w-full text-white text-sm"
                    onClick={() => setDropLocation(!dropLocation)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>Location</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${dropLocation ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>
                  {dropLocation && (
                    <div className="w-full text-sm">
                      <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">
                        Google Map
                      </button>
                      <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">
                        Maridi State Link
                      </button>
                    </div>
                  )}
                </div>

                {/* Contact */}
                <div className="border w-full border-white rounded-4xl py-3 px-4">
                  <button
                    className="items-center flex-col justify-between w-full text-white text-sm"
                    onClick={() => {
                      setShowContactModal(true);
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>Contact Us</span>
                    </div>
                  </button>
                </div>

                <div className="w-full h-auto mt-2 items-center justify-center flex flex-col text-sm text-center font-bold gap-y-2">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/membership"
                        className="w-full py-3 px-4 rounded-4xl bg-[#fff] text-[#005e84]"
                      >
                        Go to Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full py-3 px-4 rounded-4xl bg-[#005e84] text-[#fff] flex items-center justify-center gap-x-2"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                      {session.user?.image && (
                        <Image
                          src={session.user.image}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="rounded-full mt-2"
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <Link
                        href="/register"
                        className="w-full py-3 px-4 rounded-4xl bg-[#fff] text-[#005e84]"
                      >
                        Become a Member
                      </Link>
                      <Link
                        href="/login"
                        className="w-full py-3 px-4 rounded-4xl bg-[#005e84] text-[#fff]"
                      >
                        Login
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Navbar */}
      <div className="hidden lg:block fixed z-50 w-full h-30 bg-[#3b6907]">
        <div className="w-full h-full items-center justify-center gap-x-2 xl:gap-x-10 2xl:justify-center  flex">
          <div className="items-center justify-center flex flex-col text-sm border-0 border-amber-500 cursor-pointer gap-y-1">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/foundation-fm.firebasestorage.app/o/AMF%20Website%20Media%2Flogo4.png?alt=media&token=f3c0fb24-3911-4151-a50d-c41656b1d2ea"
              alt="logo"
              width={100}
              height={200}
              className="w-18"
            />
            <span className="text-white text-center text-xs">
              AFRICANO MANDE FOUNDATION
            </span>
          </div>

          {/* About Us Dropdown */}
          <div className=" items-center justify-center flex gap-x-1">
            <div className="dropdown ">
              <button
                className="flex items-center xl:px-4 xl:py-2 px-2 py-2 rounded-4xl border border-white text-white cursor-pointer hover:bg-[#7eaf58] hover:text-[#032303] hover:border-[#032303] font-light text-xs xl:text-sm focus:outline-none transition-all duration-300 ease-in-out"
                onClick={() => {
                  const el = document.getElementById("about-us");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                  setDropAbout(false);
                  setIsMobileMenuOpen(false);
                }}
              >
                About Us
                <ChevronDown className="ml-2 w-4 h-4" />
              </button>
              <div className="small-menu">
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById("about-us");
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                    setDropAbout(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Our Mission
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById("about-us");
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                    setDropAbout(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Our Vision
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById("about-us");
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                    setDropAbout(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Core Values
                </div>
                <div className="cursor-pointer">Governance and Management</div>
              </div>
            </div>

            <div className="dropdown ">
              <button
                className="flex items-center xl:px-4 xl:py-2 px-2 py-2 rounded-4xl border border-white text-white cursor-pointer hover:bg-[#7eaf58] hover:text-[#032303] hover:border-[#032303] font-light text-xs xl:text-sm focus:outline-none transition-all duration-300 ease-in-out"
                onClick={() => {
                  const el = document.getElementById("service-1");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                  setDropAbout(false);
                  setIsMobileMenuOpen(false);
                }}
              >
                Services
                <ChevronDown className="ml-2 w-4 h-4" />
              </button>
              <div className="small-menu">
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById("service-1");
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                    setDropAbout(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Health Services
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById("service-2");
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                    setDropAbout(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Education Services
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById("service-3");
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                    setDropAbout(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Production and Livelihood Services
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById("service-4");
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                    setDropAbout(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Media and ICT services
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById("service-5");
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                    setDropAbout(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Technical Services
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById("service-6");
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                    setDropAbout(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Volunteer Services
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById("service-7");
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                    setDropAbout(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Corporate Services
                </div>
              </div>
            </div>

            <div className="dropdown ">
              <button
                className="flex items-center xl:px-4 xl:py-2 px-2 py-2 rounded-4xl border border-white text-white cursor-pointer hover:bg-[#7eaf58] hover:text-[#032303] hover:border-[#032303] font-light text-xs xl:text-sm focus:outline-none transition-all duration-300 ease-in-out"
                onClick={() => {
                  const el = document.getElementById("gallery");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                  setDropAbout(false);
                  setIsMobileMenuOpen(false);
                }}
              >
                Archives
                <ChevronDown className="ml-2 w-4 h-4" />
              </button>
              <div className="small-menu">
                <div className="cursor-pointer">Project documents</div>
                <div className="cursor-pointer">Historic documents</div>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById("gallery");
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                    setDropAbout(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Project pictorials
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById("video");
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                    setDropAbout(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Project videos
                </div>
              </div>
            </div>

            <div className="dropdown ">
              <button
                className="flex items-center xl:px-4 xl:py-2 px-2 py-2 rounded-4xl border border-white text-white cursor-pointer hover:bg-[#7eaf58] hover:text-[#032303] hover:border-[#032303] font-light text-xs xl:text-sm focus:outline-none transition-all duration-300 ease-in-out"
                onClick={() => {
                  const el = document.getElementById("projects");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                  setDropAbout(false);
                  setIsMobileMenuOpen(false);
                }}
              >
                Projects
                <ChevronDown className="ml-2 w-4 h-4" />
              </button>
              <div className="small-menu">
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById("organics");
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                    setDropAbout(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Maridi Organics
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById("fm");
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                    setDropAbout(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Foundation FM
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById("medical");
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                    setDropAbout(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Foundation Medical Center
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById("university");
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                    setDropAbout(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Maridi International University
                </div>
              </div>
            </div>

            <div className="dropdown ">
              <button
                className="flex items-center xl:px-4 xl:py-2 px-2 py-2 rounded-4xl border border-white text-white cursor-pointer hover:bg-[#7eaf58] hover:text-[#032303] hover:border-[#032303] font-light text-xs xl:text-sm focus:outline-none transition-all duration-300 ease-in-out"
                onClick={() => {
                  const el = document.getElementById("location");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                  setDropAbout(false);
                  setIsMobileMenuOpen(false);
                }}
              >
                Location
                <ChevronDown className="ml-2 w-4 h-4" />
              </button>
              <div className="small-menu">
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById("location");
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                    setDropAbout(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Google Map
                </div>
                <div className="cursor-pointer">Maridi State Link</div>
              </div>
            </div>

            <div>
              <button
                className="flex items-center xl:px-4 xl:py-2 px-2 py-2 rounded-4xl border border-white text-white cursor-pointer hover:bg-[#7eaf58] hover:text-[#032303] hover:border-[#032303] font-light text-xs xl:text-sm focus:outline-none transition-all duration-300 ease-in-out"
                onClick={() => {
                  setShowContactModal(true);
                }}
              >
                Contact Us
              </button>
            </div>
          </div>
          <div
            className="items-center justify-center flex gap-x-4"
            ref={profileRef}
          >
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* Dashboard Button */}
                <Link
                  href="/membership"
                  className="flex items-center xl:px-6 xl:py-2 px-3 py-2 rounded-4xl border border-[#005e84] bg-[#005e84] text-white cursor-pointer hover:bg-[#fff] hover:text-[#005e84] hover:border-[#fff] text-xs xl:text-base font-bold focus:outline-none transition-all duration-300 ease-in-out"
                >
                  Go to Dashboard
                </Link>

                {/* Profile & Logout */}
                <div className="flex items-center gap-3">

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-7 h-7 rounded-full text-white"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/register"
                  className="flex items-center xl:px-4 xl:py-2 px-2 py-2 rounded-4xl border border-[#fff] bg-[#fff] text-[#005e84] cursor-pointer hover:bg-[#005e84] hover:text-[#fff] hover:border-[#005e84] text-xs xl:text-base font-bold focus:outline-none transition-all duration-300 ease-in-out"
                >
                  Become a Member
                </Link>
                <Link
                  href="/login"
                  className="flex items-center xl:px-6 xl:py-2 px-3 py-2 rounded-4xl border border-[#005e84] bg-[#005e84] text-white cursor-pointer hover:bg-[#fff] hover:text-[#005e84] hover:border-[#fff] text-xs xl:text-base font-bold focus:outline-none transition-all duration-300 ease-in-out"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <Contact
        showContactModal={showContactModal}
        setShowContactModal={setShowContactModal}
      />
    </>
  );
}
