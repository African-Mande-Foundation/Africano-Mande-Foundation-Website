// app/api/articles/[slug]/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";

interface CommentData {
  Content: string;
  user: number;
  article: number;
  Approved: boolean;
  parent?: number;
}

interface StrapiUser {
  id: number;
  username: string;
  email: string;
}

interface StrapiArticle {
  id: number;
  documentId: string;
  title: string;
  slug: string;
}

interface StrapiArticleResponse {
  data: StrapiArticle[];
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.jwt) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in to comment." },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const { content, parentId } = await req.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { message: "Comment content is required" },
        { status: 400 }
      );
    }

    // Get the article first
    const articleRes = await fetch(
      `${process.env.STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!articleRes.ok) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    const articleData: StrapiArticleResponse = await articleRes.json();
    const article = articleData.data[0];

    // Get current user
    const userRes = await fetch(
      `${process.env.STRAPI_URL}/api/users/me`,
      {
        headers: {
          Authorization: `Bearer ${session.jwt}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!userRes.ok) {
      return NextResponse.json(
        { message: "Failed to get user data" },
        { status: 500 }
      );
    }

    const userData: StrapiUser = await userRes.json();

    // Create comment data with proper typing
    const commentData: CommentData = {
      Content: content.trim(),
      user: userData.id,
      article: article.id,
      Approved: true, // Auto-approve for now
    };

    if (parentId) {
      commentData.parent = parentId;
    }

    // Create the comment
    const commentRes = await fetch(
      `${process.env.STRAPI_URL}/api/comments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: commentData }),
      }
    );

    if (!commentRes.ok) {
      const errorData = await commentRes.json();
      console.error("Failed to create comment:", errorData);
      return NextResponse.json(
        { message: "Failed to post comment" },
        { status: 500 }
      );
    }

    const newComment = await commentRes.json();
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Comment posting error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}