// Database Types for ME-IN Platform
// Generated from Supabase schema

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          user_type: 'brand' | 'influencer' | null
          language: string[] | null
          timezone: string | null
          avatar_url: string | null
          bio: string | null
          website: string | null
          location: string | null
          phone: string | null
          social_links: Record<string, unknown> | null
          preferences: Record<string, unknown> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          user_type?: 'brand' | 'influencer' | null
          language?: string[] | null
          timezone?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          phone?: string | null
          social_links?: Record<string, unknown> | null
          preferences?: Record<string, unknown> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          user_type?: 'brand' | 'influencer' | null
          language?: string[] | null
          timezone?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          phone?: string | null
          social_links?: Record<string, unknown> | null
          preferences?: Record<string, unknown> | null
          created_at?: string
          updated_at?: string
        }
      }
      brand_profiles: {
        Row: {
          id: string
          company_name: string
          industry: string | null
          company_size: 'startup' | 'small' | 'medium' | 'large' | null
          target_regions: string[] | null
          target_languages: string[] | null
          budget_range: 'low' | 'medium' | 'high' | 'premium' | null
          website: string | null
          founded_year: number | null
          description: string | null
          logo_url: string | null
          verification_status: 'pending' | 'verified' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          company_name: string
          industry?: string | null
          company_size?: 'startup' | 'small' | 'medium' | 'large' | null
          target_regions?: string[] | null
          target_languages?: string[] | null
          budget_range?: 'low' | 'medium' | 'high' | 'premium' | null
          website?: string | null
          founded_year?: number | null
          description?: string | null
          logo_url?: string | null
          verification_status?: 'pending' | 'verified' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          industry?: string | null
          company_size?: 'startup' | 'small' | 'medium' | 'large' | null
          target_regions?: string[] | null
          target_languages?: string[] | null
          budget_range?: 'low' | 'medium' | 'high' | 'premium' | null
          website?: string | null
          founded_year?: number | null
          description?: string | null
          logo_url?: string | null
          verification_status?: 'pending' | 'verified' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      influencer_profiles: {
        Row: {
          id: string
          display_name: string
          content_categories: string[] | null
          platforms: Record<string, unknown> | null
          total_followers: number
          engagement_rate: number | null
          languages: string[] | null
          content_languages: string[] | null
          collaboration_history: Record<string, unknown>[] | null
          portfolio_url: string | null
          verification_status: 'pending' | 'verified' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name: string
          content_categories?: string[] | null
          platforms?: Record<string, unknown> | null
          total_followers?: number
          engagement_rate?: number | null
          languages?: string[] | null
          content_languages?: string[] | null
          collaboration_history?: Record<string, unknown>[] | null
          portfolio_url?: string | null
          verification_status?: 'pending' | 'verified' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          content_categories?: string[] | null
          platforms?: Record<string, unknown> | null
          total_followers?: number
          engagement_rate?: number | null
          languages?: string[] | null
          content_languages?: string[] | null
          collaboration_history?: Record<string, unknown>[] | null
          portfolio_url?: string | null
          verification_status?: 'pending' | 'verified' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          brand_id: string
          title: string
          title_kr: string | null
          description: string
          description_kr: string | null
          category: string
          budget_min: number
          budget_max: number
          currency: string
          target_regions: string[] | null
          target_languages: string[] | null
          requirements: Record<string, unknown> | null
          media_assets: Record<string, unknown>[] | null
          status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
          start_date: string | null
          end_date: string | null
          application_deadline: string | null
          max_applications: number | null
          current_applications: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          title: string
          title_kr?: string | null
          description: string
          description_kr?: string | null
          category: string
          budget_min: number
          budget_max: number
          currency?: string
          target_regions?: string[] | null
          target_languages?: string[] | null
          requirements?: Record<string, unknown> | null
          media_assets?: Record<string, unknown>[] | null
          status?: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
          start_date?: string | null
          end_date?: string | null
          application_deadline?: string | null
          max_applications?: number | null
          current_applications?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          title?: string
          title_kr?: string | null
          description?: string
          description_kr?: string | null
          category?: string
          budget_min?: number
          budget_max?: number
          currency?: string
          target_regions?: string[] | null
          target_languages?: string[] | null
          requirements?: Record<string, unknown> | null
          media_assets?: Record<string, unknown>[] | null
          status?: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
          start_date?: string | null
          end_date?: string | null
          application_deadline?: string | null
          max_applications?: number | null
          current_applications?: number
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          campaign_id: string
          influencer_id: string
          status: 'pending' | 'approved' | 'rejected' | 'withdrawn'
          proposal: string | null
          portfolio_links: Record<string, unknown>[] | null
          proposed_budget: number | null
          timeline_days: number | null
          message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          influencer_id: string
          status?: 'pending' | 'approved' | 'rejected' | 'withdrawn'
          proposal?: string | null
          portfolio_links?: Record<string, unknown>[] | null
          proposed_budget?: number | null
          timeline_days?: number | null
          message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          influencer_id?: string
          status?: 'pending' | 'approved' | 'rejected' | 'withdrawn'
          proposal?: string | null
          portfolio_links?: Record<string, unknown>[] | null
          proposed_budget?: number | null
          timeline_days?: number | null
          message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          campaign_id: string | null
          content: string
          message_type: 'text' | 'image' | 'file' | 'system'
          file_url: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          campaign_id?: string | null
          content: string
          message_type?: 'text' | 'image' | 'file' | 'system'
          file_url?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          campaign_id?: string | null
          content?: string
          message_type?: 'text' | 'image' | 'file' | 'system'
          file_url?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'campaign' | 'application' | 'message' | 'system'
          title: string
          message: string
          data: Record<string, unknown> | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'campaign' | 'application' | 'message' | 'system'
          title: string
          message: string
          data?: Record<string, unknown> | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'campaign' | 'application' | 'message' | 'system'
          title?: string
          message?: string
          data?: Record<string, unknown> | null
          is_read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type BrandProfile = Database['public']['Tables']['brand_profiles']['Row']
export type InfluencerProfile = Database['public']['Tables']['influencer_profiles']['Row']
export type Campaign = Database['public']['Tables']['campaigns']['Row']
export type Application = Database['public']['Tables']['applications']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']

// Extended types with relationships
export interface ProfileWithDetails extends Profile {
  brand_profile?: BrandProfile | null
  influencer_profile?: InfluencerProfile | null
}

export interface CampaignWithDetails extends Campaign {
  brand_profile?: BrandProfile | null
  applications_count?: number
}

export interface ApplicationWithDetails extends Application {
  campaign?: Campaign | null
  influencer_profile?: InfluencerProfile | null
}
