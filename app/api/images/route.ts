import { NextResponse } from 'next/server';

interface StrapiImageData {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  url: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

interface StrapiGalleryItem {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  title?: string;
  description?: string;
  Images: StrapiImageData[];
}

interface StrapiResponse {
  data: StrapiGalleryItem[];
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
    console.log('=== API ROUTE DEBUG ===');
    console.log('STRAPI_URL:', process.env.STRAPI_URL);
    console.log('STRAPI_TOKEN exists:', !!process.env.STRAPI_TOKEN);

    if (!process.env.STRAPI_URL) {
      console.error('STRAPI_URL is not defined');
      return NextResponse.json({ 
        message: 'STRAPI_URL environment variable is not defined',
        error: 'Configuration error'
      }, { status: 500 });
    }

    const url = `${process.env.STRAPI_URL}/api/image-galleries?populate=*`;
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
        message: 'Failed to fetch images from Strapi',
        error: errorText,
        status: strapiRes.status
      }, { status: strapiRes.status });
    }

    const data: StrapiResponse = await strapiRes.json();
    console.log('Number of gallery items from Strapi:', data.data.length);

    // REPLACE THIS SECTION WITH OPTIMIZED CODE:
    const transformedImages: Array<{
      id: number;
      url: string;
      thumbnailUrl: string;
      title: string;
      description: string;
    }> = [];

    // Helper functions for image optimization
    const getOptimizedImageUrl = (image: StrapiImageData) => {
      if (image.formats?.medium?.url) {
        return `${process.env.STRAPI_URL}${image.formats.medium.url}`;
      } else if (image.formats?.small?.url) {
        return `${process.env.STRAPI_URL}${image.formats.small.url}`;
      } else if (image.formats?.large?.url) {
        return `${process.env.STRAPI_URL}${image.formats.large.url}`;
      }
      return `${process.env.STRAPI_URL}${image.url}`;
    };

    const getThumbnailUrl = (image: StrapiImageData) => {
      if (image.formats?.thumbnail?.url) {
        return `${process.env.STRAPI_URL}${image.formats.thumbnail.url}`;
      }
      return getOptimizedImageUrl(image);
    };

    data.data.forEach((galleryItem: StrapiGalleryItem) => {
      if (galleryItem.Images && Array.isArray(galleryItem.Images)) {
        galleryItem.Images.forEach((image: StrapiImageData) => {
          // Validate the image URL
          if (!image.url || !image.url.startsWith('/uploads/')) {
            console.warn('Skipping invalid image URL:', image.url);
            return;
          }

          transformedImages.push({
            id: image.id,
            url: getOptimizedImageUrl(image),
            thumbnailUrl: getThumbnailUrl(image),
            title: galleryItem.title || `Gallery Image ${image.id}`,
            description: galleryItem.description || `Description for image ${image.id}`,
          });
        });
      }
    });

    console.log('Transformed images:', transformedImages);

    return NextResponse.json({ 
      message: 'Images fetched successfully!', 
      data: transformedImages 
    }, { status: 200 });

  } catch (error) {
    console.error('=== API ROUTE ERROR ===');
    console.error('Full error:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    
    return NextResponse.json({ 
      message: 'Internal server error.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}