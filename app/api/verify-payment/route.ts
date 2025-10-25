import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json(
        { status: "error", message: "Payment reference is required" },
        { status: 400 }
      );
    }

    console.log("Verifying payment reference:", reference);

    // Verify payment with Paystack
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY!}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log("Paystack verification response:", data);

    if (data.status && data.data.status === "success") {
      // Payment was successful
      const paymentData = data.data;

      // Here you can save the payment to your database
      // await savePaymentToDatabase(paymentData);

      return NextResponse.json({
        status: "success",
        message: "Payment verified successfully",
        data: {
          reference: paymentData.reference,
          amount: paymentData.amount / 100, // Convert back from cents
          currency: paymentData.currency,
          customer: paymentData.customer,
          status: paymentData.status,
          paid_at: paymentData.paid_at,
        },
      });
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: "Payment verification failed",
          details: data,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
