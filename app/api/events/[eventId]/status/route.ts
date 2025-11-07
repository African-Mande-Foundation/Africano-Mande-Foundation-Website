// app/api/events/[eventId]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";

interface StrapiUser {
  id: number;
  username: string;
  email: string;
}

interface StrapiEvent {
  id: number;
  documentId: string;
  Title: string;
  Description: string;
  Date: string;
  Location: string | null;
  seats: number;
  seats_remaining: number;
  state: string;
  users_permissions_users?: StrapiUser[];
}

interface StrapiEventResponse {
  data: StrapiEvent;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.jwt) {
      return NextResponse.json(
        { isRegistered: false },
        { status: 200 }
      );
    }

    const { eventId } = await params; // Await params before destructuring

    // Get the event with registered users
    const eventRes = await fetch(
      `${process.env.STRAPI_URL}/api/events/${eventId}?populate=users_permissions_users`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!eventRes.ok) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    const eventData: StrapiEventResponse = await eventRes.json();
    const event = eventData.data;

    // Get current user data
    const userRes = await fetch(
      `${process.env.STRAPI_URL}/api/users/me`,
      {
        headers: {
          Authorization: `Bearer ${session.jwt}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!userRes.ok) {
      return NextResponse.json(
        { isRegistered: false },
        { status: 200 }
      );
    }

    const userData: StrapiUser = await userRes.json();
    const userId = userData.id;

    // Check if user is registered
    const registeredUsers = event.users_permissions_users || [];
    const isRegistered = registeredUsers.some((user: StrapiUser) => user.id === userId);

    return NextResponse.json(
      { 
        isRegistered,
        seats_remaining: event.seats_remaining,
        event_state: event.state
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Event status check error:", error);
    return NextResponse.json(
      { isRegistered: false },
      { status: 200 }
    );
  }
}