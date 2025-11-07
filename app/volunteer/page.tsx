"use client";
import { useEffect, useState } from "react";
import { User, Briefcase, ChevronRight } from "lucide-react";
import Link from "next/link";
import VolunteerApplication from "../membership/volunteer/apply/page";

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
  target_hours:number
  supervisor?: Supervisor | null;
  users_permissions_user?: User | null;
  createdAt: string;
  updatedAt: string;
}

interface UpdateItem {
  id: number;
  title: string;
  publishedAt: string;
  slug:string;
}

interface DashboardData {
  applications: VolunteerApplication[];
  supervisor: Supervisor | null;
  totalHours: number;
  targetHours: number;
  startEndDates: { start_date: string | null; end_date: string | null };
  role: string | null;
  target_hours?: number; // optional, pulled from the collection field you added
}

function SkeletonCard() {
  return (
    <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-md p-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="rounded-md bg-gray-200 w-20 h-14 flex-shrink-0" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
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
      setUpdates(
        Array.isArray(data.data)
          ? data.data.map((item: UpdateItem) => ({
              id: item.id,
              title: item.title,
              publishedAt: item.publishedAt,
              slug: item.slug
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
  const startEndDates = dashboard?.startEndDates ?? { start_date: null, end_date: null };
  const role = dashboard?.role ?? null;
  const pct = application?.target_hours ? Math.max(0, Math.min(100, Math.round(application.hours_completed?(application?.hours_completed / (application?.target_hours )) * 100 : 0 ))) : 0;

  // Progress bar toward a configurable target (read from dashboard.target_hours / targetHours)
  const HoursChart = ({ value, target }: { value: number; target?: number }) => {
    const hours = Math.max(0, Math.round(value));
    const targetNum = target ? Math.round(target as number) : undefined;
    const pct = target ? Math.max(0, Math.min(100, Math.round((hours / (targetNum as number)) * 100))) : 0;

    return (
      <div className="flex items-center w-full gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Hours recorded</div>
            <div className="text-sm font-semibold text-[#04663A]">{hours} hrs</div>
          </div>

          {target ? (
            <>
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: "linear-gradient(90deg,#06b6d4 0%,#10B981 50%,#04663A 100%)",
                    transition: "width 600ms ease",
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                <span>0</span>
                <span className="font-medium text-gray-700">{hours} hrs</span>
                <span>{targetNum} hrs</span>
              </div>

              <div className="mt-2">
                <div className="inline-flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-green-50 text-green-800 font-medium">{pct}%</span>
                  <span className="text-gray-500">of {target} hr target</span>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-lg bg-white p-4 shadow-sm border text-sm text-gray-700">
              <div className="mb-1 font-medium text-gray-900">{hours} hrs</div>
              <div className="text-xs text-gray-500">Target not set. Set target_hours in the CMS to enable progress tracking.</div>
            </div>
          )}
        </div>

        <div className="w-28 text-right hidden sm:block">
          <div className="text-3xl font-extrabold text-[#065f46]">{hours}</div>
          <div className="text-xs text-gray-500">hours</div>
          {target && (
            <div className="mt-2 text-xs text-gray-500">
              Target: <span className="font-medium text-gray-800">{target} hrs</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <div className="w-full p-6 max-w-7xl mx-auto">
        {/* header */}
        <div className="rounded-lg p-6 mb-6 bg-gradient-to-r from-[#E6FFFA] to-[#ECFDF5] border border-green-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#065f46]">Volunteer Dashboard</h1>
            <p className="text-sm text-green-800/80">Overview of your application, supervisor, and progress</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm px-3 py-2 rounded-md bg-white border shadow-sm text-gray-700">Welcome back</div>
            { pct == 100 ? <div className="text-sm px-3 py-2 rounded-md bg-gradient-to-r from-[#d1fae5] to-[#bbf7d0] text-[#047857] font-medium">Completed</div> : 
            <div className="text-sm px-3 py-2 rounded-md bg-gradient-to-r from-[#d1fae5] to-[#bbf7d0] text-[#047857] font-medium">Active</div>
            
          }
            
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <div className="space-y-4 lg:col-span-2">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - progress and supervisor */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6 ring-1 ring-green-50">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Volunteer Progress</h2>
                  <div className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-[#fff7ed] to-[#fff1f2] text-yellow-700 font-medium">Volunteer</div>
                </div>

                {!application ? (
                  <p className="text-gray-400 mt-4">No progress data available.</p>
                ) : (
                  <>
                    <div className="text-sm text-gray-500 mt-4">Department</div>
                    <div className="text-lg font-medium text-gray-900 mb-3">{application.department ?? "-"}</div>

                    {/* removed hours progress bar as requested; show key info only */}
                    <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                      <span>Hours completed</span>
                      <span className="font-semibold text-[#065f46]">{application.hours_completed ?? 0}</span>
                    </div>

                    <div className="mt-4 text-sm text-gray-600 space-y-2">
                      <div><strong className="text-gray-800">Application remarks:</strong> <span className="text-gray-600">{application.application_remarks ?? "—"}</span></div>
                      <div><strong className="text-gray-800">Supervisor remarks:</strong> <span className="text-gray-600">{application.supervisor_remarks ?? "—"}</span></div>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 ring-1 ring-indigo-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gradient-to-tr from-[#f0f9ff] to-[#ecfeff]">
                    <User className="w-6 h-6 text-[#0ea5a3]" />
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-900">Supervisor</h3>
                    {supervisor ? (
                      <div className="mt-2 text-sm text-gray-700 space-y-1">
                        <div className="font-medium text-gray-900">{supervisor.supervisor_name}</div>
                        {/* display email and phone as plain text (no buttons) */}
                        <div className="text-xs text-gray-600">{supervisor.supervisor_email}</div>
                        <div className="text-xs text-gray-600">{supervisor.supervisor_phone}</div>
                      </div>
                    ) : (
                      <p className="text-gray-400 mt-2">No supervisor assigned.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - stats and updates */}
            <div className="col-span-1 lg:col-span-2 space-y-6">
              {/* Hours card (now full width) */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-sm text-gray-500">Total Hours Achieved</div>
                <div className="mt-3">
                  <HoursChart value={application?.hours_completed ?? 0} target={application?.target_hours ?? 0} />
                </div>
              </div>

              {/* Role and Start/End as separate cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
                  <div className="text-sm text-gray-500">Role</div>
                  <div className="text-lg font-semibold text-gray-900 mt-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#065f46]" />
                    <span>{role ?? "-"}</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="text-sm text-gray-500">Start & End Date</div>
                  <div className="mt-3 text-sm text-gray-800 space-y-1">
                    <div><strong>Start:</strong> {startEndDates.start_date ? new Date(startEndDates.start_date).toLocaleDateString() : "-"}</div>
                    <div><strong>End:</strong> {startEndDates.end_date ? new Date(startEndDates.end_date).toLocaleDateString() : "-"}</div>
                  </div>
                </div>
              </div>
            </div>


            <div className="bg-white rounded-xl lg:col-span-3 shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Latest Updates</h2>
                  <Link href="/volunteer/updates" className="text-sm text-[#085f46] font-medium">See all</Link>
                </div>
                {loadingUpdates ? (
                  <div className="space-y-3">
                    <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                  </div>
                ) : updates.length === 0 ? (
                  <div className="text-gray-400">No updates yet.</div>
                ) : (
                  <ul className="space-y-3">
                    {updates.map((item) => (
                      <li key={item.id} className="flex items-start justify-between hover:bg-green-50/50 p-3 rounded-md transition">
                        <div>
                          <div className="font-medium text-gray-900">{item.title}</div>
                          <div className="text-xs text-gray-500">{new Date(item.publishedAt).toLocaleDateString()}</div>
                        </div>
                        <Link href={`/volunteer/updates/${item.slug}`} className="text-[#065f46]">
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
          </div>
        )}
      </div>
    </div>
  );
}