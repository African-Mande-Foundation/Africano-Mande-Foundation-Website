// app/membership/news/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Calendar, User, Tag, ArrowLeft, MessageCircle, Send, Reply, Heart, ThumbsDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Article, Comment } from "@/lib/types";

interface ArticleResponse {
  data: Article;
}

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (params.slug) {
      fetchArticle();
    }
  }, [params.slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/articles/${params.slug}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          setError("Article not found");
        } else {
          throw new Error("Failed to fetch article");
        }
        return;
      }

      const data: ArticleResponse = await res.json();
      setArticle(data.data);
    } catch (err) {
      console.error("Error fetching article:", err);
      setError("Failed to load article. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent, parentId?: number) => {
    e.preventDefault();
    
    if (!session) {
      setError("Please sign in to comment.");
      return;
    }

    const content = parentId ? replyContent : commentContent;
    if (!content.trim()) return;

    try {
      setSubmittingComment(true);
      const res = await fetch(`/api/articles/${params.slug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          parentId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "Failed to post comment");
        return;
      }

      // Reset form and refresh article to get updated comments
      if (parentId) {
        setReplyContent("");
        setReplyingTo(null);
      } else {
        setCommentContent("");
      }
      
      fetchArticle(); // Refresh to get updated comments
    } catch (err) {
      console.error("Error posting comment:", err);
      setError("Failed to post comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, '').trim();
  };

  if (loading) {
    return (
      <div className="w-full p-4 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="w-full p-4 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {error || "Article not found"}
          </h3>
          <Link 
            href="/membership/news"
            className="text-[#04663A] hover:text-[#035530] font-medium"
          >
            ← Back to News
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
          href="/membership/news"
          className="inline-flex items-center text-[#04663A] hover:text-[#035530] font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News
        </Link>
      </div>

      {/* Article Header */}
      <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        {/* Cover Image */}
        {article.cover?.url && (
          <div className="relative h-64 md:h-96 bg-gray-200">
            <Image
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${article.cover.url}`}
              alt={article.cover.alternativeText || article.title}
              fill
              className="object-cover"
            />
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#04663A] text-white">
                {article.category.name}
              </span>
            </div>
          </div>
        )}

        <div className="p-6 md:p-8">
          {/* Article Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>By {article.author.name}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              <span>{article.category.name}</span>
            </div>

            <div className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              <span>{article.comments?.length || 0} Comments</span>
            </div>
          </div>

          {/* Article Excerpt */}
          {article.excerpt && (
            <div className="text-lg text-gray-700 mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-[#04663A]">
              {stripHtml(article.excerpt)}
            </div>
          )}

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.description }}
          />
        </div>
      </article>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <MessageCircle className="w-6 h-6 mr-2" />
          Comments ({article.comments?.length || 0})
        </h2>

        {/* Comment Form */}
        {session ? (
          <form onSubmit={(e) => handleCommentSubmit(e)} className="mb-8">
            <div className="mb-4">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04663A] focus:border-transparent resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={!commentContent.trim() || submittingComment}
              className="inline-flex items-center px-6 py-3 bg-[#04663A] text-white rounded-lg hover:bg-[#035530] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 mr-2" />
              {submittingComment ? "Posting..." : "Post Comment"}
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600">
              Please{" "}
              <Link href="/auth/signin" className="text-[#04663A] hover:text-[#035530] font-medium">
                sign in
              </Link>{" "}
              to leave a comment.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {article.comments && article.comments.length > 0 ? (
            article.comments.map((comment) => (
              <div key={comment.id} className="border border-gray-200 rounded-lg p-6">
                {/* Comment Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#04663A] rounded-full flex items-center justify-center text-white font-medium">
                      {comment.user?.firstName?.[0] || comment.user?.username?.[0] || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {comment.user?.firstName && comment.user?.lastName 
                          ? `${comment.user.firstName} ${comment.user.lastName}`
                          : comment.user?.username || 'Anonymous'
                        }
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comment Content */}
                <div className="mb-4">
                  <p className="text-gray-800">{comment.Content}</p>
                </div>

                {/* Comment Actions */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-sm text-[#04663A] hover:text-[#035530] font-medium flex items-center"
                  >
                    <Reply className="w-4 h-4 mr-1" />
                    Reply
                  </button>
                </div>

                {/* Reply Form */}
                {replyingTo === comment.id && session && (
                  <form onSubmit={(e) => handleCommentSubmit(e, comment.id)} className="mt-4 ml-8">
                    <div className="mb-4">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04663A] focus:border-transparent resize-none"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        disabled={!replyContent.trim() || submittingComment}
                        className="px-4 py-2 bg-[#04663A] text-white rounded-lg hover:bg-[#035530] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {submittingComment ? "Posting..." : "Post Reply"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyContent("");
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-6 ml-8 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="border-l-2 border-gray-200 pl-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {reply.user?.firstName?.[0] || reply.user?.username?.[0] || '?'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {reply.user?.firstName && reply.user?.lastName 
                                ? `${reply.user.firstName} ${reply.user.lastName}`
                                : reply.user?.username || 'Anonymous'
                              }
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(reply.createdAt)}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-800 text-sm">{reply.Content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}