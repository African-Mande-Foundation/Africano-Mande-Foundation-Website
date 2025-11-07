"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, Calendar, User, Tag, ArrowRight, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
}

interface Author {
  id: number;
  documentId: string;
  name: string;
  email?: string;
}

interface CoverImage {
  id: number;
  documentId: string;
  name: string;
  url: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
}

interface VolunteerUpdate {
  id: number;
  documentId: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  cover?: CoverImage;
  author?: Author;
  category?: Category;
}

interface ApiResponse {
  data: VolunteerUpdate[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface CategoriesResponse {
  data: Category[];
}

export default function VolunteerUpdatesPage() {
  const [updates, setUpdates] = useState<VolunteerUpdate[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data: CategoriesResponse = await res.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  const fetchUpdates = useCallback(async () => {
    try {
      setLoading(true);
      let url = `/api/volunteer/updates?page=${currentPage}&pageSize=12`;
      
      if (selectedCategory !== "all") {
        url += `&category=${selectedCategory}`;
      }

      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error("Failed to fetch volunteer updates");
      }

      const data: ApiResponse = await res.json();
      setUpdates(data.data || []);
      setTotalPages(data.meta?.pagination?.pageCount || 1);
    } catch (err) {
      console.error("Error fetching updates:", err);
      setError("Failed to load updates. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, currentPage]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  const filteredUpdates = updates.filter((update) =>
    update.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    update.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    update.author?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text || text.length <= maxLength) return text || "";
    return text.substr(0, maxLength) + "...";
  };

  if (loading && updates.length === 0) {
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
    <div className="w-full p-4 max-w-7xl mx-auto text-gray-700">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-black text-3xl font-bold mb-2">Volunteer Updates</h1>
        <p className="text-gray-600">Stay updated with the latest volunteer news and updates</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search updates by title, content, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04663A] focus:border-transparent appearance-none bg-white min-w-[200px]"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Updates Grid */}
      {filteredUpdates.length === 0 ? (
        <div className="text-center py-12">
          <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? "No updates found" : "No updates available"}
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? "Try adjusting your search criteria." 
              : "Check back later for new updates."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredUpdates.map((update) => (
              <article key={update.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                {/* Update Cover Image */}
                <div className="relative h-48 bg-gray-200">
                  {update.cover?.url ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${update.cover.url}`}
                      alt={update.cover.alternativeText || update.title || "Update"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#04663A] to-[#035530]">
                      <Eye className="w-16 h-16 text-white" />
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#04663A] text-white">
                      {update.category?.name || "news!"}
                    </span>
                  </div>
                </div>

                {/* Update Content */}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    <Link href={`/volunteer/updates/${update.slug}`} className="hover:text-[#04663A] transition-colors">
                      {update.title || "Untitled"}
                    </Link>
                  </h2>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {update.description 
                      ? stripHtml(update.description) 
                      : truncateText(stripHtml(update.content || ""), 150)
                    }
                  </p>

                  {/* Update Meta */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-2" />
                      <span>By {update.author?.name || "Author 1"}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(update.publishedAt)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Tag className="w-4 h-4 mr-2" />
                      <span>{update.category?.name || "news!"}</span>
                    </div>
                  </div>

                  {/* Read More Link */}
                  <Link 
                    href={`/volunteer/updates/${update.slug}`}
                    className="inline-flex items-center text-[#04663A] hover:text-[#035530] font-medium text-sm transition-colors group"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-[#04663A] text-white border-[#04663A]"
                        : "border-gray-300 text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}