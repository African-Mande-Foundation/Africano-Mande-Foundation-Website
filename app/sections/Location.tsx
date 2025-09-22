export default function Location () {
    return (
        <div>
            <div className="bg-white w-full mt-5 md:mt-10 items-center justify-center flex">
                <div className=" p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex flex-col gap-y-5 items-start justify-center h-auto">
                        <div className="text-xl lg:text-2xl font-medium text-[#3b6907] items-center justify-center flex gap-x-2 mb-2"><div className="bg-[#3b6907] w-1 h-6"></div><p>Our Location</p></div>
                        <div className="text-[#6f6f6f] text-sm md:text-base text-justify flex flex-col p-1">
                            <p>The Africano Mande Foundation is located in Maridi, a vibrant town in South Sudan dedicated to community development and empowerment.</p>
                        </div>
                </div>
            </div>
            <div>
                    <div className="mapouter">
                        <div className="gmap_canvas">
                            <iframe
                                className="gmap_iframe"
                                style={{ width: "100%" }}
                                frameBorder={0}
                                scrolling="no"
                                marginHeight={0}
                                marginWidth={0}
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.134010972579!2d29.481166375229346!3d4.9172367950587095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1714fd4c5d3350a3%3A0xa9ddd4572117d948!2sAfricano%20Mande%20Foundation!5e0!3m2!1sen!2sus!4v1731335023548!5m2!1sen!2sus"
                                />
                            <a href="https://sprunkin.com/">Sprunki</a>
                            </div></div>
            </div>
        </div>
    )
}