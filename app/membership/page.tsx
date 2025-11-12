/* eslint-disable */
"use client";
import { User } from "@/lib/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User2, ChartPie, Plus, ChevronRight} from "lucide-react";


type NewsItem = {
  id: number;
  title: string;
  publishedAt?: string;
  cover?: { url?: string; alternativeText?: string } | undefined;
  slug?: string;
};

type EventItem = {
  id: number;
  Title: string;
  Date?: string;
  Location?: string;
  cover?: { url?: string; alternativeText?: string } | undefined;
  documentId?: string | undefined;
};

function safeString(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() !== "" ? v : undefined;
}


// helper to return absolute src for Next/Image
function getImageSrc(cover?: { url?: string } | string | undefined): string | undefined {
  if (!cover) return undefined;
  const url = typeof cover === "string" ? cover : cover.url;
  if (!url) return undefined;
  // copy behavior from your article detail: prefer NEXT_PUBLIC_STRAPI_URL if relative
  return url.startsWith("http")
    ? url
    : `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${url}`;
}

// add a narrow type for donation items returned by the API
type DonationRecord = {
  amount_usd?: number | string;
  amount?: number | string;
  amount_cents?: number | string;
  cause?: string | null;
  transactionId?: string;
  createdAt?: string;
  [key: string]: unknown;
};

