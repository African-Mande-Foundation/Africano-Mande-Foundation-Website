// app/api/user/role/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user from Strapi
    const usersResponse = await fetch(
      `${process.env.STRAPI_URL}/api/users?filters[email][$eq]=${session.user.email}&populate=role`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
      }
    );

    const usersData = await usersResponse.json();
    
    if (!usersData || usersData.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const user = usersData[0];
    const userRole = user.role?.name || 'authenticated';

    return NextResponse.json({
      success: true,
      role: userRole,
      userId: user.id,
    });

  } catch (error) {
    console.error("User role API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}