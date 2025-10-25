export interface User {
  id: number;
  documentId: string;
  username: string;
  firstName: string;
  lastName: string;
  status: "member" | "volunteer";
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  photoUrl: string;

}

export interface ParentComment {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Content: string;
}

export interface Project {
  id: number;
  documentId: string;
  Title: string;
  Description: string;
  Region: string;
  Category: string;
  StartDate: string;
  EndDate: string;
  Documents?: {
    id: number;
    url: string;
    name: string;
    alternativeText?: string;
    size: number;
    mime: string;
  }[];
  state: "upcoming" | "ongoing" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Comment {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Content: string;
  replies: Comment[];
  user: User;
  parent: ParentComment | null;
  repliesCount: number;
  likesCount: number;
  dislikesCount: number;
  currentUserReaction: "like" | "dislike" | null;
}

export interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

export interface Cover {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: {
    thumbnail: ImageFormat;
    large: ImageFormat;
    medium: ImageFormat;
    small: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Author {
  id: number;
  documentId: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  avatar: Cover;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  description: string;
  cover: Cover;
}

type CKEditorHTML = string;

export interface ArticleData {
  id: number;
  documentId: string;
  title: string;
  description: CKEditorHTML;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  excerpt: string | null;
  type: string | null;
  comments: Comment[];
  cover: Cover;
  author: Author;
  category: Category;
}

export interface Meta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface ApiResponse {
  data: ArticleData;
  meta: Meta;
}

export type Article = ArticleData;
export type RecentComment = Comment;

export interface PaymentPayload {
  reference: string;
  amount: number;
  currency: string;
  email: string;
}

export interface DonationData {
  transactionId: string;
  amount_usd: number;
  cause: string;
}

export interface RegisteredDonationData extends DonationData {
  users_permissions_user: string | number;
}

export interface NonRegisteredDonationData extends DonationData {
  fullName: string;
  email: string;
}
