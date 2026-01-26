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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      application_history: {
        Row: {
          action: string
          application_id: string
          created_at: string
          created_by: string | null
          from_stage_id: string | null
          id: string
          notes: string | null
          to_stage_id: string | null
        }
        Insert: {
          action: string
          application_id: string
          created_at?: string
          created_by?: string | null
          from_stage_id?: string | null
          id?: string
          notes?: string | null
          to_stage_id?: string | null
        }
        Update: {
          action?: string
          application_id?: string
          created_at?: string
          created_by?: string | null
          from_stage_id?: string | null
          id?: string
          notes?: string | null
          to_stage_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_history_from_stage_id_fkey"
            columns: ["from_stage_id"]
            isOneToOne: false
            referencedRelation: "funnel_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_history_to_stage_id_fkey"
            columns: ["to_stage_id"]
            isOneToOne: false
            referencedRelation: "funnel_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      application_tags: {
        Row: {
          application_id: string
          created_at: string
          id: string
          tag_id: string
        }
        Insert: {
          application_id: string
          created_at?: string
          id?: string
          tag_id: string
        }
        Update: {
          application_id?: string
          created_at?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_tags_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          applied_at: string
          candidate_id: string
          created_at: string
          current_stage_id: string | null
          hired_at: string | null
          id: string
          is_archived: boolean
          job_id: string
          notes: string | null
          rating: number | null
          rejected_at: string | null
          source: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          applied_at?: string
          candidate_id: string
          created_at?: string
          current_stage_id?: string | null
          hired_at?: string | null
          id?: string
          is_archived?: boolean
          job_id: string
          notes?: string | null
          rating?: number | null
          rejected_at?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          applied_at?: string
          candidate_id?: string
          created_at?: string
          current_stage_id?: string | null
          hired_at?: string | null
          id?: string
          is_archived?: boolean
          job_id?: string
          notes?: string | null
          rating?: number | null
          rejected_at?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_current_stage_id_fkey"
            columns: ["current_stage_id"]
            isOneToOne: false
            referencedRelation: "funnel_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      areas: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_archived: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_archived?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_archived?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      candidate_sources: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          is_archived: boolean
          name: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          is_archived?: boolean
          name: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          is_archived?: boolean
          name?: string
        }
        Relationships: []
      }
      candidates: {
        Row: {
          created_at: string
          email: string
          id: string
          is_archived: boolean
          is_in_talent_pool: boolean
          linkedin_url: string | null
          name: string
          notes: string | null
          phone: string | null
          portfolio_url: string | null
          resume_url: string | null
          source: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_archived?: boolean
          is_in_talent_pool?: boolean
          linkedin_url?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          portfolio_url?: string | null
          resume_url?: string | null
          source?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_archived?: boolean
          is_in_talent_pool?: boolean
          linkedin_url?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          portfolio_url?: string | null
          resume_url?: string | null
          source?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      form_fields: {
        Row: {
          created_at: string
          field_type: Database["public"]["Enums"]["form_field_type"]
          id: string
          is_required: boolean
          label: string
          options: Json | null
          order_index: number
          placeholder: string | null
          template_id: string
        }
        Insert: {
          created_at?: string
          field_type?: Database["public"]["Enums"]["form_field_type"]
          id?: string
          is_required?: boolean
          label: string
          options?: Json | null
          order_index?: number
          placeholder?: string | null
          template_id: string
        }
        Update: {
          created_at?: string
          field_type?: Database["public"]["Enums"]["form_field_type"]
          id?: string
          is_required?: boolean
          label?: string
          options?: Json | null
          order_index?: number
          placeholder?: string | null
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_fields_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "form_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      form_responses: {
        Row: {
          application_id: string
          created_at: string
          field_id: string
          file_url: string | null
          id: string
          value: string | null
        }
        Insert: {
          application_id: string
          created_at?: string
          field_id: string
          file_url?: string | null
          id?: string
          value?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string
          field_id?: string
          file_url?: string | null
          id?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_responses_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_responses_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "form_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      form_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_archived: boolean
          is_default: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_archived?: boolean
          is_default?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_archived?: boolean
          is_default?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      funnel_stages: {
        Row: {
          color: string | null
          created_at: string
          funnel_id: string
          id: string
          is_archived: boolean
          name: string
          order_index: number
        }
        Insert: {
          color?: string | null
          created_at?: string
          funnel_id: string
          id?: string
          is_archived?: boolean
          name: string
          order_index?: number
        }
        Update: {
          color?: string | null
          created_at?: string
          funnel_id?: string
          id?: string
          is_archived?: boolean
          name?: string
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "funnel_stages_funnel_id_fkey"
            columns: ["funnel_id"]
            isOneToOne: false
            referencedRelation: "funnels"
            referencedColumns: ["id"]
          },
        ]
      }
      funnels: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          job_id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          job_id: string
          name?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          job_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "funnels_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          area_id: string | null
          closed_at: string | null
          contract_type: Database["public"]["Enums"]["contract_type"]
          created_at: string
          deadline: string | null
          description: string
          form_template_id: string | null
          id: string
          investment_amount: number | null
          is_archived: boolean
          is_boosted: boolean | null
          is_remote: boolean
          level: Database["public"]["Enums"]["job_level"]
          location: string
          priority: Database["public"]["Enums"]["job_priority"]
          published_at: string | null
          requirements: string | null
          salary_max: number | null
          salary_min: number | null
          slug: string | null
          status: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at: string
        }
        Insert: {
          area_id?: string | null
          closed_at?: string | null
          contract_type?: Database["public"]["Enums"]["contract_type"]
          created_at?: string
          deadline?: string | null
          description: string
          form_template_id?: string | null
          id?: string
          investment_amount?: number | null
          is_archived?: boolean
          is_boosted?: boolean | null
          is_remote?: boolean
          level?: Database["public"]["Enums"]["job_level"]
          location?: string
          priority?: Database["public"]["Enums"]["job_priority"]
          published_at?: string | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          slug?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at?: string
        }
        Update: {
          area_id?: string | null
          closed_at?: string | null
          contract_type?: Database["public"]["Enums"]["contract_type"]
          created_at?: string
          deadline?: string | null
          description?: string
          form_template_id?: string | null
          id?: string
          investment_amount?: number | null
          is_archived?: boolean
          is_boosted?: boolean | null
          is_remote?: boolean
          level?: Database["public"]["Enums"]["job_level"]
          location?: string
          priority?: Database["public"]["Enums"]["job_priority"]
          published_at?: string | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          slug?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_page_config: {
        Row: {
          about_text: string | null
          benefits: Json | null
          company_name: string
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          primary_color: string
          social_links: Json | null
          updated_at: string
        }
        Insert: {
          about_text?: string | null
          benefits?: Json | null
          company_name?: string
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          primary_color?: string
          social_links?: Json | null
          updated_at?: string
        }
        Update: {
          about_text?: string | null
          benefits?: Json | null
          company_name?: string
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          primary_color?: string
          social_links?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      rejected_applications: {
        Row: {
          application_id: string
          can_reapply: boolean
          id: string
          observation: string | null
          reapply_after: string | null
          reason_id: string | null
          rejected_at: string
          rejected_by: string | null
        }
        Insert: {
          application_id: string
          can_reapply?: boolean
          id?: string
          observation?: string | null
          reapply_after?: string | null
          reason_id?: string | null
          rejected_at?: string
          rejected_by?: string | null
        }
        Update: {
          application_id?: string
          can_reapply?: boolean
          id?: string
          observation?: string | null
          reapply_after?: string | null
          reason_id?: string | null
          rejected_at?: string
          rejected_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rejected_applications_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rejected_applications_reason_id_fkey"
            columns: ["reason_id"]
            isOneToOne: false
            referencedRelation: "rejection_reasons"
            referencedColumns: ["id"]
          },
        ]
      }
      rejection_reasons: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_archived: boolean
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_archived?: boolean
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_archived?: boolean
          name?: string
        }
        Relationships: []
      }
      stage_evaluations: {
        Row: {
          application_id: string
          evaluated_at: string
          evaluated_by: string | null
          id: string
          notes: string | null
          rating: number | null
          stage_id: string
        }
        Insert: {
          application_id: string
          evaluated_at?: string
          evaluated_by?: string | null
          id?: string
          notes?: string | null
          rating?: number | null
          stage_id: string
        }
        Update: {
          application_id?: string
          evaluated_at?: string
          evaluated_by?: string | null
          id?: string
          notes?: string | null
          rating?: number | null
          stage_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stage_evaluations_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_evaluations_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "funnel_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          color: string
          created_at: string
          id: string
          is_archived: boolean
          name: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          is_archived?: boolean
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          is_archived?: boolean
          name?: string
        }
        Relationships: []
      }
      user_area_assignments: {
        Row: {
          area_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          area_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          area_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_area_assignments_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          user_id?: string
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
      can_manage_users: { Args: { _user_id: string }; Returns: boolean }
      get_user_areas: { Args: { _user_id: string }; Returns: string[] }
      has_area_access: {
        Args: { _area_id: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_internal_user: { Args: { _user_id: string }; Returns: boolean }
      is_user_active: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "rh" | "head" | "viewer"
      application_status: "ativa" | "contratada" | "incompativel" | "desistente"
      contract_type: "clt" | "pj" | "estagio" | "temporario" | "freelancer"
      form_field_type:
        | "short_text"
        | "long_text"
        | "multiple_choice"
        | "yes_no"
        | "file_upload"
      job_level:
        | "estagio"
        | "junior"
        | "pleno"
        | "senior"
        | "especialista"
        | "coordenador"
        | "gerente"
        | "diretor"
      job_priority: "baixa" | "media" | "alta" | "urgente"
      job_status: "rascunho" | "publicada" | "pausada" | "encerrada"
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
      app_role: ["admin", "rh", "head", "viewer"],
      application_status: ["ativa", "contratada", "incompativel", "desistente"],
      contract_type: ["clt", "pj", "estagio", "temporario", "freelancer"],
      form_field_type: [
        "short_text",
        "long_text",
        "multiple_choice",
        "yes_no",
        "file_upload",
      ],
      job_level: [
        "estagio",
        "junior",
        "pleno",
        "senior",
        "especialista",
        "coordenador",
        "gerente",
        "diretor",
      ],
      job_priority: ["baixa", "media", "alta", "urgente"],
      job_status: ["rascunho", "publicada", "pausada", "encerrada"],
    },
  },
} as const
