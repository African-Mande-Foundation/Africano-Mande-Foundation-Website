import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    const strapiRes = await fetch(`${process.env.STRAPI_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await strapiRes.json();

    if (!strapiRes.ok) {
      return NextResponse.json({ message: data.error?.message || 'Failed to send reset email.' }, { status: strapiRes.status });
    }

    return NextResponse.json({ message: 'Only registered emails, will receive a password reset link. If you have not received the password reset link in your inbox, check your spam folder.' }, { status: 200 });
  } catch (error) {
    console.error('Forgot password API error:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}