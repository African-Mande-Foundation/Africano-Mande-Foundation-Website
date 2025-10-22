import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { firstName, lastName, email } = await req.json();

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { message: "First name, last name, and email are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    console.log("Attempting to update profile for user:", session.user.email);

    // Step 1: Get user from Strapi using current email
    const getUserRes = await fetch(
      `${process.env.STRAPI_URL}/api/users?filters[email][$eq]=${session.user.email}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
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

    const users = await getUserRes.json();
    console.log("Found users:", users.length);

    if (users.length === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const user = users[0];

    // Step 2: Check if new email already exists (if email is being changed)
    if (email !== session.user.email) {
      const emailCheckRes = await fetch(
        `${process.env.STRAPI_URL}/api/users?filters[email][$eq]=${email}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (emailCheckRes.ok) {
        const existingUsers = await emailCheckRes.json();
        if (existingUsers.length > 0) {
          return NextResponse.json(
            { message: "Email already exists" },
            { status: 409 }
          );
        }
      }
    }

    // Step 3: Update user profile in Strapi
    const updateData = {
      firstName,
      lastName,
      email,
      username: `${firstName}_${lastName}`, // Update username to match new name
    };

    const updateRes = await fetch(
      `${process.env.STRAPI_URL}/api/users/${user.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!updateRes.ok) {
      const errorData = await updateRes.json();
      console.error("Failed to update profile in Strapi:", errorData);
      
      // Check for specific Strapi errors
      if (errorData.error?.message?.includes("email")) {
        return NextResponse.json(
          { message: "Email already exists" },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { message: "Failed to update profile" },
        { status: 500 }
      );
    }

    const updatedUser = await updateRes.json();
    console.log("Profile updated successfully for user ID:", updatedUser.id);

    return NextResponse.json(
      { 
        message: "Profile updated successfully",
        user: {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          username: updatedUser.username,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}