"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Star, 
  AlertTriangle, 
  CheckCircle, 
  User,
  Calendar,
  Send
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface VolunteerRemark {
  id: number;
  documentId: string;
  title: string;
  content: string;
  type: string;
  rating?: number;
  state: string;
  priority: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  users_permissions_user?: {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    first_name?: string; // in case it's snake_case
  };
  response?: string;
  responded_by?: {
    id: number;
    username: string;
    firstName?: string;
    first_name?: string;
  };
  responded_at?: string;
}

interface RemarksResponse {
  data: VolunteerRemark[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

function SkeletonRow() {
  return (
    
    <div className="flex justify-center">
      <div className="animate-pulse flex gap-4 w-full max-w-3xl p-4 rounded-lg shadow-sm items-center">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/5" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
        <div className="w-12 text-right">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-full mt-2" />
        </div>
      </div>
    </div>
  );
}

export default function VolunteerRemarksPage() {
  const { data: session } = useSession();
  const [remarks, setRemarks] = useState<VolunteerRemark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [newRemark, setNewRemark] = useState({
    title: "",
    content: "",
    type: "experience",
    rating: 0,
    category: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRemarks = useCallback(async () => {
    try {
      setLoading(true);
      let url = `/api/volunteer/remarks?page=${currentPage}&pageSize=10`;
      
      if (selectedType !== "all") {
        url += `&type=${selectedType}`;
      }
      if (selectedStatus !== "all") {
        url += `&status=${selectedStatus}`;
      }

      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error("Failed to fetch remarks");
      }

      const data: RemarksResponse = await res.json();
      
      // Debug logging
      console.log("Raw API response:", data);
      console.log("First remark:", data.data?.[0]);
      
      setRemarks(data.data || []);
      setTotalPages(data.meta?.pagination?.pageCount || 1);
    } catch (err) {
      console.error("Error fetching remarks:", err);
      setError("Failed to load remarks. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [selectedType, selectedStatus, currentPage]);

  useEffect(() => {
    fetchRemarks();
  }, [fetchRemarks]);

  const handleSubmitRemark = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      alert("Please sign in to submit a remark");
      return;
    }

    if (!newRemark.title.trim() || !newRemark.content.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/volunteer/remarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRemark),
      });

      if (response.ok) {
        setNewRemark({
          title: "",
          content: "",
          type: "experience",
          rating: 0,
          category: ""
        });
        setShowForm(false);
        fetchRemarks();
        alert("Your remark has been submitted successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit remark");
      }
    } catch (err) {
      console.error("Error submitting remark:", err);
      alert(err instanceof Error ? err.message : "Failed to submit remark. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Simplified data extraction - no more complex object handling needed
  const getRemarkData = (remark: VolunteerRemark) => {
    return {
      id: remark.id || Math.random(),
      title: String(remark.title || "Untitled"),
      content: String(remark.content || "No content available"),
      type: String(remark.type || "unknown"),
      rating: Number(remark.rating || 0),
      status: String(remark.state || "pending"),
      priority: String(remark.priority || "medium"),
      category: String(remark.category || ""),
      createdAt: remark.createdAt || new Date().toISOString(),
      users_permissions_user: remark.users_permissions_user || null,
      response: String(remark.response || ""),
      responded_by: remark.responded_by || null,
      responded_at: remark.responded_at || null
    };
  };

  // Safe filtering with simplified data extraction
  const filteredRemarks = remarks.map(getRemarkData).filter((remark) => {
    if (!remark) return false;
    
    const title = remark.title.toLowerCase();
    const content = remark.content.toLowerCase();
    const category = remark.category.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return title.includes(searchLower) ||
           content.includes(searchLower) ||
           category.includes(searchLower);
  });

  if (loading) {
    return (
      <div className=" w-full p-6">
        <div>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 max-w-7xl mx-auto text-gray-700">
      {/* Header */}

      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h1 className="text-black text-3xl font-bold mb-2">Volunteer Remarks</h1>
            <p className="text-gray-600">Share your volunteer experience, feedback, or raise concerns</p>
          </div>
          {session && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center px-4 py-2 bg-[#04663A] text-white rounded-lg hover:bg-[#035530] transition-colors mt-4 md:mt-0"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Remark
            </button>
          )}
        </div>
      </div>

      {/* Not signed in message */}
      {!session && (
        <div className="mb-8 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
          <p>
            Please{" "}
            <Link href="/auth/signin" className="text-[#04663A] hover:underline font-medium">
              sign in
            </Link>{" "}
            to submit remarks and view the community feedback.
          </p>
        </div>
      )}

      {/* Form */}
      {showForm && session && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Submit a New Remark</h2>
          <form onSubmit={handleSubmitRemark} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={newRemark.title}
                onChange={(e) => setNewRemark({...newRemark, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
                placeholder="Brief title for your remark"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                value={newRemark.type}
                onChange={(e) => setNewRemark({...newRemark, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
              >
                <option value="experience">Experience</option>
                <option value="feedback">Feedback</option>
                <option value="complaint">Complaint</option>
                <option value="suggestion">Suggestion</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category (Optional)
              </label>
              <input
                type="text"
                value={newRemark.category}
                onChange={(e) => setNewRemark({...newRemark, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
                placeholder="e.g., Training, Communication, Resources"
              />
            </div>

            {newRemark.type === "experience" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating (Optional)
                </label>
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setNewRemark({...newRemark, rating: 1})}
                    className="focus:outline-none"
                  >
                    <Star className={`w-6 h-6 ${1 <= newRemark.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRemark({...newRemark, rating: 2})}
                    className="focus:outline-none"
                  >
                    <Star className={`w-6 h-6 ${2 <= newRemark.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRemark({...newRemark, rating: 3})}
                    className="focus:outline-none"
                  >
                    <Star className={`w-6 h-6 ${3 <= newRemark.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRemark({...newRemark, rating: 4})}
                    className="focus:outline-none"
                  >
                    <Star className={`w-6 h-6 ${4 <= newRemark.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRemark({...newRemark, rating: 5})}
                    className="focus:outline-none"
                  >
                    <Star className={`w-6 h-6 ${5 <= newRemark.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <textarea
                value={newRemark.content}
                onChange={(e) => setNewRemark({...newRemark, content: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
                placeholder="Share your detailed remark, experience, or concern..."
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 bg-[#04663A] text-white rounded-lg hover:bg-[#035530] transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Submitting..." : "Submit Remark"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filters */}
      {session && (
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search remarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04663A]"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04663A]"
            >
              <option value="all">All Types</option>
              <option value="experience">Experience</option>
              <option value="feedback">Feedback</option>
              <option value="complaint">Complaint</option>
              <option value="suggestion">Suggestion</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04663A]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Remarks List */}
      {session && (
        <div className="space-y-6">
          {filteredRemarks.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "No remarks found" : "No remarks available"}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? "Try adjusting your search criteria." : "Be the first to share your volunteer experience!"}
              </p>
            </div>
          ) : (
            filteredRemarks.map((remark) => (
              <div key={`remark-${remark.id}`} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#04663A]">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    {remark.type === "complaint" && <AlertTriangle className="w-5 h-5 text-red-500" />}
                    {remark.type === "experience" && <Star className="w-5 h-5 text-yellow-500" />}
                    {remark.type === "feedback" && <MessageSquare className="w-5 h-5 text-blue-500" />}
                    {remark.type === "suggestion" && <CheckCircle className="w-5 h-5 text-green-500" />}
                    <h3 className="text-lg font-semibold text-gray-900">{remark.title}</h3>
                  </div>
                  
                  <div className="flex gap-2">
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                      {remark.type.charAt(0).toUpperCase() + remark.type.slice(1)}
                    </span>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {remark.status.charAt(0).toUpperCase() + remark.status.slice(1)}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">{remark.content}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>
                      {remark.users_permissions_user?.firstName || 
                       remark.users_permissions_user?.first_name || 
                       remark.users_permissions_user?.username || 
                       "Unknown User"}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(remark.createdAt)}</span>
                  </div>

                  {remark.category && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {remark.category}
                    </span>
                  )}

                  {remark.type === "experience" && remark.rating > 0 && (
                    <div className="flex items-center">
                      <span className="text-xs mr-1">Rating:</span>
                      <div className="flex">
                        <Star className={`w-4 h-4 ${1 <= remark.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                        <Star className={`w-4 h-4 ${2 <= remark.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                        <Star className={`w-4 h-4 ${3 <= remark.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                        <Star className={`w-4 h-4 ${4 <= remark.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                        <Star className={`w-4 h-4 ${5 <= remark.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                      </div>
                    </div>
                  )}
                </div>

                {remark.response && remark.response.trim() !== "" && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Admin Response:
                      </span>
                      {remark.responded_at && (
                        <span className="text-xs text-gray-500">
                          {formatDate(remark.responded_at)}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{remark.response}</p>
                    {remark.responded_by && (
                      <p className="text-xs text-gray-500 mt-2">
                        - {remark.responded_by.firstName || 
                           remark.responded_by.first_name || 
                           remark.responded_by.username || 
                           "Admin"}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}

          {/* Simple Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-4 py-2 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}