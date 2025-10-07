import { NextResponse } from 'next/server';

interface StrapiVideoData {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  url: string;
  mime: string;
  size: number;
}

interface StrapiVideoItem {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  title?: string;
  description?: string;
  videos: StrapiVideoData[];
}

interface StrapiResponse {
  data: StrapiVideoItem[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export async function GET() {
  try {
    console.log('=== VIDEOS API ROUTE DEBUG ===');
    console.log('STRAPI_URL:', process.env.STRAPI_URL);
    console.log('STRAPI_TOKEN exists:', !!process.env.STRAPI_TOKEN);

    if (!process.env.STRAPI_URL) {
      console.error('STRAPI_URL is not defined');
      return NextResponse.json({ 
        message: 'STRAPI_URL environment variable is not defined',
        error: 'Configuration error'
      }, { status: 500 });
    }

    const url = `${process.env.STRAPI_URL}/api/video-galleries?populate=*`;
    console.log('Fetching from URL:', url);

    const strapiRes = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`,
      },
      cache: 'no-store',
    });

    console.log('Strapi response status:', strapiRes.status);

    if (!strapiRes.ok) {
      const errorText = await strapiRes.text();
      console.error('Strapi error response:', errorText);
      return NextResponse.json({ 
        message: 'Failed to fetch videos from Strapi',
        error: errorText,
        status: strapiRes.status
      }, { status: strapiRes.status });
    }

    const data: StrapiResponse = await strapiRes.json();
    console.log('Raw Strapi response:', JSON.stringify(data, null, 2));
    console.log('Number of video items from Strapi:', data.data?.length || 0);

    // Add this to see the structure of each item:
    if (data.data && data.data.length > 0) {
      console.log('First video item structure:', JSON.stringify(data.data[0], null, 2));
    }

    // Transform Strapi data to match your Video component structure
    const transformedVideos: Array<{
      id: number;
      video: string;
      title: string;
    }> = [];

    data.data.forEach((videoItem: StrapiVideoItem) => {
      if (videoItem.videos && Array.isArray(videoItem.videos)) {
        videoItem.videos.forEach((video: StrapiVideoData) => {
          // Validate the video URL and ensure it's a video file
          if (!video.url || !video.url.startsWith('/uploads/') || !video.mime?.startsWith('video/')) {
            console.warn('Skipping invalid video URL or non-video file:', video.url, video.mime);
            return;
          }

          const videoUrl = `${process.env.STRAPI_URL}${video.url}`;
          
          transformedVideos.push({
            id: video.id,
            video: videoUrl,
            title: videoItem.title || `Video ${video.id}`,
          });
        });
      }
    });

    console.log('Transformed videos:', transformedVideos);

    return NextResponse.json({ 
      message: 'Videos fetched successfully!', 
      data: transformedVideos 
    }, { status: 200 });

  } catch (error) {
    console.error('=== VIDEOS API ROUTE ERROR ===');
    console.error('Full error:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    
    return NextResponse.json({ 
      message: 'Internal server error.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}