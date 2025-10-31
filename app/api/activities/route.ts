import { NextRequest, NextResponse } from "next/server";

// Types
interface Donation {
  id: number;
  transactionId: string;
  amount_usd: number;
  cause: string;
  createdAt: string;
}

interface Event {
  id: number;
  Title: string;
  Location: string;
  Date: string;
}

interface VolunteerApplication {
  id: number;
  createdAt: string;
  state: string;
}

interface ActivitiesResponse {
  donations: Donation[];
  events: Event[];
  applications: VolunteerApplication[];
}

// Strapi item types
interface StrapiDonationItem {
  id: number;
  transactionId: string;
  amount_usd: number;
  cause: string;
  createdAt: string;
}

interface StrapiEventItem {
  id: number;
  Title: string;
  Location: string;
  Date: string;
}

interface StrapiApplicationItem {
  id: number;
  createdAt: string;
  state: string;
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    // Fetch Donations
    const donationsRes = await fetch(
      `${process.env.STRAPI_URL}/api/donation-registereds?filters[users_permissions_user][id][$eq]=${userId}&sort=createdAt:desc&populate=*`,
      {
        headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` },
      }
    );
    const donationsData = await donationsRes.json();
    const donations: Donation[] = (donationsData.data || []).map((item: StrapiDonationItem) => ({
      id: item.id,
      transactionId: item.transactionId,
      amount_usd: item.amount_usd,
      cause: item.cause,
      createdAt: item.createdAt,
    }));

    // Fetch Events
    const eventsRes = await fetch(
      `${process.env.STRAPI_URL}/api/events?filters[users_permissions_users][id][$eq]=${userId}&sort=Date:desc&populate=*`,
      {
        headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` },
      }
    );
    const eventsData = await eventsRes.json();
    const events: Event[] = (eventsData.data || []).map((item: StrapiEventItem) => ({
      id: item.id,
      Title: item.Title,
      Location: item.Location,
      Date: item.Date,
    }));

    // Fetch Volunteer Applications
    const appsRes = await fetch(
      `${process.env.STRAPI_URL}/api/volunteer-applications?filters[users_permissions_user][id][$eq]=${userId}&sort=createdAt:desc&populate=*`,
      {
        headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` },
      }
    );
    const appsData = await appsRes.json();
    const applications: VolunteerApplication[] = (appsData.data || []).map((item: StrapiApplicationItem) => ({
      id: item.id,
      createdAt: item.createdAt,
      state: item.state,
    }));

    return NextResponse.json({
      donations,
      events,
      applications,
    } as ActivitiesResponse);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}