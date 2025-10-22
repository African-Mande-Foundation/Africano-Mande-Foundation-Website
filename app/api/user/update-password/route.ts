import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.jwt) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "New password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    console.log("Attempting to change password using Strapi's change-password endpoint");

    // Use Strapi's built-in password change endpoint
    const changePasswordRes = await fetch(
      `${process.env.STRAPI_URL}/api/auth/change-password`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          password: newPassword,
          passwordConfirmation: newPassword,
        }),
      }
    );

    const responseData = await changePasswordRes.json();
    console.log("Strapi change-password response:", changePasswordRes.status, responseData);

    if (!changePasswordRes.ok) {
      // Handle specific Strapi errors
      if (responseData.error?.message?.includes("password")) {
        return NextResponse.json(
          { message: "Current password is incorrect" },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { message: responseData.error?.message || "Failed to change password" },
        { status: changePasswordRes.status }
      );
    }

    console.log("Password changed successfully");

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}