import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, contact, message } = await req.json();

    console.log('Received data:', { name, email, contact, message });

    if (!name || !email || !message) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }


    const strapiRes = await fetch(`${process.env.STRAPI_URL}/api/contact-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          name,
          email,
          contact,
          message,
        },
      }),
    });

    console.log('Strapi response status:', strapiRes.status);
    
    const data = await strapiRes.json();
    console.log('Strapi response data:', data);

    if (!strapiRes.ok) {
      const errorMessage = data.error?.message || 'Failed to send message.';
      return NextResponse.json({ message: errorMessage, details: data }, { status: strapiRes.status });
    }

    return NextResponse.json({ message: 'Message sent successfully!', data: data.data }, { status: 200 });
  } catch (error) {
    console.error('Contact form API error:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}