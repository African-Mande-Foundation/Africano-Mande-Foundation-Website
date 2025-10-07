import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reference, email } = await req.json();

    const r = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET!}`, 
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await r.json();

    if (data?.status && data?.data?.status === "success") {
      const amount = (data.data.amount ?? 0) / 100;
      const currency = data.data.currency ?? "USD";


      return NextResponse.json({
        status: "success",
        reference,
        email,
        amount,
        currency,
      });
    }

    return NextResponse.json({ status: "failed", details: data }, { status: 400 });
  } catch {
    return NextResponse.json({ status: "error", message: "Verification failed" }, { status: 500 });
  }
}
