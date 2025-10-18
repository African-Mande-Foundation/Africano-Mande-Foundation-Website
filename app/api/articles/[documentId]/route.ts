import { flattenStrapiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

import { ArticleData, Comment } from "@/lib/types";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const documentId = url.pathname.split("/").pop();
  const session = await getServerSession(authOptions);

  if (!session || !session.jwt) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const [articleRes, commentsRes] = await Promise.all([
      fetch(
        `${process.env.STRAPI_URL}/api/articles?filters[documentId][$eq]=${documentId}&populate[author][populate][0]=avatar&populate[category]=true&populate[cover]=true`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.jwt}`,
          },
        },
      ),
      fetch(
        `${process.env.STRAPI_URL}/api/comments?filters[article][documentId][$eq]=${documentId}&filters[parent][$null]=true&populate[user][populate][0]=true&sort=createdAt:desc`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.jwt}`,
          },
        },
      ),
    ]);

    const articleData = await articleRes.json();
    const commentsData = await commentsRes.json();

    if (!articleRes.ok) {
      return NextResponse.json(
        { message: articleData.error?.message || "Failed to fetch article" },
        { status: articleRes.status },
      );
    }

    if (!commentsRes.ok) {
      return NextResponse.json(
        { message: commentsData.error?.message || "Failed to fetch comments" },
        { status: commentsRes.status },
      );
    }

    if (!articleData.data || articleData.data.length === 0) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 },
      );
    }

    const flattenedArticle = flattenStrapiResponse<ArticleData>(
      articleData.data[0],
    );
    if (!flattenedArticle) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 },
      );
    }
    flattenedArticle.comments =
      flattenStrapiResponse<Comment[]>(commentsData.data) ?? [];

    return NextResponse.json(flattenedArticle);
  } catch (error) {
    console.error("Single article fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
