"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, Calendar, MapPin, Tag, Download, Eye, FileText, Clock, CheckCircle, XCircle, PlayCircle } from "lucide-react";
import Link from "next/link";
import { Project } from "@/lib/types";

interface ProjectsResponse {
  data: Project[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Get unique values for filters
  const categories = [...new Set(projects.map(p => p.Category).filter(Boolean))];
  const regions = [...new Set(projects.map(p => p.Region).filter(Boolean))];

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      let url = `/api/projects?page=${currentPage}&pageSize=12`;
      
      if (selectedCategory !== "all") {
        url += `&category=${selectedCategory}`;
      }
      
      if (selectedRegion !== "all") {
        url += `&region=${selectedRegion}`;
      }
      
      if (selectedState !== "all") {
        url += `&state=${selectedState}`;
      }

      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data: ProjectsResponse = await res.json();
      setProjects(data.data || []);
      setTotalPages(data.meta?.pagination?.pageCount || 1);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedRegion, selectedState, currentPage]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter((project) =>
    project.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.Description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.Region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.Category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxWords: number) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
  };


  const getStateColor = (state: string) => {
    switch (state) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case "upcoming":
        return <Clock className="w-4 h-4" />;
      case "ongoing":
        return <PlayCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading && projects.length === 0) {
    return (
      <div className="w-full p-4 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
        <h1 className="text-black text-3xl font-bold mb-2">Our Projects</h1>
        <p className="text-gray-600">Discover our ongoing and completed projects making a difference</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects by title, description, region, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-700 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04663A] focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04663A] focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
          
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04663A] focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All States</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? "No projects found" : "No projects available"}
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? "Try adjusting your search criteria." 
              : "Check back later for new projects."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 flex-1 mr-3">
                      <span className="line-clamp-2" title={project.Title}>
                        {truncateText(project.Title, 8)}
                      </span>
                    </h2>
                    <span className={`flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateColor(project.state)}`}>
                      {getStateIcon(project.state)}
                      <span className="ml-1 capitalize">{project.state}</span>
                    </span>
                  </div>
                  
                  {/* Project Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3" title={project.Description}>
                    {truncateText(project.Description, 20)}
                  </p>

                  {/* Project Meta */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate" title={project.Region}>
                        {truncateText(project.Region, 3)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Tag className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate" title={project.Category}>
                        {truncateText(project.Category, 3)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {formatDate(project.StartDate)} - {formatDate(project.EndDate)}
                      </span>
                    </div>
                    
                    {project.Documents && project.Documents.length > 0 && (
                      <div className="flex items-center text-sm text-gray-500">
                        <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">
                          {project.Documents.length} document{project.Documents.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link 
                      href={`/membership/projects/${project.documentId}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-[#04663A] text-white rounded-lg hover:bg-[#035530] transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                    
                    {project.Documents && project.Documents.length > 0 && (
                      <Link 
                        href={`/membership/projects/${project.documentId}#documents`}
                        className="inline-flex items-center px-4 py-2 border border-[#04663A] text-[#04663A] rounded-lg hover:bg-[#04663A] hover:text-white transition-colors text-sm font-medium"
                        title="View Documents"
                      >
                        <Download className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
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