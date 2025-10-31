import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

interface StrapiUser {
  id: number;
  username: string;
  email: string;
}

interface StrapiVolunteerComment {
  id: number;
  documentId: string;
  Content: string; // Capital C to match your Strapi schema
  createdAt: string;
  updatedAt: string;
  user?: StrapiUser;
}

interface StrapiVolunteerCommentsResponse {
  data: StrapiVolunteerComment[];
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // First get the volunteer article to find its ID
    const volunteerArticleResponse = await fetch(
      `${process.env.STRAPI_URL}/api/volunteer-articles?filters[slug][$eq]=${slug}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!volunteerArticleResponse.ok) {
      return NextResponse.json(
        { message: "Volunteer article not found" },
        { status: 404 }
      );
    }

    const volunteerArticleData = await volunteerArticleResponse.json();
    const volunteerArticle = volunteerArticleData.data[0];

    if (!volunteerArticle) {
      return NextResponse.json(
        { message: "Volunteer article not found" },
        { status: 404 }
      );
    }

    // Get comments for this volunteer article
    const commentsResponse = await fetch(
      `${process.env.STRAPI_URL}/api/comments?filters[volunteer_article][id][$eq]=${volunteerArticle.id}&populate=user&sort=createdAt:desc`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!commentsResponse.ok) {
      console.log("Volunteer comments fetch failed:", await commentsResponse.text());
      return NextResponse.json({ data: [] });
    }

    const commentsData: StrapiVolunteerCommentsResponse = await commentsResponse.json();
    console.log("Fetched volunteer comments:", JSON.stringify(commentsData, null, 2));
    
    // Transform the data to match the expected format in your frontend
    const transformedComments = commentsData.data?.map((comment: StrapiVolunteerComment) => ({
      id: comment.id,
      documentId: comment.documentId,
      content: comment.Content, // Map capital Content to lowercase content
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: {
        id: comment.user?.id,
        username: comment.user?.username,
        email: comment.user?.email,
      }
    })) || [];

    return NextResponse.json({ data: transformedComments });
  } catch (error) {
    console.error("Volunteer comments API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { message: "Comment content is required" },
        { status: 400 }
      );
    }

    const { slug } = await params;

    // First get the volunteer article to find its ID
    const volunteerArticleResponse = await fetch(
      `${process.env.STRAPI_URL}/api/volunteer-articles?filters[slug][$eq]=${slug}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!volunteerArticleResponse.ok) {
      return NextResponse.json(
        { message: "Volunteer article not found" },
        { status: 404 }
      );
    }

    const volunteerArticleData = await volunteerArticleResponse.json();
    const volunteerArticle = volunteerArticleData.data[0];

    if (!volunteerArticle) {
      return NextResponse.json(
        { message: "Volunteer article not found" },
        { status: 404 }
      );
    }

    // Get user data
    const userResponse = await fetch(
      `${process.env.STRAPI_URL}/api/users?filters[email][$eq]=${session.user.email}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!userResponse.ok) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const userData = await userResponse.json();
    const user = userData[0];

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Create comment with the exact field name from your Strapi schema
    const commentPayload = {
      data: {
        Content: content.trim(), // Using capital C as shown in your schema
        volunteer_article: volunteerArticle.id, // Connect to volunteer article
        user: user.id,
      },
    };

    console.log("Creating volunteer comment with payload:", JSON.stringify(commentPayload, null, 2));

    const commentResponse = await fetch(
      `${process.env.STRAPI_URL}/api/comments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentPayload),
      }
    );

    if (!commentResponse.ok) {
      const errorText = await commentResponse.text();
      console.error("Strapi volunteer comment creation error:", errorText);
      return NextResponse.json(
        { message: "Failed to create volunteer comment", error: errorText },
        { status: 500 }
      );
    }

    const commentData = await commentResponse.json();
    console.log("Volunteer comment created successfully:", JSON.stringify(commentData, null, 2));
    return NextResponse.json({ data: commentData.data });
  } catch (error) {
    console.error("Volunteer comment creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}