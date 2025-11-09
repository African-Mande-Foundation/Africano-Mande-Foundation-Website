import { NextResponse } from "next/server";

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
    if (!process.env.STRAPI_URL) {
      console.error("STRAPI_URL is not defined");
      return NextResponse.json(
        {
          message: "STRAPI_URL environment variable is not defined",
          error: "Configuration error",
        },
        { status: 500 },
      );
    }

    const url = `${process.env.STRAPI_URL}/api/image-galleries?populate=*`;

    const strapiRes = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!strapiRes.ok) {
      const errorText = await strapiRes.text();
      console.error("Strapi error response:", errorText);
      return NextResponse.json(
        {
          message: "Failed to fetch images from Strapi",
          error: errorText,
          status: strapiRes.status,
        },
        { status: strapiRes.status },
      );
    }

    const data: StrapiResponse = await strapiRes.json();

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
      const url =
        image.formats?.medium?.url ||
        image.formats?.small?.url ||
        image.formats?.large?.url ||
        image.url;

      // Only prefix if not absolute
      return url.startsWith("http")
        ? url
        : `${process.env.STRAPI_URL}${url}`;
    };

    const getThumbnailUrl = (image: StrapiImageData) => {
      const thumbUrl = image.formats?.thumbnail?.url;
      if (thumbUrl) {
        return thumbUrl.startsWith("http")
          ? thumbUrl
          : `${process.env.STRAPI_URL}${thumbUrl}`;
      }
      return getOptimizedImageUrl(image);
    };

    data.data.forEach((galleryItem: StrapiGalleryItem) => {
      if (galleryItem.Images && Array.isArray(galleryItem.Images)) {
        galleryItem.Images.forEach((image: StrapiImageData) => {
          // Validate the image URL
          if (!image.url || (!image.url.startsWith("/uploads/") && !image.url.startsWith("http"))) {
            console.warn("Skipping invalid image URL:", image.url);
            return;
          }

          transformedImages.push({
            id: image.id,
            url: getOptimizedImageUrl(image),
            thumbnailUrl: getThumbnailUrl(image),
            title: galleryItem.title || `Gallery Image ${image.id}`,
            description:
              galleryItem.description || `Description for image ${image.id}`,
          });
        });
      }
    });

    return NextResponse.json(
      {
        message: "Images fetched successfully!",
        data: transformedImages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("=== API ROUTE ERROR ===");
    console.error("Full error:", error);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return NextResponse.json(
      {
        message: "Internal server error.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
