"use client";
import { useState } from "react";

const videosList = [
	{
		video: 'https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fvid1.mov?alt=media&token=65694cdc-0833-40e1-be86-3c6d21eb1447',
		title: 'View of the AMF site foundation'
	},
	{
		video: 'https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fvid2.mov?alt=media&token=a5632d77-7fb1-491a-86af-6b6945fd0bcd',
		title: 'Beauty of Maridi environment'
	},
	{
		video: 'https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fvid10.mov?alt=media&token=2cc58583-c336-456a-8750-50001715bd1d',
		title: 'Beautiful animals in Maridi'
	},
	{
		video: 'https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fvid5.mov?alt=media&token=77052376-7ee6-4a93-a749-a0f83cdddd1e',
		title: 'AMF borehole project'
	},
	{
		video: 'https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fvid6.mov?alt=media&token=45d65d94-0e36-443d-8430-cb10eefa69de',
		title: 'Launch of new borehole'
	},
	{
		video: 'https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fvid9.mov?alt=media&token=40ad84f5-220e-4640-9b3b-1a6bde2f3d9b',
		title: 'Africano Mande. Founder of AMF'
	},
	{
		video: 'https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fvid11.mov?alt=media&token=efe8ac6d-91ef-4373-89a6-28b230f213c0',
		title: 'Maridi Sports Initiative'
	},
	{
		video: 'https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fvid8.mov?alt=media&token=ae01aa6c-e4bc-4ec5-9e6a-674cf5ea57be',
		title: 'Sunset, sunrise and vegetation in Maridi'
	},
	{
		video: 'https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fvid12.mov?alt=media&token=3c34a162-286e-4541-82cd-558382ea4461',
		title: 'Infrastructure Construction in Maridi'
	},
	{
		video: 'https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fvid7.mov?alt=media&token=9629ad7b-bf4f-4125-a994-6cd11cfdc5e0',
		title: 'Maridi Organics products originally made in Maridi'
	},
	{
		video: 'https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fvid4.mov?alt=media&token=4d31e6f0-45ef-45c8-9508-d9be005555bd',
		title: 'Bird sanctuary in Maridi'
	},
	{
		video: 'https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fvid3.mov?alt=media&token=582815df-b46b-46b7-90e3-183ceb2ec636',
		title: 'Recreational park in Maridi'
	},
];

export default function Video() {
	const [activeIdx, setActiveIdx] = useState(0);

	return (
		<div className="video-gallery w-full">
			<div className="container w-full mx-auto flex flex-col lg:flex-row gap-5 items-start rounded-lg bg-white">
				{/* Main Video */}
				<div className="main-video-container gap-y-5 w-full lg:w-2/3 xl:w-3/4 bg-[#032303] p-4 rounded-lg h-auto flex flex-col">
					<video
						src={videosList[activeIdx].video}
						controls
						loop
						className="main-video w-full h-[400px] rounded-lg bg-black"
					/>
					<h3 className="main-vid-title text-lg md:text-xl font-semibold text-white">{videosList[activeIdx].title}</h3>
				</div>
				{/* Video List */}
				<div className="video-list-container w-full lg:w-1/3 xl:w-1/4 bg-white border-2 border-gray-200 rounded-lg p-4 h-[500px] overflow-y-scroll">
					{videosList.map((item, idx) => (
                        <div
                        key={item.video}
                        className={`list flex items-center gap-4 p-3 rounded-lg mb-3 cursor-pointer border ${activeIdx === idx ? "bg-green-900" : "bg-white"} ${activeIdx === idx ? "border-green-900" : "border-gray-200"}`}
                        onClick={() => setActiveIdx(idx)}
                        >
                        <video
                            src={item.video}
                            className="list-video rounded-md h-[80px] w-[120px] object-cover"
                            muted
                        />
                        <h3 className={`list-title text-base font-medium ${activeIdx === idx ? "text-white" : "text-gray-700"}`}>{item.title}</h3>
                        </div>
					))}
				</div>
			</div>
		</div>
	);
}