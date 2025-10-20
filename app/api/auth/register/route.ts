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
    "https://firebasestorage.googleapis.com/v0/b/foundation-fm.firebasestorage.app/o/Foundation_FM_Media%2Fuser.png?alt=media&token=23522495-7f95-41c4-a0df-d53d2584741e";

  try {
    console.log("Attempting to register user:", { username, email, firstName, lastName });

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
          password,
          username,
          photoUrl,
          firstName,
          lastName,
        }),
      },
    );

    const data = await strapiRes.json(); // Keep only this line
    console.log("Strapi response status:", strapiRes.status);
    console.log("Strapi response data:", data);

    if (!strapiRes.ok) {
      return NextResponse.json(
        { message: data.error?.message || "Registration failed" },
        { status: strapiRes.status },
      );
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
