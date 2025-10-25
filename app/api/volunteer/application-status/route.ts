// app/api/volunteer/application-status/route.ts
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
      `${process.env.STRAPI_URL}/api/users?filters[email][$eq]=${session.user.email}`,
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

    const userId = usersData[0].id;

    // Check for existing application
    const applicationResponse = await fetch(
      `${process.env.STRAPI_URL}/api/volunteer-applications?filters[users_permissions_user][id][$eq]=${userId}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
      }
    );

    const applicationData = await applicationResponse.json();

    if (applicationData.data && applicationData.data.length > 0) {
      const application = applicationData.data[0];
      return NextResponse.json({
        success: true,
        application: {
          id: application.id,
          state: application.attributes.state || 'pending',
          createdAt: application.attributes.createdAt,
          updatedAt: application.attributes.updatedAt,
        },
      });
    }

    return NextResponse.json({
      success: true,
      application: null,
    });

  } catch (error) {
    console.error("Application status API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}