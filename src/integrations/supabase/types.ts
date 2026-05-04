export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      discussion_replies: {
        Row: {
          author_id: string
          body: string
          created_at: string
          discussion_id: string
          id: string
          parent_reply_id: string | null
          updated_at: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          discussion_id: string
          id?: string
          parent_reply_id?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          discussion_id?: string
          id?: string
          parent_reply_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "discussion_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_votes: {
        Row: {
          created_at: string
          discussion_id: string | null
          reply_id: string | null
          user_id: string
          vote: Database["public"]["Enums"]["vote_type"]
        }
        Insert: {
          created_at?: string
          discussion_id?: string | null
          reply_id?: string | null
          user_id: string
          vote: Database["public"]["Enums"]["vote_type"]
        }
        Update: {
          created_at?: string
          discussion_id?: string | null
          reply_id?: string | null
          user_id?: string
          vote?: Database["public"]["Enums"]["vote_type"]
        }
        Relationships: [
          {
            foreignKeyName: "discussion_votes_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_votes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "discussion_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      discussions: {
        Row: {
          accepted_reply_id: string | null
          author_id: string
          body: string | null
          code_language: string | null
          code_snippet: string | null
          created_at: string
          id: string
          link_url: string | null
          pinned: boolean
          space_id: string
          tags: string[] | null
          title: string
          type: Database["public"]["Enums"]["discussion_type"]
          updated_at: string
          views: number
        }
        Insert: {
          accepted_reply_id?: string | null
          author_id: string
          body?: string | null
          code_language?: string | null
          code_snippet?: string | null
          created_at?: string
          id?: string
          link_url?: string | null
          pinned?: boolean
          space_id: string
          tags?: string[] | null
          title: string
          type?: Database["public"]["Enums"]["discussion_type"]
          updated_at?: string
          views?: number
        }
        Update: {
          accepted_reply_id?: string | null
          author_id?: string
          body?: string | null
          code_language?: string | null
          code_snippet?: string | null
          created_at?: string
          id?: string
          link_url?: string | null
          pinned?: boolean
          space_id?: string
          tags?: string[] | null
          title?: string
          type?: Database["public"]["Enums"]["discussion_type"]
          updated_at?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "discussions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussions_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["notification_kind"]
          link: string | null
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["notification_kind"]
          link?: string | null
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["notification_kind"]
          link?: string | null
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          apply_url: string | null
          company: string
          compensation: string | null
          contract_duration: string | null
          created_at: string
          deadline: string | null
          description: string | null
          eligibility: string[] | null
          experience: string | null
          featured: boolean
          id: string
          location: string | null
          location_type: Database["public"]["Enums"]["location_type"] | null
          logo_hue: number | null
          mentor_slots: number | null
          posted_by: string
          project_type: string | null
          session_format: string | null
          tags: string[] | null
          title: string
          type: Database["public"]["Enums"]["opportunity_type"]
          updated_at: string
        }
        Insert: {
          apply_url?: string | null
          company: string
          compensation?: string | null
          contract_duration?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          eligibility?: string[] | null
          experience?: string | null
          featured?: boolean
          id?: string
          location?: string | null
          location_type?: Database["public"]["Enums"]["location_type"] | null
          logo_hue?: number | null
          mentor_slots?: number | null
          posted_by: string
          project_type?: string | null
          session_format?: string | null
          tags?: string[] | null
          title: string
          type: Database["public"]["Enums"]["opportunity_type"]
          updated_at?: string
        }
        Update: {
          apply_url?: string | null
          company?: string
          compensation?: string | null
          contract_duration?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          eligibility?: string[] | null
          experience?: string | null
          featured?: boolean
          id?: string
          location?: string | null
          location_type?: Database["public"]["Enums"]["location_type"] | null
          logo_hue?: number | null
          mentor_slots?: number | null
          posted_by?: string
          project_type?: string | null
          session_format?: string | null
          tags?: string[] | null
          title?: string
          type?: Database["public"]["Enums"]["opportunity_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_applications: {
        Row: {
          applicant_id: string
          created_at: string
          id: string
          message: string | null
          opportunity_id: string
        }
        Insert: {
          applicant_id: string
          created_at?: string
          id?: string
          message?: string | null
          opportunity_id: string
        }
        Update: {
          applicant_id?: string
          created_at?: string
          id?: string
          message?: string | null
          opportunity_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_applications_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_hue: number | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          cover_url: string | null
          created_at: string
          flag: string | null
          full_name: string
          github_url: string | null
          handle: string
          id: string
          languages: string[] | null
          linkedin_url: string | null
          onboarding_completed: boolean
          open_to: Database["public"]["Enums"]["open_to_status"][] | null
          skills: string[] | null
          title: string | null
          twitter_url: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          avatar_hue?: number | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string
          flag?: string | null
          full_name: string
          github_url?: string | null
          handle: string
          id: string
          languages?: string[] | null
          linkedin_url?: string | null
          onboarding_completed?: boolean
          open_to?: Database["public"]["Enums"]["open_to_status"][] | null
          skills?: string[] | null
          title?: string | null
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          avatar_hue?: number | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string
          flag?: string | null
          full_name?: string
          github_url?: string | null
          handle?: string
          id?: string
          languages?: string[] | null
          linkedin_url?: string | null
          onboarding_completed?: boolean
          open_to?: Database["public"]["Enums"]["open_to_status"][] | null
          skills?: string[] | null
          title?: string | null
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      project_reactions: {
        Row: {
          created_at: string
          id: string
          kind: string
          project_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          project_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_reactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          builder_id: string
          collab_note: string | null
          cover_url: string | null
          created_at: string
          description: string
          domain: Database["public"]["Enums"]["project_domain"]
          featured: boolean
          github_url: string | null
          id: string
          lessons: string | null
          live_url: string | null
          name: string
          problem: string | null
          seeking_collab: boolean
          slug: string
          solution: string | null
          stack: string[] | null
          stage: Database["public"]["Enums"]["project_stage"]
          updated_at: string
        }
        Insert: {
          builder_id: string
          collab_note?: string | null
          cover_url?: string | null
          created_at?: string
          description: string
          domain?: Database["public"]["Enums"]["project_domain"]
          featured?: boolean
          github_url?: string | null
          id?: string
          lessons?: string | null
          live_url?: string | null
          name: string
          problem?: string | null
          seeking_collab?: boolean
          slug: string
          solution?: string | null
          stack?: string[] | null
          stage?: Database["public"]["Enums"]["project_stage"]
          updated_at?: string
        }
        Update: {
          builder_id?: string
          collab_note?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string
          domain?: Database["public"]["Enums"]["project_domain"]
          featured?: boolean
          github_url?: string | null
          id?: string
          lessons?: string | null
          live_url?: string | null
          name?: string
          problem?: string | null
          seeking_collab?: boolean
          slug?: string
          solution?: string | null
          stack?: string[] | null
          stage?: Database["public"]["Enums"]["project_stage"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_builder_id_fkey"
            columns: ["builder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_opportunities: {
        Row: {
          created_at: string
          opportunity_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          opportunity_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          opportunity_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_opportunities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      space_members: {
        Row: {
          is_moderator: boolean
          joined_at: string
          space_id: string
          user_id: string
        }
        Insert: {
          is_moderator?: boolean
          joined_at?: string
          space_id: string
          user_id: string
        }
        Update: {
          is_moderator?: boolean
          joined_at?: string
          space_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "space_members_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      spaces: {
        Row: {
          blurb: string | null
          category: Database["public"]["Enums"]["space_category"]
          coming_soon: boolean
          created_at: string
          emoji: string | null
          gradient: string
          icon: string
          id: string
          name: string
          rules: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          blurb?: string | null
          category: Database["public"]["Enums"]["space_category"]
          coming_soon?: boolean
          created_at?: string
          emoji?: string | null
          gradient?: string
          icon?: string
          id?: string
          name: string
          rules?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          blurb?: string | null
          category?: Database["public"]["Enums"]["space_category"]
          coming_soon?: boolean
          created_at?: string
          emoji?: string | null
          gradient?: string
          icon?: string
          id?: string
          name?: string
          rules?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      discussion_type:
        | "Question"
        | "Resource"
        | "Win"
        | "Debate"
        | "Announcement"
      location_type: "Remote" | "Hybrid" | "On-site"
      notification_kind:
        | "reply"
        | "collab_interest"
        | "new_opportunity"
        | "mention"
        | "system"
      open_to_status:
        | "work"
        | "freelance"
        | "collaboration"
        | "mentoring"
        | "not_available"
      opportunity_type: "Job" | "Contract" | "Grant" | "Mentorship"
      project_domain:
        | "Fintech"
        | "Agritech"
        | "Healthtech"
        | "Edtech"
        | "Govtech"
        | "Open Source"
        | "Mobile"
        | "AI/ML"
        | "Cybersecurity"
        | "Blockchain"
        | "E-commerce"
        | "Other"
      project_stage: "idea" | "in_progress" | "launched"
      space_category: "Domain" | "Stage" | "Country"
      vote_type: "up" | "down"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      discussion_type: [
        "Question",
        "Resource",
        "Win",
        "Debate",
        "Announcement",
      ],
      location_type: ["Remote", "Hybrid", "On-site"],
      notification_kind: [
        "reply",
        "collab_interest",
        "new_opportunity",
        "mention",
        "system",
      ],
      open_to_status: [
        "work",
        "freelance",
        "collaboration",
        "mentoring",
        "not_available",
      ],
      opportunity_type: ["Job", "Contract", "Grant", "Mentorship"],
      project_domain: [
        "Fintech",
        "Agritech",
        "Healthtech",
        "Edtech",
        "Govtech",
        "Open Source",
        "Mobile",
        "AI/ML",
        "Cybersecurity",
        "Blockchain",
        "E-commerce",
        "Other",
      ],
      project_stage: ["idea", "in_progress", "launched"],
      space_category: ["Domain", "Stage", "Country"],
      vote_type: ["up", "down"],
    },
  },
} as const
