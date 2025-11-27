/* eslint-disable  */
"use client";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Heart,
  Calendar as CalendarIcon,
  Clock,
  UserCheck,
  DollarSign,
  Download,
  Search as SearchIcon,
} from "lucide-react";

interface Donation {
  id: number;
  transactionId: string;
  amount_usd: number;
  cause?: string | null;
  createdAt: string;
  // other fields may exist
  [key: string]: unknown;
}

interface Event {
  id: number;
  Title: string;
  Location?: string;
  Date: string;
  [key: string]: unknown;
}

interface VolunteerApplication {
  id: number;
  createdAt: string;
  state: string;
  [key: string]: unknown;
}

interface ActivitiesResponse {
  donations: Donation[];
  events: Event[];
  applications: VolunteerApplication[];
  // optional paging metadata from API
  donationsTotal?: number;
  eventsTotal?: number;
}

export default function ActivitiesPage() {
  const [data, setData] = useState<ActivitiesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  // Ensure userId is a string (avoid using `any`)
  const userId = typeof session?.user?.id === "string" ? session.user.id : undefined;

  // UI state: donations
  const [donationsPage, setDonationsPage] = useState<number>(1);
  const [donationsPageSize, setDonationsPageSize] = useState<number>(6);
  const [donationsSearch, setDonationsSearch] = useState<string>("");
  const [donationsStartDate, setDonationsStartDate] = useState<string>("");
  const [donationsEndDate, setDonationsEndDate] = useState<string>("");

  // UI state: events
  const [eventsPage, setEventsPage] = useState<number>(1);
  const [eventsPageSize, setEventsPageSize] = useState<number>(5);
  const [eventsSearch, setEventsSearch] = useState<string>("");

  // Generic reload trigger
  const [reloadKey, setReloadKey] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      if (!userId) {
        setData(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Request includes pagination and basic filters (server may ignore unknown params)
        const params = new URLSearchParams();
        params.set("userId", String(userId));
        params.set("donationsPage", String(donationsPage));
        params.set("donationsPageSize", String(donationsPageSize));
        params.set("eventsPage", String(eventsPage));
        params.set("eventsPageSize", String(eventsPageSize));
        // server-side search params (if implemented)
        if (donationsSearch) params.set("donationsSearch", donationsSearch);
        if (eventsSearch) params.set("eventsSearch", eventsSearch);
        if (donationsStartDate) params.set("donationsStartDate", donationsStartDate);
        if (donationsEndDate) params.set("donationsEndDate", donationsEndDate);

        const res = await fetch(`/api/activities?${params.toString()}`, { method: "GET" });
        if (!res.ok) {
          throw new Error("Failed to fetch activities");
        }
        const json = (await res.json()) as ActivitiesResponse;
        setData(json);
      } catch (err) {
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    // reload when userId, pagination, filters, or explicit reloadKey change
  }, [
    userId,
    donationsPage,
    donationsPageSize,
    eventsPage,
    eventsPageSize,
    donationsSearch,
    eventsSearch,
    donationsStartDate,
    donationsEndDate,
    reloadKey,
  ]);

  // Derived / client-side filtering if server doesn't support search
  const visibleDonations = useMemo(() => {
    const all = data?.donations ?? [];
    const filtered = all.filter((d) => {
      const q = donationsSearch.trim().toLowerCase();
      if (q) {
        const txn = String(d.transactionId ?? "").toLowerCase();
        const cause = String(d.cause ?? "").toLowerCase();
        if (!txn.includes(q) && !cause.includes(q)) return false;
      }
      if (donationsStartDate) {
        const start = new Date(donationsStartDate);
        if (new Date(d.createdAt) < start) return false;
      }
      if (donationsEndDate) {
        const end = new Date(donationsEndDate);
        // include entire day
        end.setHours(23, 59, 59, 999);
        if (new Date(d.createdAt) > end) return false;
      }
      return true;
    });

    // if API returned paged data, use it; otherwise paginate client-side
    if ((data?.donationsTotal ?? 0) > 0 || all.length <= donationsPageSize) {
      return filtered;
    }

    const startIdx = (donationsPage - 1) * donationsPageSize;
    return filtered.slice(startIdx, startIdx + donationsPageSize);
  }, [data, donationsSearch, donationsStartDate, donationsEndDate, donationsPage, donationsPageSize]);

  const visibleEvents = useMemo(() => {
    const all = data?.events ?? [];
    const filtered = all.filter((e) => {
      const q = eventsSearch.trim().toLowerCase();
      if (q) {
        const title = String(e.Title ?? "").toLowerCase();
        const loc = String(e.Location ?? "").toLowerCase();
        if (!title.includes(q) && !loc.includes(q)) return false;
      }
      return true;
    });

    if ((data?.eventsTotal ?? 0) > 0 || all.length <= eventsPageSize) {
      return filtered;
    }

    const startIdx = (eventsPage - 1) * eventsPageSize;
    return filtered.slice(startIdx, startIdx + eventsPageSize);
  }, [data, eventsSearch, eventsPage, eventsPageSize]);

  // summary metrics
  const totalDonationsCount = data?.donations?.length ?? 0;
  const totalDonationsAmount = (data?.donations ?? []).reduce((s, d) => s + (Number(d.amount_usd) || 0), 0);
  const upcomingEventsCount = data?.events?.length ?? 0;
  const applicationsCount = data?.applications?.length ?? 0;

  // Donations by cause for chart
  const donationsByCause = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of data?.donations ?? []) {
      const cause = (d.cause && String(d.cause).trim()) || "Unspecified";
      map.set(cause, (map.get(cause) || 0) + (Number(d.amount_usd) || 0));
    }
    const palette = [
      "#7eaf58",
      "#8fd18b",
      "#04663A",
      "#f6c85f",
      "#f28c8c",
      "#8ecae6",
      "#a78bfa",
      "#ffb3c6",
      "#ffd166",
      "#6a994e",
    ];
    return Array.from(map.entries())
      .map(([cause, amount], i) => ({ cause, amount, color: palette[i % palette.length] }))
      .sort((a, b) => b.amount - a.amount);
  }, [data]);

  // CSV export (visible donations)
  function downloadCsv() {
    type CsvRow = Record<string, string | number | boolean | null | undefined>;

    const rows: CsvRow[] = visibleDonations.map((d) => ({
      id: d.id,
      transactionId: d.transactionId,
      cause: d.cause ?? "",
      amount_usd: Math.round(Number(d.amount_usd ?? 0)),
      createdAt: d.createdAt,
    }));

    const header = rows.length
      ? Object.keys(rows[0])
      : ["id", "transactionId", "cause", "amount_usd", "createdAt"];

    const csv = [header.join(",")]
      .concat(
        rows.map((r) =>
          header
            .map((h) => {
              const cell = r[h] ?? "";
              return `"${String(cell).replace(/"/g, '""')}"`;
            })
            .join(",")
        )
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donations_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="w-full h-auto max-w-7xl p-4 text-gray-700">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Activities</h1>
        <div className="text-sm text-gray-500">Member dashboard • recent activity</div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4 border transition-shadow duration-200 ease-in-out hover:shadow-md motion-reduce:transition-none">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg" aria-hidden>
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Donations</div>
            <div className="text-lg font-semibold">{totalDonationsCount}</div>
            <div className="text-xs text-gray-400">entries</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-lg font-semibold text-green-700">
              <DollarSign className="inline w-4 h-4 mr-1" />
              ${Math.round(totalDonationsAmount)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4 border transition-shadow duration-200 ease-in-out hover:shadow-md motion-reduce:transition-none">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg" aria-hidden>
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Upcoming Events</div>
            <div className="text-lg font-semibold">{upcomingEventsCount}</div>
            <div className="text-xs text-gray-400">events</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4 border transition-shadow duration-200 ease-in-out hover:shadow-md motion-reduce:transition-none">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg" aria-hidden>
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Volunteer Apps</div>
            <div className="text-lg font-semibold">{applicationsCount}</div>
            <div className="text-xs text-gray-400">applications</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4 border transition-shadow duration-200 ease-in-out hover:shadow-md motion-reduce:transition-none">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg" aria-hidden>
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Last update</div>
            <div className="text-lg font-semibold">{new Date().toLocaleDateString()}</div>
            <div className="text-xs text-gray-400">local time</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Donations column */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-semibold">My Donations</h2>
              <div className="text-sm text-gray-500">Recent donations and analytics</div>
            </div>

            <div className="flex w-full flex-col md:flex-row items-center gap-2">
              <div className="relative w-full">
                <label htmlFor="donationsSearch" className="sr-only">Search donations</label>
                <input
                  id="donationsSearch"
                  className="pl-9 pr-3 py-2 border rounded-md w-full md:w-72 text-sm transition-shadow duration-150 ease-in-out focus:shadow-outline focus:ring-1 focus:ring-[#04663A] motion-reduce:transition-none"
                  placeholder="Search transaction or cause..."
                  value={donationsSearch}
                  onChange={(e) => {
                    setDonationsSearch(e.target.value);
                    setDonationsPage(1);
                  }}
                  aria-label="Search donations"
                />
                <SearchIcon className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
              </div>

              <button
                onClick={() => downloadCsv()}
                className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors duration-150 ease-in-out motion-reduce:transition-none"
                aria-label="Export donations to CSV"
                type="button"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              {loading ? (
                <div className="space-y-3">
                  <div className="h-10 bg-gray-100 rounded animate-pulse" />
                  <div className="h-10 bg-gray-100 rounded animate-pulse" />
                </div>
              ) : visibleDonations.length ? (
                <ul className="space-y-3">
                  {visibleDonations.map((donation) => (
                    <li
                      key={donation.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors duration-150 ease-in-out motion-reduce:transition-none"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-md bg-green-50 flex items-center justify-center text-green-600" aria-hidden>
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Transaction</div>
                          <div className="font-medium text-gray-900 break-words">{donation.transactionId}</div>
                          <div className="text-xs text-gray-400 mt-1">{donation.cause}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-2 md:mt-0">
                        <div className="hidden md:block text-sm text-gray-500">Date</div>
                        <div className="text-sm md:text-base font-semibold">{new Date(donation.createdAt).toLocaleDateString()}</div>
                        <div className="ml-2 px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium transition-colors duration-150 ease-in-out">${Math.round(Number(donation.amount_usd || 0))}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400">No donations found.</div>
              )}

              {/* pagination controls (client or server-driven) */}
              <div className="mt-4 flex flex-col gap-2 md:flex-row items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {visibleDonations.length} donations
                  {typeof data?.donationsTotal === "number" ? ` • ${data.donationsTotal} total` : ""}
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="donationsPageSize" className="sr-only">Donations page size</label>
                  <select
                    id="donationsPageSize"
                    value={donationsPageSize}
                    onChange={(e) => {
                      setDonationsPageSize(Number(e.target.value));
                      setDonationsPage(1);
                    }}
                    className="border rounded px-2 py-1 text-sm transition-shadow duration-150 ease-in-out focus:shadow-outline motion-reduce:transition-none"
                    aria-label="Donations page size"
                  >
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={10}>10</option>
                  </select>

                  <button
                    onClick={() => setDonationsPage((p) => Math.max(1, p - 1))}
                    disabled={donationsPage <= 1}
                    className="px-3 py-1 border rounded disabled:opacity-50 transition transform duration-150 ease-in-out hover:scale-95 motion-reduce:transition-none"
                    aria-label="Previous donations page"
                    type="button"
                  >
                    Prev
                  </button>
                  <div className="px-3 py-1 border rounded text-sm transition-colors duration-150 ease-in-out">{donationsPage}</div>
                  <button
                    onClick={() => setDonationsPage((p) => p + 1)}
                    className="px-3 py-1 border rounded transition transform duration-150 ease-in-out hover:scale-95 motion-reduce:transition-none"
                    aria-label="Next donations page"
                    type="button"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Chart / legend */}
            <div className="w-full lg:w-72">
              <div className="mb-3">
                <h3 className="text-sm font-semibold">Donations by cause</h3>
                <div className="text-xs text-gray-500">Distribution of donated amounts</div>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                {/* Pie chart removed — show total summary instead */}
                <div className="text-center py-6">
                  <div className="text-2xl font-bold text-[#04663A] transition-colors duration-150 ease-in-out">${Math.round(totalDonationsAmount)}</div>
                  <div className="text-xs text-gray-500">Total donated</div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2">
                  {donationsByCause.length === 0 ? (
                    <div className="text-xs text-gray-400">No data</div>
                  ) : (
                    donationsByCause.map((c) => (
                      <div key={c.cause} className="flex items-center justify-between transition-colors duration-150 ease-in-out motion-reduce:transition-none">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: c.color }} />
                          <span className="text-sm">{c.cause}</span>
                        </div>
                        <div className="text-sm text-gray-700">${Math.round(c.amount)}</div>
                      </div>
                    ))
                  )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events & Applications */}
        <div className="space-y-6 ">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row w-full items-start gap-4 justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">My Events</h2>
                <div className="text-sm text-gray-500">Upcoming & recent</div>
              </div>

              <div className="flex w-full items-center gap-2">
                <label htmlFor="eventsSearch" className="sr-only">Search events</label>
                <input
                  id="eventsSearch"
                  value={eventsSearch}
                  onChange={(e) => {
                    setEventsSearch(e.target.value);
                    setEventsPage(1);
                  }}
                  placeholder="Search title or location..."
                  className="pl-3 pr-2 py-2 border rounded text-sm transition-shadow duration-150 ease-in-out focus:shadow-outline motion-reduce:transition-none w-72"
                  aria-label="Search events"
                />
              </div>
            </div>

            {loading ? (
              <div className="space-y-2">
                <div className="h-10 bg-gray-100 rounded animate-pulse" />
                <div className="h-10 bg-gray-100 rounded animate-pulse" />
              </div>
            ) : visibleEvents.length ? (
              <ul className="space-y-3">
                {visibleEvents.map((event) => (
                  <li key={event.id} className="flex items-start justify-between gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors duration-150 ease-in-out motion-reduce:transition-none">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center text-blue-600" aria-hidden>
                        <CalendarIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{event.Title}</div>
                        <div className="text-xs text-gray-400">{event.Location}</div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-700">{new Date(event.Date).toLocaleDateString()}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400">No events found.</div>
            )}

            <div className="mt-4 flex-col md:flex-row flex items-center gap-2 justify-between">
              <div className="text-sm text-gray-500">
                Showing {visibleEvents.length}
                {typeof data?.eventsTotal === "number" ? ` • ${data.eventsTotal} total` : ""}
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={eventsPageSize}
                  onChange={(e) => {
                    setEventsPageSize(Number(e.target.value));
                    setEventsPage(1);
                  }}
                  className="border rounded px-2 py-1 text-sm transition-shadow duration-150 ease-in-out focus:shadow-outline motion-reduce:transition-none"
                  aria-label="Events page size"
                >
                  <option value={5}>5</option>
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                </select>

                <button
                  onClick={() => setEventsPage((p) => Math.max(1, p - 1))}
                  disabled={eventsPage <= 1}
                  className="px-3 py-1 border rounded disabled:opacity-50 transition transform duration-150 ease-in-out hover:scale-95 motion-reduce:transition-none"
                  aria-label="Previous events page"
                  type="button"
                >
                  Prev
                </button>
                <div className="px-3 py-1 border rounded text-sm transition-colors duration-150 ease-in-out">{eventsPage}</div>
                <button
                  onClick={() => setEventsPage((p) => p + 1)}
                  className="px-3 py-1 border rounded transition transform duration-150 ease-in-out hover:scale-95 motion-reduce:transition-none"
                  aria-label="Next events page"
                  type="button"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Applications */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold">Volunteer Applications</h2>
              <div className="text-sm text-gray-500">Status overview</div>
            </div>

            {loading ? (
              <div className="space-y-2">
                <div className="h-10 bg-gray-100 rounded animate-pulse" />
              </div>
            ) : data?.applications?.length ? (
              <ul className="space-y-3">
                {data.applications.map((app) => (
                  <li key={app.id} className="flex items-center justify-between gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors duration-150 ease-in-out motion-reduce:transition-none">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-3">
                      <div className="w-10 h-10 rounded-md bg-purple-50 flex items-center justify-center text-purple-600" aria-hidden>
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-900">Applied {new Date(app.createdAt).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">Application ID: {app.id}</div>
                      </div>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 text-sm rounded-full font-medium ${
                          app.state?.toLowerCase() === "approved"
                            ? "bg-green-100 text-green-800"
                            : app.state?.toLowerCase() === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {app.state}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400">No volunteer applications found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}