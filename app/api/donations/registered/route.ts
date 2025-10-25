// app/api/donations/registered/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

interface DonationRequestBody {
  transactionId: string;
  amount_usd: number;
  cause: string;
  message?: string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const body: DonationRequestBody = await req.json();
    const { transactionId, amount_usd, cause, message } = body;

    // Validate required fields
    if (!transactionId || !amount_usd || !cause) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${transactionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY!}`,
        "Content-Type": "application/json",
      },
    });

    const verifyData = await verifyResponse.json();

    if (!verifyData.status || verifyData.data.status !== "success") {
      return NextResponse.json(
        { success: false, error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Get user ID from Strapi based on email
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
        { success: false, error: "User not found in database" },
        { status: 404 }
      );
    }

    const userId = usersData[0].id;

    // Save donation to Strapi
    const donationData = {
      transactionId,
      amount_usd,
      cause,
      users_permissions_user: userId,
      ...(message && { message }),
    };

    const strapiResponse = await fetch(`${process.env.STRAPI_URL}/api/donation-registereds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      },
      body: JSON.stringify({ data: donationData }),
    });

    const strapiData = await strapiResponse.json();

    if (!strapiResponse.ok) {
      console.error("Strapi error:", strapiData);
      return NextResponse.json(
        { success: false, error: "Failed to save donation" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Donation saved successfully",
      data: {
        id: strapiData.data.id,
        transactionId,
        amount: amount_usd,
        cause,
      },
    });

  } catch (error) {
    console.error("Donation API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}