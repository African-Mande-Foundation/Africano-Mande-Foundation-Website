"use client";
import { useState, useEffect } from "react";

interface VideoItem {
    id?: number;
    video: string;
    title: string;
}

export default function Video() {
    const [activeIdx, setActiveIdx] = useState(0);
    const [videosList, setVideosList] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch videos from Strapi
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/videos');
                const result = await response.json();

                if (response.ok && result.data && result.data.length > 0) {
                    setVideosList(result.data);
                    setError(null);
                } else {
                    console.warn('No videos from Strapi');
                    setError('No videos available');
                }
            } catch (err) {
                console.error('Error fetching videos:', err);
                setError('Failed to fetch videos');
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    if (loading) {
        return (
            <div className="video-gallery w-full flex items-center justify-center h-96">
                <div className="text-xl">Loading videos...</div>
            </div>
        );
    }

    if (error || videosList.length === 0) {
        return (
            <div className="video-gallery w-full flex items-center justify-center h-96">
                <div className="text-red-600 text-xl">{error || 'No videos available'}</div>
            </div>
        );
    }

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
                    <h3 className="main-vid-title text-lg md:text-xl font-semibold text-white">
                        {videosList[activeIdx].title}
                    </h3>
                </div>

                {/* Video List */}
                <div className="video-list-container w-full lg:w-1/3 xl:w-1/4 bg-white border-2 border-gray-200 rounded-lg p-4 h-[500px] overflow-y-scroll">
                    {videosList.map((item, idx) => (
                        <div
                            key={item.video}
                            className={`list flex items-center gap-4 p-3 rounded-lg mb-3 cursor-pointer border ${
                                activeIdx === idx ? "bg-green-900" : "bg-white"
                            } ${activeIdx === idx ? "border-green-900" : "border-gray-200"}`}
                            onClick={() => setActiveIdx(idx)}
                        >
                            <video
                                src={item.video}
                                className="list-video rounded-md h-[80px] w-[120px] object-cover"
                                muted
                            />
                            <h3 className={`list-title text-base font-medium ${
                                activeIdx === idx ? "text-white" : "text-gray-700"
                            }`}>
                                {item.title}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}