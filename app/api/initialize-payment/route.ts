// app/api/initialize-payment/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, amount, currency = "USD", callback_url, metadata } = await req.json();

    // Validate required fields
    if (!email || !amount) {
      return NextResponse.json(
        { status: "error", message: "Email and amount are required" },
        { status: 400 }
      );
    }

    // For USD, amount should be in cents (multiply by 100)
    const amountInCents = Math.round(amount * 100);

    console.log("Initializing payment:", { email, amount, amountInCents, currency });

    // Initialize payment with Paystack
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY!}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amountInCents,
        currency,
        callback_url: callback_url || `${process.env.FRONTEND_URL}/payment/callback`,
        metadata: {
          email,
          amount,
          currency,
          ...metadata,
        },
        channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
      }),
    });

    const data = await response.json();
    console.log("Paystack response:", data);

    if (data.status) {
      return NextResponse.json({
        status: "success",
        message: "Payment initialized successfully",
        data: {
          authorization_url: data.data.authorization_url,
          access_code: data.data.access_code,
          reference: data.data.reference,
        },
      });
    } else {
      console.error("Paystack error:", data);
      return NextResponse.json(
        { 
          status: "error", 
          message: data.message || "Payment initialization failed",
          details: data
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}