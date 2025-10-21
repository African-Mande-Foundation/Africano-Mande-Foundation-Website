import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, password } = await req.json();

  const username = `${firstName}_${lastName}`;

  if (!username || !email || !password || !firstName || !lastName) {
    return NextResponse.json(
      { message: "firstName,lastName, email and password are required" },
      { status: 400 },
    );
  }

  const photoUrl =
    "https://firebasestorage.googleapis.com/v0/b/foundation-fm.firebasestorage.app/o/AMF%20Website%20Media%2Fuser.png?alt=media&token=0a984b06-225d-42aa-b62f-bd1262de153d";

  try {
    console.log("Step 1: Registering user with basic fields:", { username, email });

    // Step 1: Register with only basic required fields
    const strapiRes = await fetch(
      `${process.env.STRAPI_URL}/api/auth/local/register`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
          // Only send basic fields first
        }),
      },
    );

    const data = await strapiRes.json();
    console.log("Step 1 - Strapi response status:", strapiRes.status);
    console.log("Step 1 - Strapi response data:", data);

    if (!strapiRes.ok) {
      return NextResponse.json(
        { message: data.error?.message || "Registration failed" },
        { status: strapiRes.status },
      );
    }

    // Step 2: Update user with additional fields
    if (data.user && data.jwt) {
      try {
        console.log("Step 2: Updating user with additional fields:", { firstName, lastName, photoUrl });

        const updateRes = await fetch(
          `${process.env.STRAPI_URL}/api/users/${data.user.id}`,
          {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.jwt}`,
            },
            body: JSON.stringify({
              firstName,
              lastName,
              photoUrl,
            }),
          },
        );

        const updateData = await updateRes.json();
        console.log("Step 2 - Update response status:", updateRes.status);
        console.log("Step 2 - Update response data:", updateData);

        if (updateRes.ok) {
          console.log("User profile updated successfully");
          return NextResponse.json({ 
            user: updateData,
            message: "User registered and profile updated successfully" 
          }, { status: 200 });
        } else {
          console.log("Profile update failed, but registration successful");
          return NextResponse.json({ 
            user: data.user,
            message: "User registered successfully, but profile update failed" 
          }, { status: 200 });
        }
      } catch (updateError) {
        console.error("Profile update error:", updateError);
        return NextResponse.json({ 
          user: data.user,
          message: "User registered successfully, but profile update failed" 
        }, { status: 200 });
      }
    }

    return NextResponse.json({ user: data.user }, { status: 200 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
