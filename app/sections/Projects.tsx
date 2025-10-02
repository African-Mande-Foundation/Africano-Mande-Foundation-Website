"use client";
import {useState} from "react";
import Image from "next/image";
export default function Projects () {
    const [showMaridiModal, setShowMaridiModal] = useState(false);
    const [showFmModal, setShowFmModal] = useState(false);
    const [showMedicalModal, setShowMedicalModal] = useState(false);
    const [showUniversityModal, setShowUniversityModal] = useState(false);

    return(
        <div className="bg-white w-full mt-5 items-center justify-center flex" id="projects">
            <div className=" p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex flex-col gap-y-5 items-start justify-center h-auto">
                    <div className="text-xl lg:text-2xl font-medium text-[#3b6907] items-center justify-center flex gap-x-2 mb-2"><div className="bg-[#3b6907] w-1 h-6"></div><p>Projects</p></div>
                    <div className="text-[#6f6f6f] text-sm md:text-base text-justify flex flex-col p-1 gap-y-2">
                            <p>The Africano Mande Foundation (AMF) proudly supports and collaborates with the projects of AMF: Foundation FM, Maridi Organics, and Foundation Medical Center (FMC). Together, these foundations work towards improving the socio-economic well-being of the community and enhancing access to essential services.</p>
                    </div>
                    <div className="w-full xl:px-5 grid grid-cols-1 gap-3 md:gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">

                        {/* Maridi Organics */}
                        <div className="relative w-full border-0 border-red-600" id="organics">
                            <div className=" absolute top-0 w-full items-center justify-center flex">
                                <Image src="https://firebasestorage.googleapis.com/v0/b/foundation-fm.firebasestorage.app/o/AMF%20Website%20Media%2Fsf3.jpg?alt=media&token=25fd57cb-1a5c-4fc9-8c98-c286689cbcf7" alt="maridiorganics" width={2481} height={1792} className="w-1/2 lg:w-2/3 xl:w-1/2"/>
                            </div>
                            <div className="h-22 w-full"></div>
                            <div className="project-card border border-gray-300 rounded-sm ">
                            <div className="h-10 lg:h-5 w-full"></div>
                                <div className="w-full items-center justify-start flex flex-col gap-y-3 p-2 h-50 md:h-60 lg:h-100 xl:h-70">
                                    <p className="font-bold text-black text-2xl text-center p-2 border-b border-gray-200">Maridi Organics</p>
                                    <p className="text-[#6f6f6f] text-sm md:text-base text-center flex flex-col p-1 gap-y-2">A community-driven initiative by the Africano Mande Foundation that promotes sustainable agriculture and organic farming practices in Maridi.</p>
                                </div>
                                <div className="w-full border-t-2 items-center justify-center p-3 flex border-gray-300">
                                    <button className="py-1 px-6 rounded-lg bg-[#dfefd2] text-[#032303] font-bold hover:bg-[#032303] hover:text-white transform transition-transform cursor-pointer duration-300" onClick={() => setShowMaridiModal(true)}>
                                        more
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Foundation FM */}
                        <div className="relative w-full border-0 border-red-600 " id="fm">
                            <div className=" absolute top-0 w-full items-center justify-center flex">
                                <Image src="https://firebasestorage.googleapis.com/v0/b/foundation-fm.firebasestorage.app/o/AMF%20Website%20Media%2Fsf2.jpg?alt=media&token=33bb84a2-0fd3-4869-8dc1-f17a6db89aa8" alt="foundation fm" width={714} height={730} className="w-1/3 lg:w-1/2 xl:w-2/5"/>
                            </div>
                            <div className="h-22 w-full"></div>
                            <div className="project-card border border-gray-300 rounded-sm">
                                <div className="h-10 lg:h-5 w-full"></div>
                                <div className="w-full items-center justify-start flex flex-col gap-y-3 p-2 h-50 md:h-60 lg:h-100 xl:h-70">
                                    <p className="font-bold text-black text-2xl text-center p-2 border-b border-gray-200">Foundation FM</p>
                                    <p className="text-[#6f6f6f] text-sm md:text-base text-center flex flex-col p-1 gap-y-2">A media-focused initiative under the Africano Mande Foundation designed to amplify voices, promote education, and foster community engagement through the power of broadcasting.</p>
                                </div>
                                <div className="w-full border-t-2 items-center justify-center p-3 flex border-gray-300">
                                    <button className="py-1 px-6 rounded-lg bg-[#dfefd2] text-[#032303] font-bold hover:bg-[#032303] hover:text-white transform transition-transform cursor-pointer duration-300" onClick={() => setShowFmModal(true)}>
                                        more
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Foundation Medical Centre */}
                        <div className="relative w-full border-0 border-red-600 " id="medical">
                            <div className=" absolute top-0 w-full items-center justify-center flex">
                                <Image src="https://firebasestorage.googleapis.com/v0/b/foundation-fm.firebasestorage.app/o/AMF%20Website%20Media%2Fsf1.jpg?alt=media&token=f71654ee-02a6-4889-8c94-f64066e55ce5" alt="foundation medical centre" width={1984} height={1086} className="w-2/3 lg:w-3/4 xl:w-2/3"/>
                            </div>
                            <div className="h-22 w-full"></div>
                            <div className="project-card border border-gray-300 rounded-sm">
                            <div className="h-10 lg:h-5 w-full"></div>
                                <div className="w-full items-center justify-start flex flex-col gap-y-3 p-2 h-50 md:h-60 lg:h-100 xl:h-70">
                                    <p className="font-bold text-black text-2xl text-center p-2 border-b border-gray-200">Foundation Medical Centre</p>
                                    <p className="text-[#6f6f6f] text-sm md:text-base text-center flex flex-col p-1 gap-y-2">An initiative of the Africano Mande Foundation (AMF), that is committed to providing accessible, high-quality healthcare services to the community.</p>
                                </div>
                                <div className="w-full border-t-2 items-center justify-center p-3 flex border-gray-300">
                                    <button className="py-1 px-6 rounded-lg bg-[#dfefd2] text-[#032303] font-bold hover:bg-[#032303] hover:text-white transform transition-transform cursor-pointer duration-300" onClick={() => setShowMedicalModal(true)}>
                                        more
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Maridi International University */}
                        <div className="relative w-full border-0 border-red-600 " id="university">
                            <div className=" absolute top-0 w-full items-center justify-center flex">
                                <Image src="https://firebasestorage.googleapis.com/v0/b/foundation-fm.firebasestorage.app/o/AMF%20Website%20Media%2Fsf4.jpeg?alt=media&token=965b3076-caa6-46e6-b4c9-abc2f80d2df2" alt="maridi university" width={1080} height={990} className="w-1/3 lg:w-1/2 xl:w-2/5"/>
                            </div>
                            <div className="h-22 w-full"></div>
                            <div className="project-card border border-gray-300 rounded-sm">
                                <div className="h-10 lg:h-5 w-full"></div>
                                <div className="w-full items-center justify-start flex flex-col gap-y-3 p-2 h-55 md:h-60 lg:h-100 xl:h-70">
                                    <p className="font-bold text-black text-center text-2xl p-2 border-b border-gray-200">Maridi International University</p>
                                    <p className="text-[#6f6f6f] text-sm md:text-base text-center flex flex-col p-1 gap-y-2">Maridi International University (MIU) is an educational institution established under the Africano Mande Foundation to foster higher education, research, and skill development in the region.</p>
                                </div>
                                <div className="w-full border-t-2 items-center justify-center p-3 flex border-gray-300">
                                    <button className="py-1 px-6 rounded-lg bg-[#dfefd2] text-[#032303] font-bold hover:bg-[#032303] hover:text-white transform transition-transform cursor-pointer duration-300" onClick={() => setShowUniversityModal(true)}>
                                        more
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    
            </div>

             {showMaridiModal && (
            <div className="fixed inset-0 w-screen h-screen bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowMaridiModal(false)}>
                <div className="p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex items-center justify-center h-auto">
                <div className="bg-white rounded" onClick={e => e.stopPropagation()}>
                    <div className="border-b border-gray-300 flex items-center justify-between p-2 lg:px-5 lg:py-3">
                        <div><p className="text-[#032303] font-bold">Maridi Organics</p></div>
                        <button
                            className="py-1 px-6 rounded-lg bg-[#dfefd2] text-[#032303] font-bold hover:bg-[#032303] hover:text-white transform transition-transform cursor-pointer duration-300"
                            onClick={() => setShowMaridiModal(false)}
                        >
                            close
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 p-2 gap-y-5 gap-x-5 lg:p-5">
                        <div className="maridi_img w-full h-[200px] md:h-[300px] rounded-lg"></div>
                        <p className="text-[#6f6f6f] text-sm md:text-base text-justify flex flex-col p-1 gap-y-2 w-full h-[300px] overflow-y-scroll">
                            Maridi Organics, an initiative by the Africano Mande Foundation, promotes sustainable agriculture and organic farming in Maridi. It empowers local farmers through training, seed distribution, and eco-friendly techniques like composting and crop rotation. By reducing chemical use and improving soil health, it enhances food security, boosts incomes, and combats climate change. The initiative also supports market access, value addition, and water conservation, making Maridi a model for sustainable farming.
                        </p>
                    </div>
                    <div className="w-full h-7 border-t border-gray-300"></div>
                </div>
                </div>
            </div>
            )}

            {showFmModal && (
            <div className="fixed inset-0 w-screen h-screen bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowFmModal(false)}>
                <div className="p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex items-center justify-center h-auto">
                <div className="bg-white rounded" onClick={e => e.stopPropagation()}>
                    <div className="border-b border-gray-300 flex items-center justify-between p-2 lg:px-5 lg:py-3">
                        <div><p className="text-[#032303] font-bold">Foundation FM</p></div>
                        <button
                            className="py-1 px-6 rounded-lg bg-[#dfefd2] text-[#032303] font-bold hover:bg-[#032303] hover:text-white transform transition-transform cursor-pointer duration-300"
                            onClick={() => setShowFmModal(false)}
                        >
                            close
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 p-2 gap-y-5 gap-x-5 lg:p-5">
                        <div className="fm_img w-full h-[200px] md:h-[300px] rounded-lg"></div>
                        <p className="text-[#6f6f6f] text-sm md:text-base text-justify flex flex-col p-1 gap-y-2 w-full h-[300px] overflow-y-scroll">
                            Foundation FM is a media-focused initiative under the Africano Mande Foundation, dedicated to amplifying voices, promoting education, and fostering community engagement through broadcasting. It serves as a platform for informative discussions, cultural expression, and social awareness, addressing key community issues through radio programs, interviews, and educational content. By leveraging the power of media, Foundation FM empowers local voices, supports development initiatives, and strengthens community connections, making it a vital tool for information sharing and positive change.
                        </p>
                    </div>
                    <div className="w-full h-7 border-t border-gray-300"></div>
                </div>
                </div>
            </div>
            )}

            {showMedicalModal && (
            <div className="fixed inset-0 w-screen h-screen bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowMedicalModal(false)}>
                <div className="p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex items-center justify-center h-auto">
                <div className="bg-white rounded" onClick={e => e.stopPropagation()}>
                    <div className="border-b border-gray-300 flex items-center justify-between p-2 lg:px-5 lg:py-3">
                        <div><p className="text-[#032303] font-bold">Foundation Medical Centre</p></div>
                        <button
                            className="py-1 px-6 rounded-lg bg-[#dfefd2] text-[#032303] font-bold hover:bg-[#032303] hover:text-white transform transition-transform cursor-pointer duration-300"
                            onClick={() => setShowMedicalModal(false)}
                        >
                            close
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 p-2 gap-y-5 gap-x-5 lg:p-5">
                        <div className="medical_img w-full h-[200px] md:h-[300px] rounded-lg"></div>
                        <p className="text-[#6f6f6f] text-sm md:text-base text-justify flex flex-col p-1 gap-y-2 w-full h-[300px] overflow-y-scroll">
                            Foundation Medical Centre is an initiative of the Africano Mande Foundation (AMF) committed to providing accessible, high-quality healthcare services to the community. It focuses on improving public health through affordable medical care, preventive health programs, and community outreach. The center offers essential healthcare services, including maternal and child health, disease prevention, and health education, ensuring that individuals receive the care they need regardless of their financial status. By prioritizing accessibility and quality, Foundation Medical Centre plays a vital role in enhancing community well-being and promoting a healthier future.
                        </p>
                    </div>
                    <div className="w-full h-7 border-t border-gray-300"></div>
                </div>
                </div>
            </div>
            )}

            {showUniversityModal && (
            <div className="fixed inset-0 w-screen h-screen bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowUniversityModal(false)}>
                <div className="p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex items-center justify-center h-auto">
                <div className="bg-white rounded" onClick={e => e.stopPropagation()}>
                    <div className="border-b border-gray-300 flex items-center justify-between p-2 lg:px-5 lg:py-3">
                        <div><p className="text-[#032303] font-bold">Maridi International University</p></div>
                        <button
                            className="py-1 px-6 rounded-lg bg-[#dfefd2] text-[#032303] font-bold hover:bg-[#032303] hover:text-white transform transition-transform cursor-pointer duration-300"
                            onClick={() => setShowUniversityModal(false)}
                        >
                            close
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 p-2 gap-y-5 gap-x-5 lg:p-5">
                        <div className="university_img w-full h-[200px] md:h-[300px] rounded-lg"></div>
                        <p className="text-[#6f6f6f] text-sm md:text-base text-justify flex flex-col p-1 gap-y-2 w-full h-[300px] overflow-y-scroll">
                            Maridi International University (MIU) is an educational institution founded under the Africano Mande Foundation (AMF) to promote higher education, research, and skill development in the region. MIU is dedicated to academic excellence, offering diverse programs that equip students with the knowledge and practical skills needed for personal and professional growth. Through innovative learning approaches, research initiatives, and community engagement, the university empowers individuals to contribute meaningfully to societal development. MIU serves as a hub for intellectual advancement, fostering leadership, innovation, and sustainable progress in the region.
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