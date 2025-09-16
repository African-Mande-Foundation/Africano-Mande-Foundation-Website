import { Heart } from "lucide-react";

export default function Donation () {
    return(
        <div className="bg-white mt-5 w-full items-center justify-center flex">
            <div className=" p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex flex-col items-center justify-center gap-y-5  h-auto">
                <div className="text-xl lg:text-2xl font-medium text-[#3b6907] items-center justify-center flex gap-x-2"><div className="bg-[#3b6907] w-1 h-6"></div><p>Donate</p></div>

                <div className="w-full h-auto bg-[#3b6907] gap-y-8 md:gap-y-13 p-5 md:p-10 flex flex-col items-center justify-between">
                    <div className="text-white font-bold text-2xl md:text-3xl lg:text-4xl text-center">Your support can make a lasting impact!</div>
                    <button className="px-8 py-4 bg-[#005e84] text-white items-center justify-center flex gap-2 md:gap-4 text-sm md:text-base rounded-2xl cursor-point hover:bg-[#fff] hover:text-[#005e84] transition duration-300 cursor-pointer">
                    <span>Donate Now</span> <Heart className="w-4 md:w-5"/>
                </button>
                </div>
            </div>

        </div>
    )
}