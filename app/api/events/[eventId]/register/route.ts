// app/api/events/[eventId]/register/route.ts
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
  Location: string;
  seats: number;
  seats_remaining: number;
  state: string;
  users_permissions_users?: StrapiUser[];
}

interface StrapiEventResponse {
  data: StrapiEvent;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.jwt) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in to register for events." },
        { status: 401 }
      );
    }

    const { eventId } = await params; // Await params before destructuring

    // First, get the current event data
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

    // Check if event is available for registration
    if (event.state !== "upcoming") {
      return NextResponse.json(
        { message: "This event is not available for registration" },
        { status: 400 }
      );
    }

    // Check if there are seats available
    if (event.seats_remaining <= 0) {
      return NextResponse.json(
        { message: "Sorry, this event is fully booked" },
        { status: 400 }
      );
    }

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
        { message: "Failed to get user data" },
        { status: 500 }
      );
    }

    const userData: StrapiUser = await userRes.json();
    const userId = userData.id;

    // Check if user is already registered for this event
    const existingRegistrations = event.users_permissions_users || [];
    const isAlreadyRegistered = existingRegistrations.some(
      (user: StrapiUser) => user.id === userId
    );

    if (isAlreadyRegistered) {
      return NextResponse.json(
        { message: "You are already registered for this event" },
        { status: 400 }
      );
    }

    // Add user to the event's registered users list
    const updatedUsersList = [
      ...existingRegistrations.map((user: StrapiUser) => user.id),
      userId
    ];

    // Calculate new seats remaining
    const newSeatsRemaining = event.seats_remaining - 1;

    // Update the event with the new user and decreased seats
    const updateRes = await fetch(
      `${process.env.STRAPI_URL}/api/events/${eventId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            users_permissions_users: updatedUsersList,
            seats_remaining: newSeatsRemaining,
          },
        }),
      }
    );

    if (!updateRes.ok) {
      const errorData = await updateRes.json();
      console.error("Failed to update event:", errorData);
      return NextResponse.json(
        { message: "Failed to register for event. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: "Successfully registered for the event!",
        seats_remaining: newSeatsRemaining
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Event registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}