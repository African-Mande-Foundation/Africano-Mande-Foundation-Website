/* eslint-disable  */
"use client";

import { useState, useEffect } from "react";
import { useParams} from "next/navigation";
import { Calendar, MapPin, Tag, Download, ArrowLeft, FileText, ExternalLink, Clock, CheckCircle, XCircle, PlayCircle } from "lucide-react";
import Link from "next/link";
import { Project } from "@/lib/types";

interface ProjectResponse {
  data: Project;
}

export default function ProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${params.id}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          setError("Project not found");
        } else {
          throw new Error("Failed to fetch project");
        }
        return;
      }

      const data: ProjectResponse = await res.json();
      setProject(data.data);
    } catch (err) {
      console.error("Error fetching project:", err);
      setError("Failed to load project. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        return <Clock className="w-5 h-5" />;
      case "ongoing":
        return <PlayCircle className="w-5 h-5" />;
      case "completed":
        return <CheckCircle className="w-5 h-5" />;
      case "cancelled":
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const downloadFile = (fileUrl: string, fileName: string) => {
    const fullUrl = fileUrl.startsWith("http") ? `${fileUrl}` :`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${fileUrl}`;
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const truncateFileName = (fileName: string, maxLength: number) => {
    const namePart = fileName.substring(0, fileName.lastIndexOf('.'));
    const extensionPart = fileName.substring(fileName.lastIndexOf('.'));
    
    if (namePart.length <= maxLength) return fileName;
    
    const truncatedName = namePart.substring(0, maxLength - 3) + '...';
    return truncatedName + extensionPart;
  };

  if (loading) {
    return (
      <div className="w-full p-4 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="w-full p-4 max-w-4xl mx-auto text-gray-700">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {error || "Project not found"}
          </h3>
          <Link 
            href="/membership/projects"
            className="text-[#04663A] hover:text-[#035530] font-medium"
          >
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/membership/projects"
          className="inline-flex items-center text-[#04663A] hover:text-[#035530] font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>
      </div>

      {/* Project Details */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          {/* Project Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {project.Title}
              </h1>
              
              <div className="flex items-center mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStateColor(project.state)}`}>
                  {getStateIcon(project.state)}
                  <span className="ml-2 capitalize">{project.state}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Project Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-3 text-[#04663A]" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Region</p>
                  <p>{project.Region}</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Tag className="w-5 h-5 mr-3 text-[#04663A]" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Category</p>
                  <p>{project.Category}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3 text-[#04663A]" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Start Date</p>
                  <p>{formatDate(project.StartDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3 text-[#04663A]" />
                <div>
                  <p className="text-sm font-medium text-gray-900">End Date</p>
                  <p>{formatDate(project.EndDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Description</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>{project.Description}</p>
            </div>
          </div>

          {/* Documents Section */}
          {project.Documents && project.Documents.length > 0 && (
            <div id="documents" className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-2" />
                Project Documents ({project.Documents.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.Documents.map((document) => (
                  <div key={document.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#04663A] transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-[#04663A] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate" title={document.name}>
                            {truncateFileName(document.name, 30)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(document.size)}
                          </p>
                          {document.alternativeText && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2" title={document.alternativeText}>
                              {truncateText(document.alternativeText, 10)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4 flex-shrink-0">
                        <button
                          onClick={() => downloadFile(document.url, document.name)}
                          className="inline-flex items-center px-3 py-2 bg-[#04663A] text-white rounded-lg hover:bg-[#035530] transition-colors text-sm font-medium"
                          title="Download file"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                        
                        <a
                          href={`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${document.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 border border-[#04663A] text-[#04663A] rounded-lg hover:bg-[#04663A] hover:text-white transition-colors text-sm font-medium"
                          title="Open in new tab"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}