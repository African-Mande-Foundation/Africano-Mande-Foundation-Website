// app/api/donations/public/route.ts
import { NextResponse } from "next/server";

interface PublicDonationRequestBody {
  transactionId: string;
  amount_usd: number;
  cause: string;
  fullName: string;
  email: string;
  message?: string;
}

export async function POST(req: Request) {
  try {
    const body: PublicDonationRequestBody = await req.json();
    const { transactionId, amount_usd, cause, fullName, email, message } = body;

    // Validate required fields
    if (!transactionId || !amount_usd || !cause || !fullName || !email) {
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

    // Verify the transaction details match
    const verifiedAmount = verifyData.data.amount / 100; // Convert from kobo/cents
    const verifiedEmail = verifyData.data.customer.email;

    if (Math.abs(verifiedAmount - amount_usd) > 0.01 || verifiedEmail !== email) {
      return NextResponse.json(
        { success: false, error: "Payment details mismatch" },
        { status: 400 }
      );
    }

    // Save donation to Strapi
    const donationData = {
      transactionId,
      fullName,
      email,
      amount_usd,
      cause,
      ...(message && { message }),
    };

    const strapiResponse = await fetch(`${process.env.STRAPI_URL}/api/donation-non-registereds`, {
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
        donor: fullName,
      },
    });

  } catch (error) {
    console.error("Public donation API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}