export default function Membership() {
  const [user, setUser] = useState<User | null>(null);
  const [donationTotal, setDonationTotal] = useState<number | null>(null);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [latestEvents, setLatestEvents] = useState<EventItem[]>([]);
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [donationsByCause, setDonationsByCause] = useState<{ cause: string; amount: number; color: string }[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);

  // recentDonations must be a hook and therefore called unconditionally


  // Fetch user details directly from /api/user (no session dependency)
  useEffect(() => {
    async function fetchUser() {
      setIsFetchingUser(true);
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();

        const firstName = safeString(data?.firstName) ?? safeString((data?.username as string)?.split?.(" ")[0]) ?? "";
        const lastName = safeString(data?.lastName) ?? safeString((data?.username as string)?.split?.(" ")[1]) ?? "";

        let userStatus = "Member";
        if (data?.role) {
          const roleName = typeof data.role === "object" ? (data.role as Record<string, unknown>).name : String(data.role);
          if (roleName === "Volunteer") userStatus = "Volunteer";
          else if (roleName === "Authenticated") userStatus = "Member";
        }

        const photoUrl =
          safeString(data?.photoUrl);

        setUser({
          id: Number(data?.id ?? 0),
          // minimal shape to satisfy runtime usage — keep optional fields on User type in lib if necessary
          firstName,
          lastName,
          username: safeString(data?.username) ?? `${firstName} ${lastName}`.trim(),
          email: safeString(data?.email) ?? "",
          photoUrl,
          blocked: false,
          confirmed: true,
          provider: String(data?.provider ?? "unknown"),
          createdAt: String(data?.createdAt ?? new Date().toISOString()),
          updatedAt: String(data?.updatedAt ?? new Date().toISOString()),
          publishedAt: String(data?.publishedAt ?? new Date().toISOString()),
          status: userStatus,
        } as unknown as User);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser({
          id: 0,
          firstName: "",
          lastName: "",
          username: "Guest",
          email: "",
          photoUrl: "",
          blocked: false,
          confirmed: true,
          provider: "unknown",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
        } as unknown as User);
      } finally {
        setIsFetchingUser(false);
      }
    }

    fetchUser();
  }, []);

  // Fetch donations and build cause chart once we have user.id
  useEffect(() => {
    async function fetchDonations() {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/activities?userId=${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch donations");
        const json = (await res.json()) as { donations?: DonationRecord[] } | undefined;
        const donationsResp: DonationRecord[] = Array.isArray(json?.donations) ? (json!.donations as DonationRecord[]) : [];
        setDonations(donationsResp);
        // helper to coerce amount to number
        const extractAmount = (d: DonationRecord) => {
          const raw = d.amount_usd ?? d.amount ?? 0;
          const rawStr = String(raw ?? "");
          const maybeNum = Number(raw);
          let value = Number(raw);
          if (!Number.isNaN(maybeNum) && rawStr.length > 3 && maybeNum > 1000) value = maybeNum / 100;
          return Math.round(value || 0);
        };

        const total = donationsResp.reduce((acc, d) => acc + extractAmount(d), 0);
        setDonationTotal(total);

        const map = new Map<string, number>();
        for (const d of donationsResp) {
          const cause = (d.cause && String(d.cause).trim()) || "Unspecified";
          map.set(cause, (map.get(cause) || 0) + extractAmount(d));
        }

        const palette = ["#7eaf58", "#8fd18b", "#04663A", "#f6c85f", "#f28c8c", "#8ecae6", "#a78bfa", "#ffb3c6", "#ffd166", "#6a994e"];
        const grouped = Array.from(map.entries())
          .map(([cause, amount], idx) => ({ cause, amount: Math.round(amount), color: palette[idx % palette.length] }))
          .sort((a, b) => b.amount - a.amount);

        setDonationsByCause(grouped);
      } catch (err) {
        console.error("Error fetching donations:", err);
        setDonationTotal(null);
        setDonationsByCause([]);
        setDonations([]);
      }
    }

    fetchDonations();
  }, [user?.id]);

  // Fetch latest news (use internal API route the same way article detail does)
  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch("/api/articles?page=1&pageSize=8");
        if (!response.ok) {
          setLatestNews([]);
          return;
        }

        const json = await response.json();
        const items = Array.isArray(json?.data) ? (json.data as unknown[]) : [];

        const normalized = items.map((it) => {
          const item = it as Record<string, unknown>;
          // read fields via indexed access to avoid `any`
          const title = safeString(item["title"]) ?? safeString(item["headline"]) ?? "Untitled";
          const slug = safeString(item["slug"]);
          const publishedAt = safeString(item["publishedAt"]) ?? safeString(item["createdAt"]);

          // cover expected as object { url, alternativeText } from your API route
          const rawCover = item["cover"] as Record<string, unknown> | undefined;
          const cover = rawCover
            ? {
                url: safeString(rawCover["url"] as unknown),
                alternativeText: safeString(rawCover["alternativeText"] as unknown),
              }
            : undefined;

          return {
            id: Number(item["id"] ?? 0),
            title,
            publishedAt,
            cover,
            slug,
          } as NewsItem;
        });

        // dedupe by slug or id and keep order, then take first 6
        const seen = new Set<string>();
        const dedup: NewsItem[] = [];
        for (const n of normalized) {
          const key = String(n.slug ?? n.id ?? "");
          if (!seen.has(key)) {
            seen.add(key);
            dedup.push(n);
          }
          if (dedup.length >= 6) break;
        }

        setLatestNews(dedup.slice(0, 6));
      } catch (err) {
        console.error("Error fetching news:", err);
        setLatestNews([]);
      }
    }
    fetchNews();
  }, []);

  // Fetch latest events (use same method as your events page — fetch("/api/events") and read data[])
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) {
          setLatestEvents([]);
          return;
        }

        const json = await res.json();
        const items = Array.isArray(json?.data) ? (json.data as unknown[]) : [];

        const normalized = items.map((it) => {
          const ev = it as Record<string, unknown>;
          const attrs = ev["attributes"] as Record<string, unknown> | undefined;

          const title = safeString(ev["Title"]) ?? safeString(ev["title"]) ?? safeString(ev["name"]) ?? "Untitled";
          const date = safeString(ev["Date"]) ?? safeString(ev["date"]) ?? safeString(ev["publishedAt"]);
          const location = safeString(ev["Location"]) ?? safeString(ev["location"]);

          // Cover may come as `Cover` or `cover` object with a `url` property (match your events route shape)
          const rawCover = (ev["Cover"] as Record<string, unknown> | undefined) ?? (ev["cover"] as Record<string, unknown> | undefined);
          const cover = rawCover
            ? {
                url: safeString(rawCover["url"] as unknown),
                alternativeText: safeString(rawCover["alternativeText"] as unknown),
              }
            : undefined;
          const documentId = safeString(ev["documentId"]) ?? safeString(ev["document_id"]) ?? safeString(ev["document"]) ?? safeString(attrs?.["documentId"]) ?? safeString(attrs?.["document_id"]);

          return {
            id: Number(ev["id"] ?? 0),
            Title: title,
            Date: date,
            Location: location,
            cover,
            documentId,
          } as EventItem;
        });

        // dedupe by Title or id and take up to 6 (3 per column in UI)
        const seen = new Set<string>();
        const dedup: EventItem[] = [];
        for (const e of normalized) {
          const key = String(e.Title ?? e.id ?? "");
          if (!seen.has(key)) {
            seen.add(key);
            dedup.push(e);
          }
          if (dedup.length >= 6) break;
        }

        setLatestEvents(dedup.slice(0, 6));
      } catch (err) {
        console.error("Error fetching events:", err);
        setLatestEvents([]);
      }
    }
    fetchEvents();
  }, []);

  if (isFetchingUser) {
    return (
      <div className="w-full h-screen p-6">
        <div className="max-w-7xl mx-auto animate-pulse space-y-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-gray-200 w-20 h-20" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="h-48 bg-gray-200 rounded mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>

            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
              <div className="space-y-3">
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Donations chart component (donut + horizontal bars)
  function DonationsChart({ data, total }: { data: { cause: string; amount: number; color: string }[]; total: number }) {
    const radius = 44;
    const circumference = 2 * Math.PI * radius;
    let cumulative = 0;
    const totalSafe = Math.max(1, total);

    return (
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90" aria-hidden>
          <g transform="translate(60,60)">
            {data.length > 0 ? (
              data.map((it) => {
                const portion = it.amount / totalSafe;
                const dash = portion * circumference;
                const dashArray = `${dash} ${circumference - dash}`;
                const offset = -cumulative * circumference;
                cumulative += portion;
                return (
                  <circle
                    key={it.cause}
                    r={radius}
                    cx={0}
                    cy={0}
                    fill="transparent"
                    stroke={it.color}
                    strokeWidth={16}
                    strokeDasharray={dashArray}
                    strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset 600ms ease, stroke-dasharray 600ms ease" }}
                  />
                );
              })
            ) : (
              <circle r={radius} cx={0} cy={0} fill="transparent" stroke="#e5e7eb" strokeWidth={16} />
            )}
            <circle r={radius + 18} cx={0} cy={0} fill="transparent" stroke="transparent" />
          </g>
        </svg>

        <div className="flex-1 w-full">
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold text-[#04663A]">${total == 0 ? 0 : Math.round(totalSafe)}</div>
            <div className="text-xs text-gray-900">Total donated</div>
          </div>

          <div className="mt-3 space-y-2">
            {data.slice(0, 6).map((c) => {
              const percent = Math.round((c.amount / totalSafe) * 100);
              return (
                <div key={c.cause} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: c.color }} />
                    <div className="min-w-0">
                      <div className="text-sm text-gray-700 truncate">{c.cause}</div>
                      <div className="text-xs text-gray-900">{percent}%</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-900">${Math.round(c.amount)}</div>
                </div>
              );
            })}

            {/* Legend for remaining causes */}
            {data.length > 6 && (
              <Link href="membership/activities">
              
              <div className="text-xs text-gray-500">+{data.length - 6} more causes</div>

              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Compact Donations summary card used when space is limited

  return (
    <div className="w-full h-full overflow-y-auto px-3 md:px-6 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow p-6 border border-[#04663A] transition-all duration-200 ease-out motion-reduce:transition-none md:flex md:items-center justify-between lg:flex-col lg:justify-center lg:items-center lg:gap-6">
            <div className="flex flex-col md:flex-row lg:flex-col items-center justify-center  gap-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {user?.photoUrl ? (
                  <Image src={user.photoUrl} alt="Profile" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <User2 className="w-8 h-8" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-900">{user?.firstName} {user?.lastName}</h2>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#04663A] text-white">{user?.status}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">{user?.email || "-"}</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
              <a href="/membership/donate" className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-green-600 text-white text-sm hover:bg-green-700 transition-colors duration-150 ease-in-out motion-reduce:transition-none">
                <Plus className="w-4 h-4" /> Donate
              </a>

              <a href="/membership/activities" className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-[#04663A] text-sm text-[#04663A] hover:shadow-sm transition-shadow duration-150 ease-in-out motion-reduce:transition-none">
                <ChevronRight className="w-4 h-4" /> See activities
              </a>
            </div>
          </div>
          


          
          

        {/* Main column: donations big card */}
        <div className=" space-y-6">
          <div className="bg-white rounded-xl shadow p-6 border transition-transform duration-150 ease-out hover:-translate-y-1 motion-reduce:transition-none">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Donations</h2>
                <p className="text-sm text-gray-500">Overview of your giving</p>
              </div>
              <div className="text-sm text-gray-600">Total: <span className="font-semibold text-green-700">${donationTotal ?? 0}</span></div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* large visual for causes (keeps pie for members page) */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md">
                  {/* Donations chart + bars */}
                  <div className="rounded-md border border-gray-100 p-4 bg-gradient-to-b from-white to-gray-50">
                    <DonationsChart data={donationsByCause} total={donationTotal ?? 0} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          
        </div>

        <div className="bg-white rounded-xl shadow p-4 border">
            <h3 className="text-lg text-gray-900 font-semibold mb-3">Latest News</h3>

            {/* Two-column layout: left = compact list (3 items), right = cards (3 items) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Col 1 - stacked list: 3 items, bigger thumbnail */}
              <div className="space-y-3">
                {latestNews.length === 0 ? (
                  <div className="text-sm text-gray-400">No news found.</div>
                ) : (
                  latestNews.slice(0, 3).map((n) => {
                    const href = n.slug ? `/membership/news/${encodeURIComponent(n.slug)}` : `/membership/news/${n.id}`;
                    const imgSrc = getImageSrc(n.cover);
                    return (
                      <a
                        key={n.slug ?? n.id}
                        href={href}
                        className="flex items-start gap-4 p-2 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        {imgSrc ? (
                          <div className="relative w-20  rounded-md overflow-hidden flex items-center justify-center bg-gray-100">
                            <Image src={imgSrc} alt={n.title} width={112} height={80} className="object-cover w-full h-14" />
                        </div>
                        ) : (
                          <div className="w-20 h-14 rounded-sm flex-shrink-0 bg-gray-100 flex items-center justify-center text-gray-400">
                            <ChartPie className="w-6 h-6" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-800 truncate">{n.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{n.publishedAt ? new Date(n.publishedAt).toLocaleDateString() : ""}</div>
                        </div>
                      </a>
                    );
                  })
                )}
              </div>

              <div className="space-y-3">
                {latestNews.length <= 3 ? null : latestNews.slice(3, 6).map((n) => {
                  const href = n.slug ? `/membership/news/${encodeURIComponent(n.slug)}` : `/membership/news/${n.id}`;
                  const imgSrc = getImageSrc(n.cover);
                  return (
                    <li key={n.slug ?? n.id} className="p-3 border rounded-md hover:shadow-sm transition-shadow duration-150">
                      <div className="flex items-start gap-4">
                      {imgSrc ? (
                        <div className="relative w-20  rounded-md overflow-hidden flex items-center justify-center bg-gray-100">
                          <a href={href}>
                            <Image src={imgSrc} alt={n.title} width={112} height={80} className="object-cover w-full h-14" />
                          </a>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gray-100" />
                      )}
                      <div className="flex-1 min-w-0">
                        <a href={href} className="text-sm font-semibold text-gray-800 block truncate hover:underline">{n.title}</a>
                        <div className="text-xs text-gray-500 mt-1">{n.publishedAt ? new Date(n.publishedAt).toLocaleDateString() : ""}</div>
                      </div>
                      </div>
                    </li>
                  );
                })}
              </div>
            </div>
          </div>

          
        <div className="bg-white rounded-xl shadow p-4 border">
            <h3 className="text-lg text-gray-900 font-semibold mb-3">Latest Events</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {latestEvents.length === 0 ? (
                <li className="text-sm text-gray-400">No events found.</li>
              ) : latestEvents.map((ev) => {
                const title = ev.Title;
                const date = ev.Date ?? "";
                const imgSrc = getImageSrc(ev.cover);
                // larger thumbnail, image fills container
                return (
                  <li key={ev.id} className="p-3 rounded-md hover:shadow-sm transition-shadow duration-150">
                    <Link href={`/membership/events/`} className="flex items-start gap-4">
                      <div className="relative w-20 h-14 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                        {imgSrc ? (
                          <Image src={imgSrc} alt={ev.cover?.alternativeText ?? title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-100" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{title}</div>
                        <div className="text-xs text-gray-500">{ev.Location ?? ""}</div>
                        <div className="text-xs text-gray-600 mt-1">{date ? new Date(String(date)).toLocaleDateString() : ""}</div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
      </div>
    </div>
  );
}