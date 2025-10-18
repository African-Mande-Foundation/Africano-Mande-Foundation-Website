import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { flattenStrapiResponse } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.jwt) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "10";
  const sort = searchParams.get("sort") || "publishedAt:desc";
  const searchTerm = searchParams.get("filters[title][$containsi]") || "";

  try {
    const query = new URLSearchParams({
      "populate[0]": "author.avatar",
      "populate[1]": "category.cover",
      "populate[2]": "cover",
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      sort: sort,
    });

    if (searchTerm) {
      query.set("filters[title][$containsi]", searchTerm);
    }
    const strapiRes = await fetch(
      `${process.env.STRAPI_URL}/api/articles?${query.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.jwt}`,
        },
      },
    );

    const data = await strapiRes.json();

    if (!strapiRes.ok) {
      return NextResponse.json(
        { message: data.error?.message || "Failed to fetch articles" },
        { status: strapiRes.status },
      );
    }

    const flattenedData = flattenStrapiResponse(data.data);

    return NextResponse.json({
      data: flattenedData,
      meta: data.meta,
    });
  } catch (error) {
    console.error("Article fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}