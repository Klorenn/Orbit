export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      forum_profiles: {
        Row: {
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
        Insert: {
          id?: string;
          wallet_address?: string | null;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          verified_nft?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wallet_address?: string | null;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          verified_nft?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      forum_categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          color: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          color?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          color?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      forum_posts: {
        Row: {
          id: string;
          title: string;
          content_md: string;
          content_html: string | null;
          author_id: string | null;
          category_id: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content_md: string;
          content_html?: string | null;
          author_id?: string | null;
          category_id?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content_md?: string;
          content_html?: string | null;
          author_id?: string | null;
          category_id?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      forum_comments: {
        Row: {
          id: string;
          post_id: string | null;
          author_id: string | null;
          content_md: string;
          content_html: string | null;
          parent_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id?: string | null;
          author_id?: string | null;
          content_md: string;
          content_html?: string | null;
          parent_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string | null;
          author_id?: string | null;
          content_md?: string;
          content_html?: string | null;
          parent_id?: string | null;
          created_at?: string;
        };
      };
      forum_events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          location: string | null;
          start_date: string | null;
          end_date: string | null;
          organizer_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          location?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          organizer_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          location?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          organizer_id?: string | null;
          created_at?: string;
        };
      };
      forum_proposals: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          author_id: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          author_id?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          author_id?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      forum_votes: {
        Row: {
          id: string;
          post_id: string | null;
          user_id: string | null;
          value: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id?: string | null;
          user_id?: string | null;
          value: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string | null;
          user_id?: string | null;
          value?: number;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
