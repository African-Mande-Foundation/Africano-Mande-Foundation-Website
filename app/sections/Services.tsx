"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKitMedical, faBookOpen, faLeaf, faLaptop, faScrewdriverWrench, faHandHoldingHeart, faChartColumn } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function Services() {
    const [showHealthModal, setShowHealthModal] = useState(false);
    const [showEducationModal, setShowEducationModal] = useState(false);
    const [showProductionModal, setShowProductionModal] = useState(false);
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [showTechnicalModal, setShowTechnicalModal] = useState(false);
    const [showVolunteerModal, setShowVolunteerModal] = useState(false);
    const [showCorporateModal, setShowCorporateModal] = useState(false);

    return (
        <div>
        <div className="bg-white w-full mt-4 items-center justify-center flex">
            <div className=" p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex flex-col gap-y-5 items-start justify-center h-auto">
                <div className="text-xl lg:text-2xl font-medium text-[#3b6907] items-center justify-center flex gap-x-2"><div className="bg-[#3b6907] w-1 h-6"></div><p>Our Services</p></div>
                
                <div className="text-black font-bold text-2xl md:text-3xl lg:text-4xl">We foster sustainable development and well-being</div>
                <div className="w-full xl:px-10 grid grid-cols-1 gap-3 md:gap-5 md:grid-cols-2 lg:grid-cols-3">

                    {/* Health */}
                    <div className="service health inner relative w-full h-[250px] md:h-[300px] rounded-4xl" id="service-1">
                        <div className="absolute serv w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faKitMedical}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            
                            <p className="text-lg font-bold text-black">Health Services</p>
                            <p className="text-sm md:text-base">To provide quality and specialized health services through establishment of a model medical center.</p>
                            
                            <button
                            className="py-1 px-0 cursor-pointer text-black"
                            onClick={() => setShowHealthModal(true)}
                            >
                            Read More
                            </button>
                        </div>
                    </div>

                    {/* Education */}
                    <div className="service education inner relative w-full h-[250px] md:h-[300px] rounded-4xl" id="service-2">
                        <div className="absolute serv inner w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faBookOpen}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            
                            <p className="text-lg font-bold text-black">Education Services</p>
                            <p className="text-sm md:text-base">To provide quality education services through establishment of model primary and secondary schools.</p>
                        
                            <button 
                            className="py-1 px-0 cursor-pointer text-black"
                            onClick={() => setShowEducationModal(true)}
                            >Read More</button>
                        </div>
                    </div>


                    {/* Production & Livelihoods services */}
                    <div className="service production inner relative w-full h-[250px] md:h-[300px] rounded-4xl" id="service-3">
                        <div className="absolute serv w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faLeaf}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            
                            <p className="text-lg font-bold text-black">Production & Livelihoods services</p>
                            <p className="text-sm md:text-base">To provide opportunity for income generation through agriculture, fishery and forestry projects.</p>
                            
                            <button 
                            className="py-1 px-0 cursor-pointer text-black"
                            onClick={() => setShowProductionModal(true)}
                            >Read More</button>
                        </div>
                    </div>

                    {/* Media and ICT Services */}
                    <div className="service media inner relative w-full h-[250px] md:h-[300px] rounded-4xl" id="service-4">
                        <div className="absolute serv w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faLaptop}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            
                            <p className="text-lg font-bold text-black">Media and ICT Services</p>
                            <p className="text-sm md:text-base">This area leverages media and ICT to promote health, entrepreneurship, and community development.</p>
                            
                            <button 
                            className="py-1 px-0 cursor-pointer text-black"
                            onClick={() => setShowMediaModal(true)}
                            >Read More</button>
                        </div>
                    </div>

                    {/* Technical Services */}
                    <div className="service technical inner relative w-full h-[250px] md:h-[300px] rounded-4xl" id="service-5">
                        <div className="absolute serv w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faScrewdriverWrench}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            
                            <p className="text-lg font-bold text-black">Technical Services</p>
                            <p className="text-sm md:text-base">This area enhances community development through village restructuring and better roads and services.</p>
                        
                            <button 
                            className="py-1 px-0 cursor-pointer text-black"
                            onClick={() => setShowTechnicalModal(true)}
                            >Read More</button>
                        </div>
                    </div>


                    {/* Volunteer Services */}
                    <div className="service volunteer inner relative w-full h-[250px] md:h-[300px] rounded-4xl" id="service-6"> 
                        <div className="absolute serv w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faHandHoldingHeart}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            
                            <p className="text-lg font-bold text-black">Volunteer Services</p>
                            <p className="text-sm md:text-base">This area leverages free skills and knowledge to benefit AMF&apos;s communities and uphold its vision and values.</p>
                            
                            <button 
                            className="py-1 px-0 cursor-pointer text-black"
                            onClick={() => setShowVolunteerModal(true)}
                            >Read More</button>
                        </div>
                    </div>


                    {/* Corporate Services */}
                    <div className="service corporate inner relative w-full h-[250px] md:h-[300px] rounded-4xl" id="service-7">
                        <div className="absolute serv w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faChartColumn}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            
                            <p className="text-lg font-bold text-black">Corporate Services</p>
                            <p className="text-sm md:text-base">This area strengthens AMF&apos;s operational capacity to serve communities while promoting its core vision and values.</p>
                            
                            <button 
                            className="py-1 px-0 cursor-pointer text-black"
                            onClick={() => setShowCorporateModal(true)}
                            >Read More</button>
                        </div>
                    </div>

                    


                </div>
            </div>
            

        </div>
        {showHealthModal && (
            <div className="fixed inset-0 w-screen h-screen bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowHealthModal(false)}>
                <div className="p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex items-center justify-center h-auto">
                <div className="bg-white rounded" onClick={e => e.stopPropagation()}>
                    <div className="border-b border-gray-300 flex items-center justify-between p-2 lg:px-5 lg:py-3">
                        <div><p className="text-[#032303] font-bold">Health Services</p></div>
                        <button
                            className="py-1 px-6 rounded-lg bg-[#dfefd2] text-[#032303] font-bold hover:bg-[#032303] hover:text-white transform transition-transform cursor-pointer duration-300"
                            onClick={() => setShowHealthModal(false)}
                        >
                            close
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 p-2 gap-y-5 gap-x-5 lg:p-5">
                        <div className="health_img w-full h-[200px] md:h-[300px] rounded-lg"></div>
                        <p className="text-[#6f6f6f] text-sm md:text-base text-justify flex flex-col p-1 gap-y-2 w-full h-[300px] overflow-y-scroll">
                            This performance area ensures establishing a healthy community with reduced prevalence of preventive diseases, increased access to health facilities and attentions, and improved health awareness and practices. This entails promoting Primary Health Care Services which is holistic and which entails the integration of nutrition services, good health practices and good environmental management into Primary Health Care Program. AMF believes that “good health is a product of good nutrition, good practices and good environment.” This also entails continues building of health awareness in order to improve health practices and knowledge; establishment of a Medical Center which offers improved quality medical services to the people of Maridi; and the pursuit of a rigorous research in the areas of health.
                        </p>
                    </div>
                    <div className="w-full h-7 border-t border-gray-300"></div>
                </div>
                </div>
            </div>
            )}

            {showEducationModal && (
            <div className="fixed inset-0 w-screen h-screen bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowEducationModal(false)}>
                <div className="p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex items-center justify-center h-auto">
                <div className="bg-white rounded" onClick={e => e.stopPropagation()}>
                    <div className="border-b border-gray-300 flex items-center justify-between p-2 lg:px-5 lg:py-3">
                        <div><p className="text-[#032303] font-bold">Education Services</p></div>
                        <button
                            className="py-1 px-6 rounded-lg bg-[#dfefd2] text-[#032303] font-bold hover:bg-[#032303] hover:text-white transform transition-transform cursor-pointer duration-300"
                            onClick={() => setShowEducationModal(false)}
                        >
                            close
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 p-2 gap-y-5 gap-x-5 lg:p-5">
                        <div className="education_img w-full h-[200px] md:h-[300px] rounded-lg"></div>
                        <div className="text-[#6f6f6f] text-sm md:text-base text-justify  p-1 gap-y-2 w-full h-[300px] overflow-y-scroll">
                            <p>Education Services This performance area ensures the pursuit of the policy of ensuring access to quality education and skills for all in order to establish a skilled, conscious and innovative community. This entails the following:</p>
                            <ul className="mt-5 list-disc list-outside pl-5">
                                <li>
                                    Capacity building through establishment of a model primary and secondary schools in a short term, and Maridi International University in a long term, which is a capacity building and knowledge-generating research institution.
                                </li>
                                <li>
                                    Engaging in adaptive research and data generation, storage and dissemination for informed decision making at all levels.
                                </li>
                                <li>
                                    Empowering young men and women with mechanisms such as life skills meant to safeguard themselves against a wide range of vulnerabilities. This will involve promotion of liberal & multicultural education; understanding of organizational dynamics; providing skills in critical thinking; competence in interpersonal skills; and capacities to face and manage the complex, demanding and ever changing national, regional and international arena. This will also entail promotion and establishment of opportunities for alternative forms of learning such as vocational training and adult accelerated learning.
                                </li>
                                <li>Promotion of environmental and conservation education services</li>
                                <li>Promotion of cultural heritage services</li>
                            </ul>
                        </div>
                    </div>
                    <div className="w-full h-7 border-t border-gray-300"></div>
                </div>
                </div>
            </div>
            )}

            {showProductionModal && (
            <div className="fixed inset-0 w-screen h-screen bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowProductionModal(false)}>
                <div className="p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex items-center justify-center h-auto">
                <div className="bg-white rounded" onClick={e => e.stopPropagation()}>
                    <div className="border-b border-gray-300 flex items-center justify-between p-2 lg:px-5 lg:py-3">
                        <div><p className="text-[#032303] font-bold">Production & Livelihoods services</p></div>
                        <button
                            className="py-1 px-6 rounded-lg bg-[#dfefd2] text-[#032303] font-bold hover:bg-[#032303] hover:text-white transform transition-transform cursor-pointer duration-300"
                            onClick={() => setShowProductionModal(false)}
                        >
                            close
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 p-2 gap-y-5 gap-x-5 lg:p-5">
                        <div className="production_img w-full h-[200px] md:h-[300px] rounded-lg"></div>
                        <div className="text-[#6f6f6f] text-sm md:text-base text-justify  p-1 gap-y-2 w-full h-[300px] overflow-y-scroll">
                            <p>This performance area entails pursuing the policy of wealth creation, stimulation of economic development and realization of food security and, environment security. This performance area entails:</p>
                            <ul className="mt-5 list-disc list-outside pl-5">
                                <li>
                                    Broad base mobilization for agricultural production in order to ensure food security and surplus for marketing.
                                </li>
                                <li>
                                    Acquisition of agricultural implements such as tractors in order to increase production.
                                </li>
                                <li>
                                    Construction of Agro Warehouses in Maridi along with the necessary storage management systems in order to facilitate safe storage of seeds and of food surplus for marketing.
                                </li>
                                <li>Provision of necessary capacities in the form of trainings and study tours.</li>
                                <li>
                                    Production of other resources available in Maridi as well as promoting animal husbandry, apiary, poultry and fish farms for food security and for the markets.
                                </li>
                                <li>
                                    Conservation and management of biodiversity and forests in a sustainable manner as guided by the relevant laws and regulations.
                                </li>
                                <li>Rigorous introduction and marketing of Maridi products to external markets.</li>
                            </ul>
                        </div>
                    </div>
                    <div className="w-full h-7 border-t border-gray-300"></div>
                </div>
                </div>
            </div>
            )}

            {showMediaModal && (
            <div className="fixed inset-0 w-screen h-screen bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowMediaModal(false)}>
                <div className="p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex items-center justify-center h-auto">
                <div className="bg-white rounded" onClick={e => e.stopPropagation()}>
                    <div className="border-b border-gray-300 flex items-center justify-between p-2 lg:px-5 lg:py-3">
                        <div><p className="text-[#032303] font-bold">Media and ICT Services</p></div>
                        <button
                            className="py-1 px-6 rounded-lg bg-[#dfefd2] text-[#032303] font-bold hover:bg-[#032303] hover:text-white transform transition-transform cursor-pointer duration-300"
                            onClick={() => setShowMediaModal(false)}
                        >
                            close
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 p-2 gap-y-5 gap-x-5 lg:p-5">
                        <div className="media_img w-full h-[200px] md:h-[300px] rounded-lg"></div>
                        <p className="text-[#6f6f6f] text-sm md:text-base text-justify flex flex-col p-1 gap-y-2 w-full h-[300px] overflow-y-scroll">
                            This performance area takes the form of established media programs through Radio, MARIWOOD Film Production, Television programs and establish the ICT programs through leveraging on ICT development and operations in order to enhance & promote health awareness; production & entrepreneurship; community development; life skills development; unity, peace and reconciliation.
                        </p>
                    </div>
                    <div className="w-full h-7 border-t border-gray-300"></div>
                </div>
                </div>
            </div>
            )}

            {showTechnicalModal && (
            <div className="fixed inset-0 w-screen h-screen bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowTechnicalModal(false)}>
                <div className="p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex items-center justify-center h-auto">
                <div className="bg-white rounded" onClick={e => e.stopPropagation()}>
                    <div className="border-b border-gray-300 flex items-center justify-between p-2 lg:px-5 lg:py-3">
                        <div><p className="text-[#032303] font-bold">Technical Services</p></div>
                        <button
                            className="py-1 px-6 rounded-lg bg-[#dfefd2] text-[#032303] font-bold hover:bg-[#032303] hover:text-white transform transition-transform cursor-pointer duration-300"
                            onClick={() => setShowTechnicalModal(false)}
                        >
                            close
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 p-2 gap-y-5 gap-x-5 lg:p-5">
                        <div className="technical_img w-full h-[200px] md:h-[300px] rounded-lg"></div>
                        <p className="text-[#6f6f6f] text-sm md:text-base text-justify flex flex-col p-1 gap-y-2 w-full h-[300px] overflow-y-scroll">
                            This performance area entails community- based development by undertaking the reorganization, restructuring & surveying of village settlements with improved road accessibility and improved social services and social welfare.
                        </p>
                    </div>
                    <div className="w-full h-7 border-t border-gray-300"></div>
                </div>
                </div>
            </div>
            )}

            {showVolunteerModal && (
            <div className="fixed inset-0 w-screen h-screen bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowVolunteerModal(false)}>
                <div className="p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex items-center justify-center h-auto">
                <div className="bg-white rounded" onClick={e => e.stopPropagation()}>
                    <div className="border-b border-gray-300 flex items-center justify-between p-2 lg:px-5 lg:py-3">
                        <div><p className="text-[#032303] font-bold">Volunteer Services</p></div>
                        <button
                            className="py-1 px-6 rounded-lg bg-[#dfefd2] text-[#032303] font-bold hover:bg-[#032303] hover:text-white transform transition-transform cursor-pointer duration-300"
                            onClick={() => setShowVolunteerModal(false)}
                        >
                            close
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 p-2 gap-y-5 gap-x-5 lg:p-5">
                        <div className="volunteer_img w-full h-[200px] md:h-[300px] rounded-lg"></div>
                        <p className="text-[#6f6f6f] text-sm md:text-base text-justify flex flex-col p-1 gap-y-2 w-full h-[300px] overflow-y-scroll">
                            This performance area entails soliciting and welcoming volunteers from across the world who bring in relatively free skills and knowledge for the benefits of building AMF institutional capacity and above all for the benefit of the communities in Maridi, South Sudan that AMF services through its various projects.
                        </p>
                    </div>
                    <div className="w-full h-7 border-t border-gray-300"></div>
                </div>
                </div>
            </div>
            )}

            {showCorporateModal && (
            <div className="fixed inset-0 w-screen h-screen bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowCorporateModal(false)}>
                <div className="p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex items-center justify-center h-auto">
                <div className="bg-white rounded" onClick={e => e.stopPropagation()}>
                    <div className="border-b border-gray-300 flex items-center justify-between p-2 lg:px-5 lg:py-3">
                        <div><p className="text-[#032303] font-bold">Corporate Services</p></div>
                        <button
                            className="py-1 px-6 rounded-lg bg-[#dfefd2] text-[#032303] font-bold hover:bg-[#032303] hover:text-white transform transition-transform cursor-pointer duration-300"
                            onClick={() => setShowCorporateModal(false)}
                        >
                            close
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 p-2 gap-y-5 gap-x-5 lg:p-5">
                        <div className="corporate_img w-full h-[200px] md:h-[300px] rounded-lg"></div>
                        <p className="text-[#6f6f6f] text-sm md:text-base text-justify flex flex-col p-1 gap-y-2 w-full h-[300px] overflow-y-scroll">
                            This performance area involves offering corporate services which not only builds the operational capacities of AMF to deliver its intended services to the communities but it also promotes AMF’s vision and values for which it stands
                        </p>
                    </div>
                    <div className="w-full h-7 border-t border-gray-300"></div>
                </div>
                </div>
            </div>
            )}
        </div>
    )
}