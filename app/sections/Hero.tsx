import { Heart } from "lucide-react"; 

interface DonationProps {
  setShowDonateModal: (show: boolean) => void;
}


export default function Hero ({ setShowDonateModal }: DonationProps){

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
            <div className="absolute top-0 left-0 w-full h-full object-cover z-20 bg-black/50 border-0 border-amber-300 p-2">
            <div className="md:px-4 lg:px-5 w-full h-full flex flex-col items-center justify-center">
            <div className="relative max-w-screen-xl h-full items-start gap-y-30 justify-center flex flex-col">
                <p className="text-3xl md:text-4xl text-left w-full md:w-3/4 lg:w-4/5 lg:text-5xl lg:mt-20 font-black leading-tight">&quot;Giving back opportunities to the community for improved wellbeing&quot;</p>
                <button className="px-8 py-4 bg-[#005e84] text-white items-center justify-center flex gap-2 md:gap-4 text-sm md:text-base rounded-2xl cursor-point hover:bg-[#fff] hover:text-[#005e84] transition duration-300 cursor-pointer" onClick={() => setShowDonateModal(true)}>
                    <span>Donate Now</span> <Heart className="w-4 md:w-5"/>
                </button>
            </div>
            </div>
            </div>

        </div>
    )
}