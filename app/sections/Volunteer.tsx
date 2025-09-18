import Image from "next/image";
export default function Volunteer () {
    return(
        <div className="bg-white w-full mt-5 md:mt-10 items-center justify-center flex">
            <div className="p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex flex-col md:flex-row-reverse gap-y-5 md:gap-x-5 items-center justify-center h-auto">
                <div className="w-full h-auto">
                    <Image src="https://firebasestorage.googleapis.com/v0/b/foundation-fm.firebasestorage.app/o/AMF%20Website%20Media%2Fvolunteer.jpg?alt=media&token=a3086fda-ab1b-4e61-90cd-8d2c10e5ceaf" alt="volunteer" width={5312} height={2988} className="w-full vol-img cursor-pointer transform transition-transform duration-300" unoptimized/>
                </div>
                <div className="w-full flex flex-col items-start justify-center">
                    <div className="text-xl lg:text-2xl font-medium text-[#3b6907] items-center justify-center flex gap-x-2 mb-2"><div className="bg-[#3b6907] w-1 h-6"></div><p>Volunteer</p></div>
                    <div className="text-[#6f6f6f] text-sm md:text-base text-justify flex flex-col p-1 gap-y-2">
                            <p>Join us today in advancing AMF&apos;s mission to uplift communities, empower individuals, and drive impactful change. Together, we can work towards a future filled with opportunities, where every voice is heard, every need is met, and every dream has a chance to thrive. Let&apos;s unite our efforts to bring AMF&apos;s inspiring vision to life, fostering hope, resilience, and transformation in the communities we serve.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}