import { NextRequest, NextResponse } from "next/server";

// Types for the dashboard data
interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface Supervisor {
  id: number;
  supervisor_name: string;
  supervisor_email: string;
  supervisor_phone: string;
}

interface VolunteerApplication {
  id: number;
  department?: string;
  role?: string;
  start_date?: string;
  end_date?: string;
  application_remarks?: string;
  kin_phone_number?: string;
  supervisor_remarks?: string;
  hours_completed?: number;
  supervisor?: Supervisor | null;
  users_permissions_user?: User | null;
  createdAt: string;
  updatedAt: string;
}

interface StrapiVolunteerApplicationResponse {
  id: number;
  department?: string;
  role?: string;
  start_date?: string;
  end_date?: string;
  application_remarks?: string;
  kin_phone_number?: string;
  supervisor_remarks?: string;
  hours_completed?: number;
  supervisor?: Supervisor | null;
  users_permissions_user?: User | null;
  createdAt: string;
  updatedAt: string;
}

interface StrapiResponse {
  data: StrapiVolunteerApplicationResponse[];
}

export async function GET(request: NextRequest) {
  try {
    // Fetch volunteer-application collection with relations
    const queryParams = new URLSearchParams({
      "populate[supervisor][fields][0]": "id",
      "populate[supervisor][fields][1]": "supervisor_name",
      "populate[supervisor][fields][2]": "supervisor_email",
      "populate[supervisor][fields][3]": "supervisor_phone",
      "populate[users_permissions_user][fields][0]": "id",
      "populate[users_permissions_user][fields][1]": "username",
      "populate[users_permissions_user][fields][2]": "email",
      "populate[users_permissions_user][fields][3]": "firstName",
      "populate[users_permissions_user][fields][4]": "lastName",
      "sort": "createdAt:desc",
      "pagination[pageSize]": "100"
    });

    const apiUrl = `${process.env.STRAPI_URL}/api/volunteer-applications?${queryParams}`;
    const response = await fetch(apiUrl, {
      headers: {
        "Authorization": `Bearer ${process.env.STRAPI_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data: StrapiResponse = await response.json();

    // Transform for dashboard
    const items: VolunteerApplication[] = (data.data || []).map((item) => ({
      id: item.id,
      department: item.department,
      role: item.role,
      start_date: item.start_date,
      end_date: item.end_date,
      application_remarks: item.application_remarks,
      kin_phone_number: item.kin_phone_number,
      supervisor_remarks: item.supervisor_remarks,
      hours_completed: item.hours_completed,
      supervisor: item.supervisor
        ? {
            id: item.supervisor.id,
            supervisor_name: item.supervisor.supervisor_name,
            supervisor_email: item.supervisor.supervisor_email,
            supervisor_phone: item.supervisor.supervisor_phone,
          }
        : null,
      users_permissions_user: item.users_permissions_user
        ? {
            id: item.users_permissions_user.id,
            username: item.users_permissions_user.username,
            email: item.users_permissions_user.email,
            firstName: item.users_permissions_user.firstName,
            lastName: item.users_permissions_user.lastName,
          }
        : null,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    // Dashboard summary
    const totalHours = items.reduce((sum, item) => sum + (item.hours_completed || 0), 0);
    const supervisor = items[0]?.supervisor || null;
    const latestItems = [...items]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(item => ({
        title: item.department || "Untitled",
        publishedAt: item.createdAt,
      }));

    // Cards for start/end date and role
    const startEndDates = items[0]
      ? { start_date: items[0].start_date, end_date: items[0].end_date }
      : { start_date: null, end_date: null };
    const role = items[0]?.role || null;

    return NextResponse.json({
      applications: items,
      supervisor,
      totalHours,
      latestItems,
      startEndDates,
      role,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}