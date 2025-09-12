import Image from "next/image";
import Link from "next/link";

export default function AboutUs () {
return (
    <div className="bg-white p-2 md:p-4 lg:px-5 xl:px-40 2xl:px-120 w-full relative h-auto">
        <div className="relative w-full h-auto">
            <div className=" absolute top-0 left-0 z-0 w-full">
                <Image src="https://firebasestorage.googleapis.com/v0/b/foundation-fm.firebasestorage.app/o/AMF%20Website%20Media%2Fdeco-img.png?alt=media&token=e27881aa-d63a-4ee8-b5c7-57d68a3a788a" alt="aboutus bg pic" width={200} height={100} className="w-10 h-auto object-contain"/>
            </div>
            <div className=" top-0 z-20 w-full">
                <div className="w-full flex items-center z-10 relative justify-end">
                    <Image src="https://firebasestorage.googleapis.com/v0/b/foundation-fm.firebasestorage.app/o/AMF%20Website%20Media%2Fabt2.JPG?alt=media&token=6852fc03-1b95-4148-9838-3850509663a0" alt="about us img" width={200} height={100} className="w-95/100 h-auto mt-10 object-contain rounded-sm"/>
                </div>  
            </div>
             
        </div>
        <div className="items-start justify-start flex flex-col mt-10 gap-y-4">

            <div className="text-xl font-medium text-[#3b6907] items-center justify-center flex gap-x-2"><div className="bg-[#3b6907] w-1 h-6"></div><p>About Us</p></div>
            <div className="text-[#6f6f6f] text-justify flex flex-col p-1 gap-y-2">
                <p>The Africano Mande Foundation (AMF) was founded in 2018 by the family and friends of Africano Mande Gedima as a non-political, non-governmental and a legacy Foundation named after <Link href="#" className="text-[#0000ff] underline">Africano Mande Gedima</Link>, the first Governor of <Link href="#" className="text-[#0000ff] underline">Maridi State</Link>.</p>
                <p>AMF was founded in order to champion Africano Mande’s philosophy, ideals and vision through the philanthropic and non-governmental tracks with the aim of “giving back” to the community opportunities for socioeconomic transformation for improved community wellbeing through capacity development for innovation, access to social services (education, health etc), community awareness and community development.</p>
            </div>

        </div>

    </div>
)
}