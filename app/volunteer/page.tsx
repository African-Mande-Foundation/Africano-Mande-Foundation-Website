"use client";
import { useEffect, useState } from "react";
import { Calendar, User, Clock, Briefcase, CalendarDays } from "lucide-react";

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

interface UpdateItem {
  id: number;
  title: string;
  publishedAt: string;
}

interface DashboardData {
  applications: VolunteerApplication[];
  supervisor: Supervisor | null;
  totalHours: number;
  startEndDates: { start_date: string | null; end_date: string | null };
  role: string | null;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      <div className="h-6 w-1/3 bg-gray-200 rounded mb-4" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default function Volunteer() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUpdates, setLoadingUpdates] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      const res = await fetch("/api/volunteer/dashboard");
      const data = await res.json();
      setDashboard(data);
      setLoading(false);
    }
    fetchDashboard();
  }, []);

  useEffect(() => {
    async function fetchUpdates() {
      setLoadingUpdates(true);
      const res = await fetch("/api/volunteer/updates?populate=*");
      const data = await res.json();
      // Specify the type for Strapi update items
      setUpdates(
        Array.isArray(data.data)
          ? data.data.map((item: UpdateItem) => ({
              id: item.id,
              title: item.title,
              publishedAt: item.publishedAt,
            }))
          : []
      );
      setLoadingUpdates(false);
    }
    fetchUpdates();
  }, []);

  // Safe fallback for dashboard properties
  const application = dashboard?.applications?.[0] ?? null;
  const supervisor = dashboard?.supervisor ?? null;
  const totalHours = dashboard?.totalHours ?? 0;
  const startEndDates = dashboard?.startEndDates ?? { start_date: null, end_date: null };
  const role = dashboard?.role ?? null;

  return (
    <div className="w-full h-full min-h-screen">
        <div className="w-full p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">
        Volunteer Application Dashboard
      </h1>
      <p className="text-gray-600 mb-8">
        Overview of your application, supervisor, and progress details
      </p>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className=" w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Volunteer Progress (Column style, single record) */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Volunteer Progress
            </h2>
            {!application ? (
              <p className="text-gray-400">No progress data available.</p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-gray-500 font-medium">Department</div>
                  <div className="text-gray-900">{application.department ?? "-"}</div>
                  <div className="text-gray-500 font-medium">Application Remarks</div>
                  <div className="text-gray-900">{application.application_remarks ?? "-"}</div>
                  <div className="text-gray-500 font-medium">Supervisor Remarks</div>
                  <div className="text-gray-900">{application.supervisor_remarks ?? "-"}</div>
                  <div className="text-gray-500 font-medium">Hours Completed</div>
                  <div className="text-gray-900">{application.hours_completed ?? "-"}</div>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Supervisor Details */}
          <div className="bg-white w-full rounded-xl shadow-md p-6 flex flex-col justify-start gap-2">
            <h2 className="text-xl font-semibold mb-4">
              Supervisor Details
            </h2>
            {supervisor ? (
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <User className="w-5 h-5 mr-2 text-primary" />
                  <span className="font-medium">{supervisor.supervisor_name}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">{supervisor.supervisor_email}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-medium">Phone:</span>
                  <span className="ml-2">{supervisor.supervisor_phone}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">No supervisor assigned.</p>
            )}
          </div>

          {/* Card 3: Number of Hours Achieved */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-4">
              Total Hours Achieved
            </h2>
            <div className="flex items-center justify-center">
              <Clock className="w-10 h-10 text-primary mr-4" />
              <span className="text-4xl font-bold text-gray-900">
                {totalHours}
              </span>
            </div>
          </div>

          {/* Card 4: Latest Updates */}
          <div className="bg-white w-full rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Latest Updates</h2>
            {loadingUpdates ? (
              <div className="space-y-3">
                <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-2" />
              </div>
            ) : (
              <ul className="space-y-3">
                {updates.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-2"
                  >
                    <div>
                      <span className="font-medium text-gray-900">{item.title}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-1 text-primary" />
                      <span>
                        {new Date(item.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Card 5: Start and End Date */}
          <div className="bg-white w-full rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-4">Start & End Date</h2>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center text-gray-700">
                <CalendarDays className="w-5 h-5 mr-2 text-primary" />
                <span>
                  <span className="font-medium">Start:</span>{" "}
                  {startEndDates.start_date
                    ? new Date(startEndDates.start_date).toLocaleDateString()
                    : "-"}
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <CalendarDays className="w-5 h-5 mr-2 text-primary" />
                <span>
                  <span className="font-medium">End:</span>{" "}
                  {startEndDates.end_date
                    ? new Date(startEndDates.end_date).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Card 6: Role */}
          <div className="bg-white w-full rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-4">Role</h2>
            <div className="flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-primary mr-2" />
              <span className="text-2xl font-bold text-gray-900">
                {role || "-"}
              </span>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}