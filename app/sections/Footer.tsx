import Link from "next/link";
import { Heart } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXTwitter,   
  faFacebookF,  
  faInstagram,  
  faLinkedinIn, 
  faYoutube,    
  faTiktok,
  faWhatsapp     
} from "@fortawesome/free-brands-svg-icons";
import {faPhone, faClock, faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons";



export default function Footer () {
    return(
        <div className="text-white bg-[#00161f] w-full items-center pt-20 justify-center flex flex-col">
            <div className=" p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex flex-col items-start justify-center h-auto">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-15">
                    <div className="w-full items-start justify-start flex flex-col gap-y-6">
                        <div className="text-xl lg:text-2xl font-bold text-white items-center justify-center flex gap-x-2 mb-2"><div className="bg-[#01a199] w-[2px] h-6"></div><p>Learn More</p></div>
                        <div className="w-full items-start justify-start gap-y-2 flex flex-col">
                            <Link href="https://en.wikipedia.org/wiki/Africano_Mande" className="text-white underline ">Africano Mande</Link>
                            <Link href="https://en.wikipedia.org/wiki/Maridi_State" className="text-white underline ">Maridi State</Link>
                            <Link href="https://www.google.com/maps/place/Maridi,+South+Sudan/@6.7767336,28.1996399,7z/data=!4m6!3m5!1s0x1715b472129689c1:0xed918f4c6458e5d!8m2!3d5.1331406!4d29.6035495!16s%2Fg%2F11c2k2f4zc!5m2!1e2!1e4?entry=ttu&g_ep=EgoyMDI0MTIwMS4xIKXMDSoASAFQAw%3D%3D" className="text-white underline ">Maridi State Map</Link>
                        </div>
                        <div>
                            <Link href="/donation" className="px-5 py-3 bg-[#01a199] text-white items-center justify-center flex gap-2 md:gap-4 text-sm rounded-md cursor-point hover:bg-[#fff] hover:text-[#005e84] transition duration-300 cursor-pointer">
                                <span>Donate Now</span> <Heart className="w-4 md:w-5"/>
                            </Link>
                        </div>
                        <div className="items-center justify-between flex gap-x-3">
                            <Link href="https://web.facebook.com/p/Africano-Mande-Foundation-100079635707396/?_rdc=1&_rdr"><FontAwesomeIcon
                            icon={faFacebookF}
                            className="w-5"
                            style={{ fontSize: "1.2rem" }}
                            /></Link>
                            <Link href="https://x.com/MandeFoundation"><FontAwesomeIcon
                            icon={faXTwitter}
                            className="w-5"
                            style={{ fontSize: "1.2rem" }}
                            /></Link>
                            <Link href="https://www.instagram.com/africano_mande_foundation/"><FontAwesomeIcon
                            icon={faInstagram}
                            className="w-5"
                            style={{ fontSize: "1.2rem" }}
                            /></Link>
                            <Link href="https://www.linkedin.com/in/africano-mande-foundation-457461339/"><FontAwesomeIcon
                            icon={faLinkedinIn}
                            className="w-5"
                            style={{ fontSize: "1.2rem" }}
                            /></Link>
                            <Link href="https://www.youtube.com/channel/UCPaxPJiU6PzkXdsUwkp0cnw"><FontAwesomeIcon
                            icon={faYoutube}
                            className="w-5"
                            style={{ fontSize: "1.2rem" }}
                            /></Link>
                            <Link href=""><FontAwesomeIcon
                            icon={faTiktok}
                            className="w-5"
                            style={{ fontSize: "1.2rem" }}
                            /></Link>
                        </div>

                    </div>
                    <div className="w-full items-start justify-start flex flex-col gap-y-6">
                        <div className="text-xl lg:text-2xl font-bold text-white items-center justify-center flex gap-x-2 mb-2"><div className="bg-[#01a199] w-[2px] h-6"></div><p>Head Office</p></div>
                        <div className="items-start justify-start flex flex-col gap-y-2">
                            <p>Hillside,</p>
                            <p>Maridi, South Sudan</p>
                        </div>
                        
                    </div>
                    <div className="w-full items-start justify-start flex flex-col gap-y-6">
                        <div className="text-xl lg:text-2xl font-bold text-white items-center justify-center flex gap-x-2 mb-2"><div className="bg-[#01a199] w-[2px] h-6"></div><p>Operations Office</p></div>
                        <div className="items-start justify-start flex flex-col gap-y-2">
                            <p>Greater Maridi</p>
                        </div>
                    </div>
                    <div className="w-full items-start justify-start flex flex-col gap-y-6">
                        <div className="text-xl lg:text-2xl font-bold text-white items-center justify-center flex gap-x-2 mb-2"><div className="bg-[#01a199] w-[2px] h-6"></div><p>Contact Us</p></div>
                        <div className="items-start justify-start flex flex-col gap-y-2">
                            <p><Link href="https://wa.me/211929756681"><FontAwesomeIcon
                            icon={faWhatsapp}
                            className="w-4 mr-1"
                            style={{ fontSize: "1.0rem" }}
                            /></Link>+211 92 104 2877</p>
                            <p><Link href="tel:+211924360010"><FontAwesomeIcon
                            icon={faPhone}
                            className="w-4 mr-1"
                            style={{ fontSize: "1.0rem" }}
                            /></Link>+211 92 436 0010</p>
                        </div>
                        <div className="text-xl lg:text-2xl font-bold text-white items-center justify-center flex gap-x-2 mb-2"><div className="bg-[#01a199] w-[2px] h-6"></div><p>Email</p></div>
                        <div className="items-start justify-start flex flex-col gap-y-2 text-xs">
                            <p>info@africanomandefoundation.org</p>
                            <p>sami.charles@africanomandefoundation<br className="hidden lg:block xl:hidden"/>.org</p>
                            <p>admin@africanomandefoundation.org</p>
                        </div>
                    </div>

                </div>
                
            </div>
            <div className="border-t-1 mt-10 w-full items-center justify-center flex  border-[#01a199]">
                <div className=" p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex flex-col items-center justify-center h-auto">
                    <div className="w-full items-start justify-center flex flex-col md:flex-row gap-y-3 pt-5">
                    <div className="grid grid-cols-1 xl:grid-cols-2 w-full md:w-1/2">
                    <div className="flex items-center justify-start">
                        <FontAwesomeIcon
                        icon={faClock}
                        className="w-6 mr-1"
                        style={{ fontSize: "1.2rem" }}
                        />
                        <p>MON - FRI (08:00AM - 5:00PM)</p>
                    </div>
                    <div className="flex items-center justify-start">
                        <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="w-6 mr-1"
                        style={{ fontSize: "1.2rem" }}
                        />
                        <p>Hillside Maridi, South Sudan</p>
                    </div>
                    </div>
                    <div className="w-full md:w-1/2">
                        <p>Africano Mande Foundation © 2025. All Rights Reserved.</p>
                    </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}