export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  color: string | null;
  sort_order: number;
  created_at: string;
};

export type Profile = {
  id: string;
  wallet_address: string | null;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
  verified_nft: boolean;
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: string;
  title: string;
  content_md: string;
  content_html: string | null;
  author_id: string | null;
  category_id: string | null;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
};

export type PostWithAuthor = Post & {
  author: Pick<
    Profile,
    "id" | "display_name" | "avatar_url" | "wallet_address"
  > | null;
  category: Pick<Category, "id" | "slug" | "name" | "color"> | null;
  _count?: {
    comments: number;
    votes: number;
  };
};

export type Comment = {
  id: string;
  post_id: string | null;
  author_id: string | null;
  content_md: string;
  content_html: string | null;
  parent_id: string | null;
  created_at: string;
};

export type ThreadComment = Comment & {
  author: Pick<Profile, "id" | "display_name" | "avatar_url"> | null;
  replies?: ThreadComment[];
};

export type Event = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  organizer_id: string | null;
  created_at: string;
};

export type Proposal = {
  id: string;
  title: string;
  description: string | null;
  author_id: string | null;
  status: "draft" | "discussion" | "voting" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
};

export type Vote = {
  id: string;
  post_id: string | null;
  user_id: string | null;
  value: 1 | -1;
  created_at: string;
};
