"use client";
import { useRef } from "react";

const galleryData = [
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal1_1200x1200.jpg?alt=media&token=18ff8f1c-c5ee-4a58-a915-f45cff691a0b",
		title: "Gallery Image 1",
		description: "Description for image 1",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal2_1200x1200.jpg?alt=media&token=8fc91c73-227a-4daa-b9a4-20fd2697c7aa",
		title: "Gallery Image 2",
		description: "Description for image 2",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal3_1200x1200.jpg?alt=media&token=93da1c53-9935-43f2-a6f8-ebbe47500f73",
		title: "Gallery Image 3",
		description: "Description for image 3",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal4_1200x1200.jpg?alt=media&token=f379de5b-80e7-4693-8413-e10c01b7dd67",
		title: "Gallery Image 4",
		description: "Description for image 4",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal5_1200x1200.jpg?alt=media&token=d5160601-17b0-4810-be10-42a11c7765aa",
		title: "Gallery Image 5",
		description: "Description for image 5",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal6_1200x1200.JPG?alt=media&token=74db232c-b353-480c-946a-bb8fc90e6ddd",
		title: "Gallery Image 6",
		description: "Description for image 6",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal7_1200x1200.jpg?alt=media&token=9497879d-b04b-4f70-a871-4ca5da131136",
		title: "Gallery Image 7",
		description: "Description for image 7",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal8_1200x1200.jpg?alt=media&token=ef0b0f09-f1ed-4216-8d12-a3660c4a0c25",
		title: "Gallery Image 8",
		description: "Description for image 8",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal9_1200x1200.jpg?alt=media&token=c723229f-9e34-406b-9fae-38a9e9e6d0fd",
		title: "Gallery Image 9",
		description: "Description for image 9",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal10_1200x1200.jpg?alt=media&token=06a8a4b8-50ac-47fb-a807-def155df6678",
		title: "Gallery Image 10",
		description: "Description for image 10",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal11_1200x1200.jpg?alt=media&token=d9be1d33-26a0-491a-a53f-732b3d9c4555",
		title: "Gallery Image 11",
		description: "Description for image 11",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal12_1200x1200.jpg?alt=media&token=66ef526e-a4ec-40ab-b0c4-207a36175f05",
		title: "Gallery Image 12",
		description: "Description for image 12",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal13_1200x1200.JPG?alt=media&token=a523f322-8bba-49b3-a1da-6122c77a46da",
		title: "Gallery Image 13",
		description: "Description for image 13",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal14_1200x1200.jpg?alt=media&token=40f91380-fcbe-4895-9ad1-55df59ffc971",
		title: "Gallery Image 14",
		description: "Description for image 14",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal15_1200x1200.JPG?alt=media&token=67983e6e-f309-41d8-a1db-278b6626c667",
		title: "Gallery Image 15",
		description: "Description for image 15",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal16_1200x1200.JPG?alt=media&token=547758da-7864-49f2-9c90-bf45e22851d4",
		title: "Gallery Image 16",
		description: "Description for image 16",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal17_1200x1200.jpg?alt=media&token=cbe1e9be-0e69-4e0c-afe3-3a00a9db5c13",
		title: "Gallery Image 17",
		description: "Description for image 17",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal18_1200x1200.jpg?alt=media&token=5fa045a9-5956-42cf-bdf0-ac26fee2e992",
		title: "Gallery Image 18",
		description: "Description for image 18",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal19_1200x1200.JPG?alt=media&token=f51169aa-65cd-4f5d-81b8-fed1e238252e",
		title: "Gallery Image 19",
		description: "Description for image 19",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal20_1200x1200.JPG?alt=media&token=832038a7-02d5-434d-a57b-7b20f5284d91",
		title: "Gallery Image 20",
		description: "Description for image 20",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal21_1200x1200.jpg?alt=media&token=86f1ae9b-84b1-401b-ba6d-c6a860f63585",
		title: "Gallery Image 21",
		description: "Description for image 21",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal22_1200x1200.jpg?alt=media&token=be4537cf-ea92-4389-b76b-ff224f811ef2",
		title: "Gallery Image 22",
		description: "Description for image 22",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal23_1200x1200.jpg?alt=media&token=8dc77e4c-e4ba-46c9-b194-9d817696188c",
		title: "Gallery Image 23",
		description: "Description for image 23",
	},
	{
		url: "https://firebasestorage.googleapis.com/v0/b/amf-system.firebasestorage.app/o/uploads%2Fgal24_1200x1200.JPG?alt=media&token=84620709-d7e1-4412-8475-b2a1e432ed61",
		title: "Gallery Image 24",
		description: "Description for image 24",
	},
];

export default function Gallery() {
	const sliderRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const thumbRef = useRef<HTMLDivElement>(null);

	const moveSlider = (direction: "next" | "prev") => {
		const slider = sliderRef.current;
		const sliderList = listRef.current;
		const thumbnail = thumbRef.current;

		if (!slider || !sliderList || !thumbnail) return;

		const sliderItems = sliderList.querySelectorAll(".item");
		const thumbnailItems = thumbnail.querySelectorAll(".item");

		if (direction === "next") {
			sliderList.appendChild(sliderItems[0]);
			// Move the first thumbnail to the end, so the first thumbnail is always the next image
			thumbnail.appendChild(thumbnailItems[0]);
			slider.classList.add("next");
		} else {
			sliderList.prepend(sliderItems[sliderItems.length - 1]);
			// Move the last thumbnail to the front, so the first thumbnail is always the next image
			thumbnail.prepend(thumbnailItems[thumbnailItems.length - 1]);
			slider.classList.add("prev");
		}

		const handleAnimationEnd = () => {
			slider.classList.remove(direction);
			slider.removeEventListener("animationend", handleAnimationEnd);
		};
		slider.addEventListener("animationend", handleAnimationEnd);
	};

	return (
		<div ref={sliderRef} className="slider w-full">
			{/* Main image list */}
			<div ref={listRef} className="list">
				{galleryData.map((img) => (
					<div key={img.url} className="item">
						<img src={img.url} alt={img.title} />
						<div className="content absolute w-full md:w-1/2 lg:w-1/3 gap-2 p-2 top-0 gradient-bg md:rounded-bl-full  items-center justify-center md:right-0 md:justify-start flex flex-col">
							<div className="title font-bold text-2xl md:text-3xl lg:text-4xl">{img.title}</div>
							<div className="description hidden md:flex">{img.description}</div>
						</div>
					</div>
				))}
			</div>

			{/* Thumbnails */}
			<div ref={thumbRef} className="thumbnail z-20" id="vid">
				{galleryData.slice(1).concat(galleryData.slice(0, 1)).map((img, idx) => (
					<div key={img.url} className="item">
						<img src={img.url} alt={`Thumbnail ${idx + 1}`} />
					</div>
				))}
			</div>

			{/* Next/Prev Arrows */}
			<div className="nextPrevArrows z-20 flex-col md:flex-row gap-y-4 md:gap-x-10 left-4 md:left-10 lg:left-30">
				<button className="prev px-2 py-3 md:px-6 md:py-3 rounded-4xl gap-2 flex" onClick={() => moveSlider("prev")}>
					<p>{"<"}</p> {"Previous"}
				</button>
				<button className="next px-5 py-3 md:px-6 md:py-3 rounded-4xl gap-2 flex" onClick={() => moveSlider("next")}>
					{"Next"} <p>{">"}</p>
				</button>
			</div>
		</div>
	);
}