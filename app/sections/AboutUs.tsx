"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const coreValues = [
  "Creativity", "Humility", "Learning",
  "Optimism", "Resilience", "Teamwork",
  "Ethics", "Colaboration", "Spirituality"
];

export default function AboutUs () {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  let hideTimeout: NodeJS.Timeout | null = null;

  // Handle hover with delay for hiding
  const handleMouseOver = (tab: string) => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
    setActiveTab(tab);
  };

  const handleMouseOut = () => {
    hideTimeout = setTimeout(() => {
      setActiveTab(null);
    }, 2200);
  };

  return (
    <div className="bg-white w-full items-center justify-center flex">
    <div className=" p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex flex-col items-start justify-center  md:flex-row  h-auto">
        <div className="relative w-full md:w-1/2 h-auto">
            <div className=" absolute top-0 left-0 z-0 w-full">
                <Image src="https://firebasestorage.googleapis.com/v0/b/foundation-fm.firebasestorage.app/o/AMF%20Website%20Media%2Fdeco-img.png?alt=media&token=e27881aa-d63a-4ee8-b5c7-57d68a3a788a" alt="aboutus bg pic" width={200} height={100} className="w-10 h-auto object-contain"/>
            </div>
            <div className=" top-0 z-20 w-full">
                <div className="w-9/10 md:w-95/100 lg:w-3/4 flex items-center z-10 relative justify-end ">
                    <Image src="https://firebasestorage.googleapis.com/v0/b/foundation-fm.firebasestorage.app/o/AMF%20Website%20Media%2Fabt2.JPG?alt=media&token=6852fc03-1b95-4148-9838-3850509663a0" alt="about us img" width={789} height={591} className="w-95/100 h-auto mt-10 object-contain rounded-sm about-shadow transform transition-transform duration-300 "/>
                </div>  
            </div>
             
        </div>
        <div className="items-start justify-start  md:w-1/2 flex flex-col mt-10 gap-y-4">

            <div className="text-xl lg:text-2xl font-medium text-[#3b6907] items-center justify-center flex gap-x-2"><div className="bg-[#3b6907] w-1 h-6"></div><p>About Us</p></div>
            <div className="text-[#6f6f6f] text-sm md:text-base text-justify flex flex-col p-1 gap-y-2">
                <p>The Africano Mande Foundation (AMF) was founded in 2018 by the family and friends of Africano Mande Gedima as a non-political, non-governmental and a legacy Foundation named after <Link href="#" className="text-[#0000ff] underline">Africano Mande Gedima</Link>, the first Governor of <Link href="#" className="text-[#0000ff] underline">Maridi State</Link>.</p>
                <p>AMF was founded in order to champion Africano Mande’s philosophy, ideals and vision through the philanthropic and non-governmental tracks with the aim of “giving back” to the community opportunities for socioeconomic transformation for improved community wellbeing through capacity development for innovation, access to social services (education, health etc), community awareness and community development.</p>
            </div>
            {/* Mission, Vision, Core Values Tabs */}
            <div className="mt-8 w-full">
                <ul className="flex gap-4 mb-4">
                    <li>
                        <button
                            className={`px-4 py-2 rounded-3xl border-2 border-[#3b6907] transition-all duration-200 ${
                                activeTab === "mission" ? "bg-white text-[#3b6907]" : " bg-[#3b6907] text-white hover:bg-[#fff] hover:text-[#3b6907]"
                            }`}
                            onMouseOver={() => handleMouseOver("mission")}
                            onMouseOut={handleMouseOut}
                        >
                            Our Mission
                        </button>
                    </li>
                    <li>
                        <button
                            className={`px-4 py-2 rounded-3xl border-2 border-[#3b6907] transition-all duration-200 ${
                                activeTab === "vision" ? "bg-white text-[#3b6907]" : " bg-[#3b6907] text-white hover:bg-[#fff] hover:text-[#3b6907]"
                            }`}
                            onMouseOver={() => handleMouseOver("vision")}
                            onMouseOut={handleMouseOut}
                        >
                            Our Vision
                        </button>
                    </li>
                    <li>
                        <button
                            className={`px-4 py-2 rounded-3xl border-2 border-[#3b6907] transition-all duration-200 ${
                                activeTab === "corevalues" ? "bg-white text-[#3b6907]" : " bg-[#3b6907] text-white hover:bg-[#fff] hover:text-[#3b6907]"
                            }`}
                            onMouseOver={() => handleMouseOver("corevalues")}
                            onMouseOut={handleMouseOut}
                        >
                            Core Values
                        </button>
                    </li>
                </ul>
                <div className="relative min-h-[250px] md:min-h-[180px] lg:min-h-[165px] xl:min-h-[150px]">
                    {/* Mission */}
                    <div
                        className={`absolute left-0 top-0 w-full transition-opacity duration-300 ${
                            activeTab === "mission" ? "opacity-100 visible" : "opacity-0 invisible"
                        }`}
                        onMouseOver={() => handleMouseOver("mission")}
                        onMouseOut={handleMouseOut}
                    >
                        <p className="text-[#3b6907] text-lg text-center font-semibold flex items-center justify-center w-full h-full">The AMF mission is “Giving back to the community opportunities.”</p>
                    </div>
                    {/* Vision */}
                    <div
                        className={`absolute left-0 top-0 w-full transition-opacity duration-300 ${
                            activeTab === "vision" ? "opacity-100 visible" : "opacity-0 invisible"
                        }`}
                        onMouseOver={() => handleMouseOver("vision")}
                        onMouseOut={handleMouseOut}
                    >
                        <p className="text-[#3b6907] text-lg text-center font-semibold flex items-center justify-center w-full h-full">The AMF vision is “A community with opportunities for improved wellbeing”</p>
                    </div>
                    {/* Core Values */}
                    <div
                        className={`absolute left-0 top-0 w-full transition-opacity duration-300 ${
                            activeTab === "corevalues" ? "opacity-100 visible" : "opacity-0 invisible"
                        }`}
                        onMouseOver={() => handleMouseOver("corevalues")}
                        onMouseOut={handleMouseOut}
                    >
                        <p className="text-[#3b6907] text-base text-justify mb-3">The program and operations of AMF is guided by nine (9) core values which are often abbreviated as CHLORTECS. These core values are:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 justify-center gap-3">
                          {coreValues.map((value) => (
                            <div key={value} className="flex items-center text-[#6f6f6f] text-sm lg:text-base">
                              <FontAwesomeIcon
                              icon={faCircleCheck}
                              className="text-[#3b6907] mr-1"
                              style={{ fontSize: "1.2rem" }}/>
                              {value}
                            </div>
                          ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>
    </div>
)
}