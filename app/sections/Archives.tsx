import Gallery from "../components/Gallery";

export default function Archives () {
    return(
        <div className="bg-white w-full mt-5 md:mt-10 items-center justify-center flex">
            <div className=" p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex flex-col gap-y-5 items-start justify-center h-auto">
                <div className="flex flex-col items-start justify-center w-full gap-y-5">
                    <div className="flex flex-col items-start justify-center w-full gap-y-3">
                        <div className="text-xl lg:text-2xl font-medium text-[#3b6907] items-center justify-center flex gap-x-2 mb-2"><div className="bg-[#3b6907] w-1 h-6"></div><p>Our Archives</p></div>
                        <div className="text-black font-bold text-2xl md:text-3xl lg:text-4xl">Gallery</div>
                        <div className="text-[#6f6f6f] text-sm md:text-base text-justify flex flex-col p-1 gap-y-2">
                            <p>This section is designed to highlight the region&apos;s cultural and environmental richness, emphasizing its importance as a cornerstone to foster socioeconomic transformation and community wellbeing.</p>
                        </div>
                    </div>
                    <Gallery/>
                </div>
            </div>

        </div>
    );
}