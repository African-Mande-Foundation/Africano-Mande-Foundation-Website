// app/api/user/delete-account/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.jwt) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { password } = await req.json();

    if (!password) {
      return NextResponse.json(
        { message: "Password is required to delete your account" },
        { status: 400 }
      );
    }

    console.log("Attempting to delete account for user");

    // Step 1: Verify the user's password using Strapi's auth endpoint
    const verifyPasswordRes = await fetch(
      `${process.env.STRAPI_URL}/api/auth/local`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: session.user?.email,
          password: password,
        }),
      }
    );

    if (!verifyPasswordRes.ok) {
      console.log("Password verification failed");
      return NextResponse.json(
        { message: "Incorrect password. Please try again." },
        { status: 400 }
      );
    }

    console.log("Password verification successful");

    // Step 2: Get current user data to get the user ID
    const getUserRes = await fetch(
      `${process.env.STRAPI_URL}/api/users/me`,
      {
        headers: {
          Authorization: `Bearer ${session.jwt}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!getUserRes.ok) {
      console.error("Failed to fetch user from Strapi");
      return NextResponse.json(
        { message: "Failed to fetch user data" },
        { status: 500 }
      );
    }

    const user = await getUserRes.json();
    console.log("Found user to delete:", user.id);

    // Step 3: Delete the user from Strapi (requires admin token)
    const deleteRes = await fetch(
      `${process.env.STRAPI_URL}/api/users/${user.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`, // Use admin token for deletion
          "Content-Type": "application/json",
        },
      }
    );

    if (!deleteRes.ok) {
      const errorData = await deleteRes.json();
      console.error("Failed to delete user from Strapi:", errorData);
      return NextResponse.json(
        { message: "Failed to delete account. Please try again later." },
        { status: 500 }
      );
    }

    console.log("User account deleted successfully from Strapi");

    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}