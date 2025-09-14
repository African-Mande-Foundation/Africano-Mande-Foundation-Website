import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKitMedical } from "@fortawesome/free-solid-svg-icons";

export default function Services(){
    return (
        <div className="bg-white w-full mt-4 items-center justify-center flex">
            <div className=" p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex flex-col gap-y-5 items-start justify-center h-auto">
                <div className="md:text-xl lg:text-2xl font-medium text-[#3b6907] items-center justify-center flex gap-x-2"><div className="bg-[#3b6907] w-1 h-6"></div><p>Our Services</p></div>
                
                <div className="text-black font-bold text-2xl md:text-3xl lg:text-4xl">We foster sustainable development and well-being</div>
                <div className="w-full grid grid-cols-1 gap-2">
                    <div className="service health relative w-full h-[300px]">
                        <div className="absolute serv w-full h-full bg:transparent hover:bg-black/50">
                            <FontAwesomeIcon
                            icon={faKitMedical}
                            />
                            <div>
                                <p>Health Services</p>
                                <p>To provide quality and specialized health services through establishment of a model medical center.</p>
                            </div>
                            <button className="p-1 text-black">Read More</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}