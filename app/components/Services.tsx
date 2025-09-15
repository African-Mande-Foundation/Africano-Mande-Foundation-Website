import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKitMedical, faBookOpen, faLeaf, faLaptop, faScrewdriverWrench, faHandHoldingHeart, faChartColumn } from "@fortawesome/free-solid-svg-icons";

export default function Services(){
    return (
        <div className="bg-white w-full mt-4 items-center justify-center flex">
            <div className=" p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex flex-col gap-y-5 items-start justify-center h-auto">
                <div className="md:text-xl lg:text-2xl font-medium text-[#3b6907] items-center justify-center flex gap-x-2"><div className="bg-[#3b6907] w-1 h-6"></div><p>Our Services</p></div>
                
                <div className="text-black font-bold text-2xl md:text-3xl lg:text-4xl">We foster sustainable development and well-being</div>
                <div className="w-full xl:px-10 grid grid-cols-1 gap-3 md:gap-5 md:grid-cols-2 lg:grid-cols-3">

                    {/* Health */}
                    <div className="service health inner relative w-full h-[250px] md:h-[300px] rounded-4xl">
                        <div className="absolute serv w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faKitMedical}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            
                            <p className="text-lg font-bold text-black">Health Services</p>
                            <p className="text-sm md:text-base">To provide quality and specialized health services through establishment of a model medical center.</p>
                            
                            <button className="py-1 px-0 cursor-pointer text-black">Read More</button>
                        </div>
                    </div>

                    {/* Education */}
                    <div className="service education inner relative w-full h-[250px] md:h-[300px] rounded-4xl">
                        <div className="absolute serv inner w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faBookOpen}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            
                            <p className="text-lg font-bold text-black">Education Services</p>
                            <p className="text-sm md:text-base">To provide quality education services through establishment of model primary and secondary schools.</p>
                        
                            <button className="py-1 px-0 cursor-pointer text-black">Read More</button>
                        </div>
                    </div>


                    {/* Production & Livelihoods services */}
                    <div className="service production inner relative w-full h-[250px] md:h-[300px] rounded-4xl">
                        <div className="absolute serv w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faLeaf}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            
                            <p className="text-lg font-bold text-black">Production & Livelihoods services</p>
                            <p className="text-sm md:text-base">To provide opportunity for income generation through agriculture, fishery and forestry projects.</p>
                            
                            <button className="py-1 px-0 cursor-pointer text-black">Read More</button>
                        </div>
                    </div>

                    {/* Media and ICT Services */}
                    <div className="service media inner relative w-full h-[250px] md:h-[300px] rounded-4xl">
                        <div className="absolute serv w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faLaptop}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            
                            <p className="text-lg font-bold text-black">Media and ICT Services</p>
                            <p className="text-sm md:text-base">This area leverages media and ICT to promote health, entrepreneurship, and community development.</p>
                            
                            <button className="py-1 px-0 cursor-pointer text-black">Read More</button>
                        </div>
                    </div>

                    {/* Technical Services */}
                    <div className="service technical inner relative w-full h-[250px] md:h-[300px] rounded-4xl">
                        <div className="absolute serv w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faScrewdriverWrench}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            
                            <p className="text-lg font-bold text-black">Technical Services</p>
                            <p className="text-sm md:text-base">This area enhances community development through village restructuring and better roads and services.</p>
                        
                            <button className="py-1 px-0 cursor-pointer text-black">Read More</button>
                        </div>
                    </div>


                    {/* Volunteer Services */}
                    <div className="service volunteer inner relative w-full h-[250px] md:h-[300px] rounded-4xl">
                        <div className="absolute serv w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faHandHoldingHeart}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            
                            <p className="text-lg font-bold text-black">Volunteer Services</p>
                            <p className="text-sm md:text-base">This area leverages free skills and knowledge to benefit AMF&apos;s communities and uphold its vision and values.</p>
                            
                            <button className="py-1 px-0 cursor-pointer text-black">Read More</button>
                        </div>
                    </div>


                    {/* Corporate Services */}
                    <div className="service corporate inner relative w-full h-[250px] md:h-[300px] rounded-4xl">
                        <div className="absolute serv w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faChartColumn}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            
                            <p className="text-lg font-bold text-black">Corporate Services</p>
                            <p className="text-sm md:text-base">This area strengthens AMF&apos;s operational capacity to serve communities while promoting its core vision and values.</p>
                            
                            <button className="py-1 px-0 cursor-pointer text-black">Read More</button>
                        </div>
                    </div>

                    


                </div>
            </div>

        </div>
    )
}