import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { code, password, confirmPassword } = await req.json();

    if (!code || !password || !confirmPassword) {
      return NextResponse.json({ message: 'Code, password, and password confirmation are required.' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: 'Passwords do not match.' }, { status: 400 });
    }

    const strapiRes = await fetch(`${process.env.STRAPI_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ code, password, passwordConfirmation: confirmPassword }),
    });

    const data = await strapiRes.json();

    if (!strapiRes.ok) {
      return NextResponse.json({ message: data.error?.message || 'Failed to reset password.' }, { status: strapiRes.status });
    }

    return NextResponse.json({ message: 'Password reset successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Reset password API error:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}