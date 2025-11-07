/* eslint-disable  */
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Calendar, MapPin, Users, Search, Filter, CheckCircle } from "lucide-react";
import Image from "next/image";

interface Event {
  id: number;
  documentId: string;
  Title: string;
  Description: string;
  Cover: {
    url: string;
    alternativeText?: string;
  } | null;
  Date: string;
  Location: string | null;
  seats: number;
  seats_remaining: number;
  state: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface EventsResponse {
  data: Event[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface RegistrationStatus {
  [eventId: number]: {
    isRegistered: boolean;
    isLoading: boolean;
  };
}

export default function Events() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("all");
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0 && session) {
      checkRegistrationStatus();
    }
  }, [events, session]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/events");
      
      if (!res.ok) {
        throw new Error("Failed to fetch events");
      }

      const data: EventsResponse = await res.json();
      setEvents(data.data);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = async () => {
    const statusPromises = events.map(async (event) => {
      try {
        const res = await fetch(`/api/events/${event.documentId}/status`);
        if (res.ok) {
          const data = await res.json();
          return {
            eventId: event.id,
            isRegistered: data.isRegistered,
            isLoading: false
          };
        }
      } catch (error) {
        console.error(`Error checking status for event ${event.id}:`, error);
      }
      return {
        eventId: event.id,
        isRegistered: false,
        isLoading: false
      };
    });

    const statuses = await Promise.all(statusPromises);
    const statusMap: RegistrationStatus = {};
    statuses.forEach(status => {
      statusMap[status.eventId] = {
        isRegistered: status.isRegistered,
        isLoading: status.isLoading
      };
    });
    setRegistrationStatus(statusMap);
  };

  const handleRegistration = async (event: Event) => {
    if (!session) {
      setError("Please sign in to register for events.");
      return;
    }

    // Set loading state for this specific event
    setRegistrationStatus(prev => ({
      ...prev,
      [event.id]: { ...prev[event.id], isLoading: true }
    }));

    setError("");
    setMessage("");

    try {
      const res = await fetch(`/api/events/${event.documentId}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to register for event");
        return;
      }

      // Update local state
      setMessage(data.message);
      
      // Update the event's seats remaining
      setEvents(prevEvents => 
        prevEvents.map(e => 
          e.id === event.id 
            ? { ...e, seats_remaining: data.seats_remaining }
            : e
        )
      );

      // Update registration status
      setRegistrationStatus(prev => ({
        ...prev,
        [event.id]: { isRegistered: true, isLoading: false }
      }));

    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      // Remove loading state
      setRegistrationStatus(prev => ({
        ...prev,
        [event.id]: { ...prev[event.id], isLoading: false }
      }));
    }
  };

  // Function to strip HTML tags and decode HTML entities
  const stripHtml = (html: string) => {
    if (!html) return "";
    
    // Remove HTML tags
    const withoutTags = html.replace(/<[^>]*>/g, '');
    
    // Decode common HTML entities
    const decoded = withoutTags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    
    return decoded.trim();
  };

  const filteredEvents = events.filter((event) => {
    const cleanDescription = stripHtml(event.Description);
    const matchesSearch = event.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.Location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cleanDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    const eventState = event.state || "upcoming"; // Default to "upcoming" if null
    const matchesFilter = filterState === "all" || eventState === filterState;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventStateColor = (state: string | null) => {
    // Handle null or undefined state
    const eventState = state?.toLowerCase() || "upcoming";
    
    switch (eventState) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800"; // Default to upcoming style
    }
  };

  if (loading) {
    return (
      <div className="w-full p-4 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-black text-3xl font-bold mb-2">Events</h1>
        <p className="text-gray-600">Discover and join our upcoming events</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search events by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04663A] focus:border-transparent appearance-none bg-white min-w-[150px]"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Success Message */}
      {message && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || filterState !== "all" ? "No events found" : "No events available"}
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterState !== "all" 
              ? "Try adjusting your search or filter criteria." 
              : "Check back later for upcoming events."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            // Get safe values with defaults
            const eventState = event.state || "upcoming";
            const seatsTotal = event.seats || 0;
            const seatsRemaining = event.seats_remaining || 0;
            const cleanDescription = stripHtml(event.Description);
            const eventStatus = registrationStatus[event.id];
            const isRegistered = eventStatus?.isRegistered || false;
            const isRegistrationLoading = eventStatus?.isLoading || false;
            
            return (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                {/* Event Cover Image */}
                <div className="relative h-48 bg-gray-200">
                  {event.Cover?.url ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${event.Cover.url}`}
                      alt={event.Cover.alternativeText || event.Title || "Event"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#04663A] to-[#035530]">
                      <Calendar className="w-16 h-16 text-white" />
                    </div>
                  )}
                  
                  {/* Event State Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventStateColor(event.state)}`}>
                      {eventState.charAt(0).toUpperCase() + eventState.slice(1)}
                    </span>
                  </div>

                  {/* Registration Status Badge */}
                  {isRegistered && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Registered
                      </span>
                    </div>
                  )}
                </div>

                {/* Event Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {event.Title || "Untitled Event"}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {cleanDescription || "No description available"}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(event.Date)} at {formatTime(event.Date)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="truncate">{event.Location || "Location TBD"}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-2" />
                      <span>
                        {seatsRemaining} of {seatsTotal} seats remaining
                      </span>
                    </div>
                  </div>

                  {/* Seats Progress Bar */}
                  {seatsTotal > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Availability</span>
                        <span>{Math.round((seatsRemaining / seatsTotal) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#04663A] h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(seatsRemaining / seatsTotal) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-6">
                    {isRegistered ? (
                      <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg cursor-default flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Registered
                      </button>
                    ) : eventState === "upcoming" && seatsRemaining > 0 ? (
                      <button 
                        onClick={() => handleRegistration(event)}
                        disabled={isRegistrationLoading}
                        className="w-full bg-[#04663A] text-white py-2 px-4 rounded-lg hover:bg-[#035530] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isRegistrationLoading ? "Registering..." : "Register Now"}
                      </button>
                    ) : eventState === "ongoing" ? (
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                        Event In Progress
                      </button>
                    ) : seatsRemaining === 0 ? (
                      <button className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed" disabled>
                        Fully Booked
                      </button>
                    ) : (
                      <button className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed" disabled>
                        {eventState === "completed" ? "Event Ended" : "Unavailable"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}