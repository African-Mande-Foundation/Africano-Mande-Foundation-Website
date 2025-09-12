import { Heart } from "lucide-react";

export default function Hero (){
    return(
        <div className="relative w-full h-screen overflow-hidden">
            <video
                className="absolute top-0 left-0 w-full h-full object-cover z-10"
                src="https://firebasestorage.googleapis.com/v0/b/foundation-fm.firebasestorage.app/o/AMF%20Website%20Media%2Fbg1.mov?alt=media&token=e3d99dfb-36c3-44a1-aebb-456ede0ec04e"
                autoPlay
                muted
                loop
                playsInline
            />
            <div className="absolute top-0 left-0 w-full h-full object-cover z-20 bg-black/50 border-0 border-amber-300 p-2 md:px-4 lg:px-5 xl:px-40 2xl:px-120">
            <div className="relative w-full h-full items-start gap-y-10 lg:gap-y-20 justify-center flex flex-col">
                <p className="text-3xl text-left w-full md:w-3/4 lg:w-2/3 lg:text-4xl lg:mt-20">&quot;Giving back opportunities to the community for improved wellbeing&quot;</p>
                <button className="px-8 py-4 bg-[#005e84] text-white items-center justify-center flex gap-2 text-sm rounded-2xl cursor-pointer hover:bg-[#fff] hover:text-[#005e84]">
                    <span>Donate Now</span> <Heart className="w-4"/>
                </button>
            </div>
            </div>

        </div>
    )
}