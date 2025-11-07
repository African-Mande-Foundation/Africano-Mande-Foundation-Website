/* eslint-disable  */
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Calendar, User, ArrowLeft, Clock, MessageSquare, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

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

interface Article {
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

interface Comment {
  id: number;
  documentId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    username: string;
    email: string;
  };
}

interface ApiResponse {
  data: Article;
}

interface CommentsResponse {
  data: Comment[];
}

export default function ArticleDetail() {
  const params = useParams();
  const { data: session } = useSession();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/articles/${params.slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Article not found");
          } else {
            throw new Error("Failed to fetch article");
          }
          return;
        }

        const data: ApiResponse = await response.json();
        setArticle(data.data);
        
        if (data.data) {
          fetchComments();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchArticle();
    }
  }, [params.slug]);

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await fetch(`/api/articles/${params.slug}/comments`);
      
      if (response.ok) {
        const data: CommentsResponse = await response.json();
        setComments(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      alert("Please sign in to comment");
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    try {
      setIsSubmittingComment(true);
      const response = await fetch(`/api/articles/${params.slug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      });

      if (response.ok) {
        setNewComment("");
        fetchComments(); // Refresh comments
      } else {
        throw new Error("Failed to post comment");
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };


  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const getImageUrl = (cover?: CoverImage) => {
    if (!cover?.url) return "/images/placeholder-news.jpg";
    return cover.url.startsWith("http")
      ? cover.url
      : `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${cover.url}`;
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    // Add safety check for undefined/null content
    if (!content || typeof content !== 'string') {
      return 1; // Return minimum 1 minute for empty content
    }
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E6FFF4] from-60% to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-300 rounded-lg mb-8"></div>
            <div className="h-12 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E6FFF4] from-60% to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {error === "Article not found" ? "Article Not Found" : "Error Loading Article"}
            </h1>
            <p className="text-gray-600 mb-4">
              {error === "Article not found"
                ? "The article you're looking for doesn't exist or has been removed."
                : error}
            </p>
            <Link
              href="/membership/news"
              className="bg-[#04663A] text-white px-4 py-2 rounded-lg hover:bg-[#035530] transition-colors inline-block"
            >
              Back to News
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6FFF4] from-60% to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/membership/news"
            className="inline-flex items-center text-[#04663A] hover:text-[#035530] font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to News
          </Link>
        </div>

        {/* Article Header */}
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Cover Image */}
          {article.cover && (
            <div className="relative h-64 md:h-96">
              <Image
                src={getImageUrl(article.cover)}
                alt={article.cover.alternativeText || article.title}
                fill
                className="object-cover"
                priority
              />
              {article.category && (
                <div className="absolute top-6 left-6">
                  <span className="bg-[#04663A] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {article.category.name}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* Article Meta */}
            <div className="flex items-center justify-between mb-6">
              <Link 
                href="/membership/news"
                className="inline-flex items-center text-[#04663A] hover:text-[#035530] font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                News
              </Link>
            </div>

            {/* Title and Description */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {article.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 pb-6 border-b border-gray-200">
                {article.author && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>By {article.author.name}</span>
                  </div>
                )}

                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>

                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{calculateReadTime(article.content || "")} min read</span>
                </div>

                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  <span>{comments.length} comment{comments.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </header>

            {/* Article Content */}
            <div className="max-w-none mb-12">
              <div 
                className="text-gray-700 leading-relaxed prose-content whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: article.content || "No content available." }}
              />
            </div>

            {/* Comments Section */}
            <section className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Comments ({comments.length})
              </h3>

              {/* Comment Form */}
              {session ? (
                <form onSubmit={handleCommentSubmit} className="mb-8">
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-[#04663A] rounded-full flex items-center justify-center text-white font-medium">
                        {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent resize-none"
                        disabled={isSubmittingComment}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          type="submit"
                          disabled={!newComment.trim() || isSubmittingComment}
                          className="flex items-center px-4 py-2 bg-[#04663A] text-white rounded-lg hover:bg-[#035530] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {isSubmittingComment ? "Posting..." : "Post Comment"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600">
                    Please{" "}
                    <Link href="/auth/signin" className="text-[#04663A] hover:underline">
                      sign in
                    </Link>{" "}
                    to leave a comment.
                  </p>
                </div>
              )}

              {/* Comments List */}
              {commentsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex space-x-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-medium">
                          {comment.author.username.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-800">
                            {comment.author.username}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatRelativeTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}