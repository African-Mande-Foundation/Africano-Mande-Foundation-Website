"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

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

export default function Donations() {
  const [data, setData] = useState<ActivitiesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await fetch(`/api/activities?userId=${userId}`);
      const json = await res.json();
      setData(json);
      setLoading(false);
    }
    if (userId) {
      fetchData();
    }
  }, [userId]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Activities</h1>
      <div className="grid grid-cols-1 gap-8">
        {/* My Donations */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">My Donations</h2>
          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : data?.donations.length ? (
            <ul className="space-y-4">
              {data.donations.map((donation) => (
                <li key={donation.id} className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-2">
                  <div className="flex flex-col md:flex-row md:gap-8">
                    <div>
                      <span className="block text-gray-500 text-sm">Transaction ID</span>
                      <span className="font-medium text-gray-900">{donation.transactionId}</span>
                    </div>
                    <div className="hidden md:block">
                      <span className="block text-gray-500 text-sm">Amount (USD)</span>
                      <span className="font-medium text-gray-900">${donation.amount_usd}</span>
                    </div>
                    <div className="hidden md:block">
                      <span className="block text-gray-500 text-sm">Cause</span>
                      <span className="font-medium text-gray-900">{donation.cause}</span>
                    </div>
                    <div className="hidden md:block">
                      <span className="block text-gray-500 text-sm">Date</span>
                      <span className="font-medium text-gray-900">{new Date(donation.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {/* Mobile: Only show amount and transactionId */}
                  <div className="md:hidden mt-2 flex gap-4">
                    <span className="text-gray-700 font-semibold">${donation.amount_usd}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400">No donations found.</div>
          )}
        </div>

        {/* My Events */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">My Events</h2>
          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : data?.events.length ? (
            <ul className="space-y-4">
              {data.events.map((event) => (
                <li key={event.id} className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-2">
                  <div>
                    <span className="block text-gray-500 text-sm">Title</span>
                    <span className="font-medium text-gray-900">{event.Title}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-sm">Location</span>
                    <span className="font-medium text-gray-900">{event.Location}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-sm">Date</span>
                    <span className="font-medium text-gray-900">{new Date(event.Date).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400">No events found.</div>
          )}
        </div>

        {/* My Volunteer Applications */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">My Volunteer Applications</h2>
          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : data?.applications.length ? (
            <ul className="space-y-4">
              {data.applications.map((app) => (
                <li key={app.id} className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-2">
                  <div>
                    <span className="block text-gray-500 text-sm">Date Applied</span>
                    <span className="font-medium text-gray-900">{new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-sm">State</span>
                    <span className="font-medium text-gray-900">{app.state}</span>
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
  );
}