import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

// Types
interface StrapiUser {
  id: number;
  username: string;
  email: string;
  firstname?: string; // Use the actual field name from Strapi User model
}

interface StrapiVolunteerRemark {
  id: number;
  title: string;
  type: string;
  rating?: number;
  state: string;
  priority: string;
  category?: string;
  responded_at?: string;
  users_permissions_user?: StrapiUser;
  responded_by?: StrapiUser;
  content: string;
  response?: string;
  createdAt: string;
  updatedAt: string;
}

interface StrapiResponse {
  data: StrapiVolunteerRemark[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// GET - Fetch volunteer remarks
export async function GET(request: NextRequest) {
  try {
    // Optional: Auth check (remove if you want public access)
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const type = searchParams.get("type");
    const state = searchParams.get("state");

    // Build query parameters
    const queryParams = new URLSearchParams({
      "pagination[page]": page.toString(),
      "pagination[pageSize]": pageSize.toString(),
      "sort": "createdAt:desc",
      "populate[users_permissions_user][fields][0]": "id",
      "populate[users_permissions_user][fields][1]": "username",
      "populate[users_permissions_user][fields][2]": "email",
      "populate[users_permissions_user][fields][3]": "firstName",
      "populate[responded_by][fields][0]": "id",
      "populate[responded_by][fields][1]": "username",
      "populate[responded_by][fields][2]": "firstname",
    });

    if (type && type !== "all") {
      queryParams.append("filters[type][$eq]", type);
    }
    if (state && state !== "all") {
      queryParams.append("filters[state][$eq]", state);
    }

    const apiUrl = `${process.env.STRAPI_URL}/api/volunteer-remarks?${queryParams}`;
    const response = await fetch(apiUrl, {
      headers: {
        "Authorization": `Bearer ${process.env.STRAPI_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data: StrapiResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch volunteer remarks" },
      { status: 500 }
    );
  }
}

// POST - Create new volunteer remark
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, type, rating, category, priority } = body;

    if (!title || !content || !type) {
      return NextResponse.json(
        { error: "Title, content, and type are required" },
        { status: 400 }
      );
    }

    const userId = session.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }

    const remarkData = {
      data: {
        title,
        content,
        type,
        rating: rating || null,
        category: category || null,
        state: "pending",
        priority: priority || "medium",
        users_permissions_user: userId,
      },
    };

    const response = await fetch(
      `${process.env.STRAPI_URL}/api/volunteer-remarks`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(remarkData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create volunteer remark" },
      { status: 500 }
    );
  }
}

// PUT - Update volunteer remark
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateFields } = body;

    if (!id) {
      return NextResponse.json({ error: "Remark ID is required" }, { status: 400 });
    }

    const response = await fetch(
      `${process.env.STRAPI_URL}/api/volunteer-remarks/${id}`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${process.env.STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: updateFields }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update volunteer remark" },
      { status: 500 }
    );
  }
}