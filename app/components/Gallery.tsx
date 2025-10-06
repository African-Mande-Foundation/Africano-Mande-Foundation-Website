/* eslint-disable @next/next/no-img-element */

"use client";
import { useRef, useState, useEffect } from "react";

interface GalleryImage {
    id?: number;
    url: string;
    thumbnailUrl?: string; // ADD THIS LINE
    title: string;
    description: string;
}

export default function Gallery() {
    const sliderRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);

    const [galleryData, setGalleryData] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch images from Strapi
    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/images');
                const result = await response.json();

                if (response.ok && result.data && result.data.length > 0) {
                    setGalleryData(result.data);
                    setError(null);
                } else {
                    console.warn('No images from Strapi');
                    setError('No images available');
                }
            } catch (err) {
                console.error('Error fetching images:', err);
                setError('Failed to fetch images');
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    const moveSlider = (direction: "next" | "prev") => {
        const slider = sliderRef.current;
        const sliderList = listRef.current;
        const thumbnail = thumbRef.current;

        if (!slider || !sliderList || !thumbnail) return;

        const sliderItems = sliderList.querySelectorAll(".item");
        const thumbnailItems = thumbnail.querySelectorAll(".item");

        if (direction === "next") {
            sliderList.appendChild(sliderItems[0]);
            thumbnail.appendChild(thumbnailItems[0]);
            slider.classList.add("next");
        } else {
            sliderList.prepend(sliderItems[sliderItems.length - 1]);
            thumbnail.prepend(thumbnailItems[thumbnailItems.length - 1]);
            slider.classList.add("prev");
        }

        const handleAnimationEnd = () => {
            slider.classList.remove(direction);
            slider.removeEventListener("animationend", handleAnimationEnd);
        };
        slider.addEventListener("animationend", handleAnimationEnd);
    };

    if (loading) {
        return (
            <div className="slider w-full flex items-center justify-center h-96">
                <div className="text-xl">Loading gallery...</div>
            </div>
        );
    }

    if (error || galleryData.length === 0) {
        return (
            <div className="slider w-full flex items-center justify-center h-96">
                <div className="text-red-600 text-xl">{error || 'No images available'}</div>
            </div>
        );
    }

    return (
        <div ref={sliderRef} className="slider w-full">
            {/* Main image list */}
            <div ref={listRef} className="list">
                {galleryData.map((img, index) => (
                    <div key={img.url + index} className="item">
                        <img src={img.url} alt={img.title} />
                        <div className="content absolute w-full md:w-2/3 lg:w-1/2 gap-2 p-2 top-0 gradient-bg md:rounded-bl-full  items-center justify-center md:right-0 md:justify-start flex flex-col">
                            <div className="title font-bold text-2xl md:text-3xl lg:text-4xl">{img.title}</div>
                            <div className="description hidden md:flex">{img.description}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Thumbnails */}
            <div ref={thumbRef} className="thumbnail z-20" id="vid">
                {galleryData.slice(1).concat(galleryData.slice(0, 1)).map((img, idx) => (
                    <div key={img.url + idx} className="item">
                        <img src={img.thumbnailUrl || img.url} alt={`Thumbnail ${idx + 1}`} />
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