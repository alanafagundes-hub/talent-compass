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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      analise_bench_forms: {
        Row: {
          ai_provider: string | null
          ai_response: string | null
          aspecto_prioritario: string | null
          client_id: string | null
          competitors: Json | null
          created_at: string
          created_by: string
          diferenciais_competitivos: string | null
          id: string
          informacoes_adicionais: string | null
          maior_desafio: string | null
          nicho_empresa: string | null
          nome_empresa: string | null
          objetivo_benchmark: string[] | null
          objetivo_benchmark_outro: string | null
          objetivo_projeto: string | null
          publico_alvo: string | null
          response_generated_at: string | null
          servicos_produtos: string | null
          site: string | null
          status: string | null
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          ai_provider?: string | null
          ai_response?: string | null
          aspecto_prioritario?: string | null
          client_id?: string | null
          competitors?: Json | null
          created_at?: string
          created_by: string
          diferenciais_competitivos?: string | null
          id?: string
          informacoes_adicionais?: string | null
          maior_desafio?: string | null
          nicho_empresa?: string | null
          nome_empresa?: string | null
          objetivo_benchmark?: string[] | null
          objetivo_benchmark_outro?: string | null
          objetivo_projeto?: string | null
          publico_alvo?: string | null
          response_generated_at?: string | null
          servicos_produtos?: string | null
          site?: string | null
          status?: string | null
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          ai_provider?: string | null
          ai_response?: string | null
          aspecto_prioritario?: string | null
          client_id?: string | null
          competitors?: Json | null
          created_at?: string
          created_by?: string
          diferenciais_competitivos?: string | null
          id?: string
          informacoes_adicionais?: string | null
          maior_desafio?: string | null
          nicho_empresa?: string | null
          nome_empresa?: string | null
          objetivo_benchmark?: string[] | null
          objetivo_benchmark_outro?: string | null
          objetivo_projeto?: string | null
          publico_alvo?: string | null
          response_generated_at?: string | null
          servicos_produtos?: string | null
          site?: string | null
          status?: string | null
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analise_bench_forms_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      application_history: {
        Row: {
          action: string
          application_id: string
          created_at: string
          from_stage_id: string | null
          id: string
          notes: string | null
          to_stage_id: string | null
        }
        Insert: {
          action: string
          application_id: string
          created_at?: string
          from_stage_id?: string | null
          id?: string
          notes?: string | null
          to_stage_id?: string | null
        }
        Update: {
          action?: string
          application_id?: string
          created_at?: string
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
          id: string
          tag_id: string
        }
        Insert: {
          application_id: string
          id?: string
          tag_id: string
        }
        Update: {
          application_id?: string
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
          id: string
          is_archived: boolean
          job_id: string
          notes: string | null
          rating: number | null
          rejected_at: string | null
          source: string | null
          status: string
          tracking_data: Json | null
          updated_at: string
        }
        Insert: {
          applied_at?: string
          candidate_id: string
          created_at?: string
          current_stage_id?: string | null
          id?: string
          is_archived?: boolean
          job_id: string
          notes?: string | null
          rating?: number | null
          rejected_at?: string | null
          source?: string | null
          status?: string
          tracking_data?: Json | null
          updated_at?: string
        }
        Update: {
          applied_at?: string
          candidate_id?: string
          created_at?: string
          current_stage_id?: string | null
          id?: string
          is_archived?: boolean
          job_id?: string
          notes?: string | null
          rating?: number | null
          rejected_at?: string | null
          source?: string | null
          status?: string
          tracking_data?: Json | null
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
      approval_client_feedback: {
        Row: {
          approval_status: string | null
          client_name: string | null
          comment: string | null
          created_at: string | null
          id: string
          job_id: string
          rating: number | null
          submitted_at: string | null
        }
        Insert: {
          approval_status?: string | null
          client_name?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          job_id: string
          rating?: number | null
          submitted_at?: string | null
        }
        Update: {
          approval_status?: string | null
          client_name?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          job_id?: string
          rating?: number | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approval_client_feedback_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "approval_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_job_history: {
        Row: {
          action_description: string
          action_type: string
          created_at: string
          created_by: string
          id: string
          job_id: string
        }
        Insert: {
          action_description: string
          action_type: string
          created_at?: string
          created_by: string
          id?: string
          job_id: string
        }
        Update: {
          action_description?: string
          action_type?: string
          created_at?: string
          created_by?: string
          id?: string
          job_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_job_history_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "approval_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_jobs: {
        Row: {
          approval_deadline: string | null
          attached_files: Json | null
          client_name: string | null
          created_at: string
          created_by: string
          description: string | null
          end_date: string | null
          id: string
          position: number
          responsible_user_id: string | null
          share_token: string | null
          start_date: string | null
          status: string
          title: string
          updated_at: string
          workflow: string | null
          workspace_id: string | null
        }
        Insert: {
          approval_deadline?: string | null
          attached_files?: Json | null
          client_name?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          end_date?: string | null
          id?: string
          position?: number
          responsible_user_id?: string | null
          share_token?: string | null
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
          workflow?: string | null
          workspace_id?: string | null
        }
        Update: {
          approval_deadline?: string | null
          attached_files?: Json | null
          client_name?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string | null
          id?: string
          position?: number
          responsible_user_id?: string | null
          share_token?: string | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
          workflow?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approval_jobs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      areas: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_archived: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          accessed_at: string
          action_type: string
          created_at: string
          id: string
          record_id: string | null
          table_name: string
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          accessed_at?: string
          action_type: string
          created_at?: string
          id?: string
          record_id?: string | null
          table_name: string
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          accessed_at?: string
          action_type?: string
          created_at?: string
          id?: string
          record_id?: string | null
          table_name?: string
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_handoff_tokens: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          ip_address: string | null
          target_module: string
          token: string
          used_at: string | null
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          target_module: string
          token: string
          used_at?: string | null
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          target_module?: string
          token?: string
          used_at?: string | null
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auth_handoff_tokens_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_config: {
        Row: {
          config_key: string
          config_value: string | null
          id: string
          updated_at: string
          updated_by: string | null
          workspace_id: string | null
        }
        Insert: {
          config_key: string
          config_value?: string | null
          id?: string
          updated_at?: string
          updated_by?: string | null
          workspace_id?: string | null
        }
        Update: {
          config_key?: string
          config_value?: string | null
          id?: string
          updated_at?: string
          updated_by?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_config_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      briefing_form_labels: {
        Row: {
          created_at: string | null
          description_text: string | null
          field_key: string
          id: string
          label_text: string | null
          section_description: string | null
          section_title: string | null
          updated_at: string | null
          updated_by: string | null
          workspace_id: string | null
        }
        Insert: {
          created_at?: string | null
          description_text?: string | null
          field_key: string
          id?: string
          label_text?: string | null
          section_description?: string | null
          section_title?: string | null
          updated_at?: string | null
          updated_by?: string | null
          workspace_id?: string | null
        }
        Update: {
          created_at?: string | null
          description_text?: string | null
          field_key?: string
          id?: string
          label_text?: string | null
          section_description?: string | null
          section_title?: string | null
          updated_at?: string | null
          updated_by?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "briefing_form_labels_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          contact_person: string | null
          created_at: string
          created_by: string
          email: string | null
          id: string
          is_protected: boolean | null
          name: string
          notes: string | null
          phone: string | null
          responsible_user_id: string | null
          source: string | null
          status: string
          updated_at: string
          value: number | null
          workspace_id: string | null
        }
        Insert: {
          contact_person?: string | null
          created_at?: string
          created_by: string
          email?: string | null
          id?: string
          is_protected?: boolean | null
          name: string
          notes?: string | null
          phone?: string | null
          responsible_user_id?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          value?: number | null
          workspace_id?: string | null
        }
        Update: {
          contact_person?: string | null
          created_at?: string
          created_by?: string
          email?: string | null
          id?: string
          is_protected?: boolean | null
          name?: string
          notes?: string | null
          phone?: string | null
          responsible_user_id?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          value?: number | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses_backup_20250829: {
        Row: {
          contact_person: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string | null
          name: string | null
          notes: string | null
          phone: string | null
          responsible_user_id: string | null
          source: string | null
          status: string | null
          updated_at: string | null
          value: number | null
        }
        Insert: {
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          responsible_user_id?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          responsible_user_id?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          value?: number | null
        }
        Relationships: []
      }
      cancellation_requests: {
        Row: {
          card_id: string | null
          cnpj: string | null
          created_at: string
          email: string
          empresa: string
          final_result: string | null
          financial_analysis: string | null
          google_meet_link: string | null
          id: string
          meeting_notes: string | null
          meetrox_link: string | null
          motivo: string
          observacoes: string | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          responsavel: string
          result_registered_at: string | null
          result_registered_by: string | null
          stage: string | null
          status: string
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          card_id?: string | null
          cnpj?: string | null
          created_at?: string
          email: string
          empresa: string
          final_result?: string | null
          financial_analysis?: string | null
          google_meet_link?: string | null
          id?: string
          meeting_notes?: string | null
          meetrox_link?: string | null
          motivo: string
          observacoes?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          responsavel: string
          result_registered_at?: string | null
          result_registered_by?: string | null
          stage?: string | null
          status?: string
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          card_id?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string
          empresa?: string
          final_result?: string | null
          financial_analysis?: string | null
          google_meet_link?: string | null
          id?: string
          meeting_notes?: string | null
          meetrox_link?: string | null
          motivo?: string
          observacoes?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          responsavel?: string
          result_registered_at?: string | null
          result_registered_by?: string | null
          stage?: string | null
          status?: string
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cancellation_requests_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_sources: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          is_archived: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          is_archived?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          is_archived?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      candidates: {
        Row: {
          availability: string | null
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
          availability?: string | null
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
          availability?: string | null
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
      celebration_templates: {
        Row: {
          audio_url: string
          created_at: string
          created_by: string
          id: string
          is_active: boolean
          title: string
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          audio_url: string
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          audio_url?: string
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "celebration_templates_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      churn_monthly_history: {
        Row: {
          created_at: string
          id: string
          month: number
          mrr_perdido_comercial: number
          mrr_perdido_operacional: number
          mrr_perdido_total: number
          n_churn_comercial: number
          n_churn_operacional: number
          n_churn_total: number
          squad: string
          updated_at: string
          workspace_id: string | null
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          month: number
          mrr_perdido_comercial?: number
          mrr_perdido_operacional?: number
          mrr_perdido_total?: number
          n_churn_comercial?: number
          n_churn_operacional?: number
          n_churn_total?: number
          squad: string
          updated_at?: string
          workspace_id?: string | null
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          month?: number
          mrr_perdido_comercial?: number
          mrr_perdido_operacional?: number
          mrr_perdido_total?: number
          n_churn_comercial?: number
          n_churn_operacional?: number
          n_churn_total?: number
          squad?: string
          updated_at?: string
          workspace_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "churn_monthly_history_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          business_id: string
          business_mrr: number | null
          business_name: string
          business_plan: string | null
          business_status: string
          commission_type: string
          commission_value: number
          created_at: string
          id: string
          month: number
          updated_at: string
          user_id: string
          workspace_id: string | null
          year: number
        }
        Insert: {
          business_id: string
          business_mrr?: number | null
          business_name: string
          business_plan?: string | null
          business_status: string
          commission_type: string
          commission_value: number
          created_at?: string
          id?: string
          month: number
          updated_at?: string
          user_id: string
          workspace_id?: string | null
          year: number
        }
        Update: {
          business_id?: string
          business_mrr?: number | null
          business_name?: string
          business_plan?: string | null
          business_status?: string
          commission_type?: string
          commission_value?: number
          created_at?: string
          id?: string
          month?: number
          updated_at?: string
          user_id?: string
          workspace_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "commissions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          acompanhamento: string
          anexo: string | null
          assinatura: string
          created_at: string
          created_by: string | null
          duracao: number
          entrada: string
          etapa: string
          id: string
          mensalidade: number
          name: string
          plano: string
          primeiro_pagamento: string
          renovacao: string
          servico: string
          squad: string
          tempo_casa: number
          updated_at: string
          valor_contrato: number
          workspace_id: string | null
        }
        Insert: {
          acompanhamento: string
          anexo?: string | null
          assinatura: string
          created_at?: string
          created_by?: string | null
          duracao: number
          entrada: string
          etapa: string
          id?: string
          mensalidade: number
          name: string
          plano: string
          primeiro_pagamento: string
          renovacao: string
          servico: string
          squad: string
          tempo_casa?: number
          updated_at?: string
          valor_contrato: number
          workspace_id?: string | null
        }
        Update: {
          acompanhamento?: string
          anexo?: string | null
          assinatura?: string
          created_at?: string
          created_by?: string | null
          duracao?: number
          entrada?: string
          etapa?: string
          id?: string
          mensalidade?: number
          name?: string
          plano?: string
          primeiro_pagamento?: string
          renovacao?: string
          servico?: string
          squad?: string
          tempo_casa?: number
          updated_at?: string
          valor_contrato?: number
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      copy_forms: {
        Row: {
          ai_provider: string | null
          ai_response: string | null
          avatar_principal: string | null
          cases_impressionantes: string | null
          copy_type: string | null
          created_at: string
          created_by: string
          diferencial_competitivo: string | null
          document_files: string[] | null
          id: string
          informacao_extra: string | null
          investimento_medio: string | null
          maior_objecao: string | null
          momento_jornada: string | null
          nicho_empresa: string | null
          nome_empresa: string | null
          nomes_empresas: string | null
          numeros_certificados: string | null
          original_briefing_id: string | null
          pergunta_qualificatoria: string | null
          principal_inimigo: string | null
          publico_alvo: string | null
          response_generated_at: string | null
          reuniao_boas_vindas: string | null
          reuniao_brainstorm: string | null
          reuniao_kick_off: string | null
          servicos_produtos: string | null
          status: string | null
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          ai_provider?: string | null
          ai_response?: string | null
          avatar_principal?: string | null
          cases_impressionantes?: string | null
          copy_type?: string | null
          created_at?: string
          created_by: string
          diferencial_competitivo?: string | null
          document_files?: string[] | null
          id?: string
          informacao_extra?: string | null
          investimento_medio?: string | null
          maior_objecao?: string | null
          momento_jornada?: string | null
          nicho_empresa?: string | null
          nome_empresa?: string | null
          nomes_empresas?: string | null
          numeros_certificados?: string | null
          original_briefing_id?: string | null
          pergunta_qualificatoria?: string | null
          principal_inimigo?: string | null
          publico_alvo?: string | null
          response_generated_at?: string | null
          reuniao_boas_vindas?: string | null
          reuniao_brainstorm?: string | null
          reuniao_kick_off?: string | null
          servicos_produtos?: string | null
          status?: string | null
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          ai_provider?: string | null
          ai_response?: string | null
          avatar_principal?: string | null
          cases_impressionantes?: string | null
          copy_type?: string | null
          created_at?: string
          created_by?: string
          diferencial_competitivo?: string | null
          document_files?: string[] | null
          id?: string
          informacao_extra?: string | null
          investimento_medio?: string | null
          maior_objecao?: string | null
          momento_jornada?: string | null
          nicho_empresa?: string | null
          nome_empresa?: string | null
          nomes_empresas?: string | null
          numeros_certificados?: string | null
          original_briefing_id?: string | null
          pergunta_qualificatoria?: string | null
          principal_inimigo?: string | null
          publico_alvo?: string | null
          response_generated_at?: string | null
          reuniao_boas_vindas?: string | null
          reuniao_brainstorm?: string | null
          reuniao_kick_off?: string | null
          servicos_produtos?: string | null
          status?: string | null
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "copy_forms_original_briefing_id_fkey"
            columns: ["original_briefing_id"]
            isOneToOne: false
            referencedRelation: "copy_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "copy_forms_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_activities: {
        Row: {
          activity_type: string
          card_id: string
          completed_date: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_pinned: boolean | null
          parent_activity_id: string | null
          scheduled_date: string | null
          status: string
          title: string | null
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          activity_type: string
          card_id: string
          completed_date?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_pinned?: boolean | null
          parent_activity_id?: string | null
          scheduled_date?: string | null
          status?: string
          title?: string | null
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          activity_type?: string
          card_id?: string
          completed_date?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_pinned?: boolean | null
          parent_activity_id?: string | null
          scheduled_date?: string | null
          status?: string
          title?: string | null
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_activities_parent_activity_id_fkey"
            columns: ["parent_activity_id"]
            isOneToOne: false
            referencedRelation: "crm_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_activity_attachments: {
        Row: {
          activity_id: string
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          updated_at: string | null
          uploaded_by: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          updated_at?: string | null
          uploaded_by: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          updated_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_activity_attachments_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "crm_activities"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_alerts: {
        Row: {
          alert_type: string
          card_id: string
          created_at: string
          created_by: string | null
          id: string
          is_read: boolean
          is_resolved: boolean
          message: string
          priority: string
          resolved_at: string | null
          resolved_by: string | null
          title: string
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          alert_type: string
          card_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_read?: boolean
          is_resolved?: boolean
          message: string
          priority?: string
          resolved_at?: string | null
          resolved_by?: string | null
          title: string
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          alert_type?: string
          card_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_read?: boolean
          is_resolved?: boolean
          message?: string
          priority?: string
          resolved_at?: string | null
          resolved_by?: string | null
          title?: string
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_alerts_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "crm_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_alerts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_card_attachments: {
        Row: {
          card_id: string
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          updated_at: string | null
          uploaded_by: string
        }
        Insert: {
          card_id: string
          created_at?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          updated_at?: string | null
          uploaded_by: string
        }
        Update: {
          card_id?: string
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          updated_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_card_attachments_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "crm_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_card_emails: {
        Row: {
          card_id: string
          created_at: string | null
          created_by: string | null
          email: string
          id: string
          is_primary: boolean | null
        }
        Insert: {
          card_id: string
          created_at?: string | null
          created_by?: string | null
          email: string
          id?: string
          is_primary?: boolean | null
        }
        Update: {
          card_id?: string
          created_at?: string | null
          created_by?: string | null
          email?: string
          id?: string
          is_primary?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_card_emails_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "crm_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_card_performance_history: {
        Row: {
          card_id: string
          created_at: string | null
          id: string
          performance_month: number
          performance_type: string
          performance_value: string
          performance_year: number
          recorded_by: string | null
          updated_at: string | null
        }
        Insert: {
          card_id: string
          created_at?: string | null
          id?: string
          performance_month: number
          performance_type: string
          performance_value: string
          performance_year: number
          recorded_by?: string | null
          updated_at?: string | null
        }
        Update: {
          card_id?: string
          created_at?: string | null
          id?: string
          performance_month?: number
          performance_type?: string
          performance_value?: string
          performance_year?: number
          recorded_by?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_card_performance_history_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "crm_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_card_stage_history: {
        Row: {
          card_id: string
          created_at: string
          entered_at: string
          event_type: string | null
          exited_at: string | null
          id: string
          moved_by: string | null
          notes: string | null
          reason: string | null
          stage_id: string
        }
        Insert: {
          card_id: string
          created_at?: string
          entered_at?: string
          event_type?: string | null
          exited_at?: string | null
          id?: string
          moved_by?: string | null
          notes?: string | null
          reason?: string | null
          stage_id: string
        }
        Update: {
          card_id?: string
          created_at?: string
          entered_at?: string
          event_type?: string | null
          exited_at?: string | null
          id?: string
          moved_by?: string | null
          notes?: string | null
          reason?: string | null
          stage_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_card_stage_history_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "crm_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_card_stage_history_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "crm_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_card_tags: {
        Row: {
          card_id: string
          created_at: string
          id: string
          tag_id: string
        }
        Insert: {
          card_id: string
          created_at?: string
          id?: string
          tag_id: string
        }
        Update: {
          card_id?: string
          created_at?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_card_tags_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "crm_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_card_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "crm_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_card_tasks: {
        Row: {
          card_id: string
          completed_at: string | null
          completed_by: string | null
          created_at: string
          deadline_date: string
          description: string | null
          id: string
          is_completed: boolean
          stage_task_id: string
          title: string
          updated_at: string
        }
        Insert: {
          card_id: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          deadline_date: string
          description?: string | null
          id?: string
          is_completed?: boolean
          stage_task_id: string
          title: string
          updated_at?: string
        }
        Update: {
          card_id?: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          deadline_date?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          stage_task_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_card_tasks_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "crm_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_card_tasks_stage_task_id_fkey"
            columns: ["stage_task_id"]
            isOneToOne: false
            referencedRelation: "crm_stage_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_card_upsell_history: {
        Row: {
          card_id: string
          created_at: string
          id: string
          installments: number | null
          notes: string | null
          payment_type: string | null
          recorded_by: string | null
          start_month: number | null
          start_year: number | null
          upsell_month: number
          upsell_type: string | null
          upsell_value: number
          upsell_year: number
        }
        Insert: {
          card_id: string
          created_at?: string
          id?: string
          installments?: number | null
          notes?: string | null
          payment_type?: string | null
          recorded_by?: string | null
          start_month?: number | null
          start_year?: number | null
          upsell_month: number
          upsell_type?: string | null
          upsell_value?: number
          upsell_year: number
        }
        Update: {
          card_id?: string
          created_at?: string
          id?: string
          installments?: number | null
          notes?: string | null
          payment_type?: string | null
          recorded_by?: string | null
          start_month?: number | null
          start_year?: number | null
          upsell_month?: number
          upsell_type?: string | null
          upsell_value?: number
          upsell_year?: number
        }
        Relationships: [
          {
            foreignKeyName: "crm_card_upsell_history_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "crm_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_card_variable_history: {
        Row: {
          card_id: string
          created_at: string
          id: string
          notes: string | null
          recorded_by: string | null
          variable_month: number
          variable_type: string
          variable_value: number
          variable_year: number
        }
        Insert: {
          card_id: string
          created_at?: string
          id?: string
          notes?: string | null
          recorded_by?: string | null
          variable_month: number
          variable_type: string
          variable_value: number
          variable_year: number
        }
        Update: {
          card_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          recorded_by?: string | null
          variable_month?: number
          variable_type?: string
          variable_value?: number
          variable_year?: number
        }
        Relationships: [
          {
            foreignKeyName: "crm_card_variable_history_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "crm_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_cards: {
        Row: {
          assigned_to: string | null
          aviso_previo: boolean
          briefing_answers: Json | null
          categoria: string | null
          cep: string | null
          churn: boolean
          churn_comercial: boolean
          cnpj: string | null
          comentarios_perda: string | null
          company_name: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          created_by: string
          criativos_estaticos: number | null
          criativos_video: number | null
          data_perda: string | null
          data_renovacao: string | null
          description: string | null
          endereco_cidade: string | null
          endereco_complemento: string | null
          endereco_estado: string | null
          endereco_numero: string | null
          endereco_rua: string | null
          existe_comissao: boolean | null
          fase_projeto: string | null
          faturamento_display: string | null
          flag: string | null
          frequencia_reuniao: string | null
          health_score: number | null
          id: string
          implementation_value: number | null
          inadimplente: boolean
          instagram: string | null
          investimento_midia: number | null
          limite_investimento: number | null
          lps: number | null
          monthly_revenue: number | null
          motivo_perda: string | null
          niche: string | null
          nivel_engajamento: string | null
          nota_nps: number | null
          pausa_contratual: boolean
          pipeline_id: string
          plano: string | null
          position: number
          possivel_churn: boolean
          qual_clareza_objetivos: number | null
          qual_investe_marketing: number | null
          qual_nicho_certo: number | null
          qual_porte_empresa: number | null
          qual_tomador_decisao: number | null
          qual_urgencia_real: number | null
          receita_gerada_cliente: number | null
          satisfacao_cliente: number | null
          servico_contratado: string | null
          squad: string | null
          stage_id: string
          tempo_contrato: string | null
          teve_roas_maior_1: string | null
          teve_roi_maior_1: string | null
          teve_vendas: string | null
          title: string
          updated_at: string
          upsell_month: number | null
          upsell_type: string | null
          upsell_value: number | null
          upsell_year: number | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          utm_url: string | null
          value: number | null
          website: string | null
          workspace_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          aviso_previo?: boolean
          briefing_answers?: Json | null
          categoria?: string | null
          cep?: string | null
          churn?: boolean
          churn_comercial?: boolean
          cnpj?: string | null
          comentarios_perda?: string | null
          company_name?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by: string
          criativos_estaticos?: number | null
          criativos_video?: number | null
          data_perda?: string | null
          data_renovacao?: string | null
          description?: string | null
          endereco_cidade?: string | null
          endereco_complemento?: string | null
          endereco_estado?: string | null
          endereco_numero?: string | null
          endereco_rua?: string | null
          existe_comissao?: boolean | null
          fase_projeto?: string | null
          faturamento_display?: string | null
          flag?: string | null
          frequencia_reuniao?: string | null
          health_score?: number | null
          id?: string
          implementation_value?: number | null
          inadimplente?: boolean
          instagram?: string | null
          investimento_midia?: number | null
          limite_investimento?: number | null
          lps?: number | null
          monthly_revenue?: number | null
          motivo_perda?: string | null
          niche?: string | null
          nivel_engajamento?: string | null
          nota_nps?: number | null
          pausa_contratual?: boolean
          pipeline_id: string
          plano?: string | null
          position?: number
          possivel_churn?: boolean
          qual_clareza_objetivos?: number | null
          qual_investe_marketing?: number | null
          qual_nicho_certo?: number | null
          qual_porte_empresa?: number | null
          qual_tomador_decisao?: number | null
          qual_urgencia_real?: number | null
          receita_gerada_cliente?: number | null
          satisfacao_cliente?: number | null
          servico_contratado?: string | null
          squad?: string | null
          stage_id: string
          tempo_contrato?: string | null
          teve_roas_maior_1?: string | null
          teve_roi_maior_1?: string | null
          teve_vendas?: string | null
          title: string
          updated_at?: string
          upsell_month?: number | null
          upsell_type?: string | null
          upsell_value?: number | null
          upsell_year?: number | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          utm_url?: string | null
          value?: number | null
          website?: string | null
          workspace_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          aviso_previo?: boolean
          briefing_answers?: Json | null
          categoria?: string | null
          cep?: string | null
          churn?: boolean
          churn_comercial?: boolean
          cnpj?: string | null
          comentarios_perda?: string | null
          company_name?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string
          criativos_estaticos?: number | null
          criativos_video?: number | null
          data_perda?: string | null
          data_renovacao?: string | null
          description?: string | null
          endereco_cidade?: string | null
          endereco_complemento?: string | null
          endereco_estado?: string | null
          endereco_numero?: string | null
          endereco_rua?: string | null
          existe_comissao?: boolean | null
          fase_projeto?: string | null
          faturamento_display?: string | null
          flag?: string | null
          frequencia_reuniao?: string | null
          health_score?: number | null
          id?: string
          implementation_value?: number | null
          inadimplente?: boolean
          instagram?: string | null
          investimento_midia?: number | null
          limite_investimento?: number | null
          lps?: number | null
          monthly_revenue?: number | null
          motivo_perda?: string | null
          niche?: string | null
          nivel_engajamento?: string | null
          nota_nps?: number | null
          pausa_contratual?: boolean
          pipeline_id?: string
          plano?: string | null
          position?: number
          possivel_churn?: boolean
          qual_clareza_objetivos?: number | null
          qual_investe_marketing?: number | null
          qual_nicho_certo?: number | null
          qual_porte_empresa?: number | null
          qual_tomador_decisao?: number | null
          qual_urgencia_real?: number | null
          receita_gerada_cliente?: number | null
          satisfacao_cliente?: number | null
          servico_contratado?: string | null
          squad?: string | null
          stage_id?: string
          tempo_contrato?: string | null
          teve_roas_maior_1?: string | null
          teve_roi_maior_1?: string | null
          teve_vendas?: string | null
          title?: string
          updated_at?: string
          upsell_month?: number | null
          upsell_type?: string | null
          upsell_value?: number | null
          upsell_year?: number | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          utm_url?: string | null
          value?: number | null
          website?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_cards_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_cards_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "crm_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_cards_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_health_score_history: {
        Row: {
          card_id: string
          created_at: string
          health_score: number
          id: string
          notes: string | null
          recorded_at: string
          recorded_by: string | null
        }
        Insert: {
          card_id: string
          created_at?: string
          health_score: number
          id?: string
          notes?: string | null
          recorded_at?: string
          recorded_by?: string | null
        }
        Update: {
          card_id?: string
          created_at?: string
          health_score?: number
          id?: string
          notes?: string | null
          recorded_at?: string
          recorded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_health_score_history_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "crm_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_loss_reasons: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          position: number
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          position?: number
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          position?: number
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_loss_reasons_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_pipelines: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          position: number
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          position?: number
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          position?: number
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_pipelines_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_special_lists: {
        Row: {
          card_title: string
          company_name: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          implementation_value: number | null
          list_type: string
          monthly_revenue: number | null
          niche: string | null
          original_card_id: string
          pipeline_id: string
          updated_at: string
          value: number | null
          workspace_id: string | null
        }
        Insert: {
          card_title: string
          company_name?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          implementation_value?: number | null
          list_type: string
          monthly_revenue?: number | null
          niche?: string | null
          original_card_id: string
          pipeline_id: string
          updated_at?: string
          value?: number | null
          workspace_id?: string | null
        }
        Update: {
          card_title?: string
          company_name?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          implementation_value?: number | null
          list_type?: string
          monthly_revenue?: number | null
          niche?: string | null
          original_card_id?: string
          pipeline_id?: string
          updated_at?: string
          value?: number | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_special_lists_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_stage_tasks: {
        Row: {
          created_at: string
          created_by: string
          deadline_days: number
          description: string | null
          id: string
          is_active: boolean
          pipeline_id: string
          position: number
          stage_id: string
          title: string
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          deadline_days?: number
          description?: string | null
          id?: string
          is_active?: boolean
          pipeline_id: string
          position?: number
          stage_id: string
          title: string
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          deadline_days?: number
          description?: string | null
          id?: string
          is_active?: boolean
          pipeline_id?: string
          position?: number
          stage_id?: string
          title?: string
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_stage_tasks_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_stage_tasks_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "crm_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_stage_tasks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_stages: {
        Row: {
          color: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          pipeline_id: string
          position: number
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          pipeline_id: string
          position?: number
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          pipeline_id?: string
          position?: number
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_stages_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_stages_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_tags: {
        Row: {
          color: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          is_system: boolean
          module_scope: string
          name: string
          position: number
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          color: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          is_system?: boolean
          module_scope?: string
          name: string
          position?: number
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          color?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          is_system?: boolean
          module_scope?: string
          name?: string
          position?: number
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_tags_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      csat_responses: {
        Row: {
          card_id: string | null
          created_at: string
          email: string | null
          empresa: string
          id: string
          nota_atendimento: number
          nota_conteudo: number
          nota_performance: number
          nota_po: number | null
          observacoes: string | null
          recomendacao: number
          responsavel: string
          squad: string | null
          telefone: string | null
          tipo_reuniao: string | null
          workspace_id: string | null
        }
        Insert: {
          card_id?: string | null
          created_at?: string
          email?: string | null
          empresa: string
          id?: string
          nota_atendimento: number
          nota_conteudo?: number
          nota_performance: number
          nota_po?: number | null
          observacoes?: string | null
          recomendacao?: number
          responsavel: string
          squad?: string | null
          telefone?: string | null
          tipo_reuniao?: string | null
          workspace_id?: string | null
        }
        Update: {
          card_id?: string | null
          created_at?: string
          email?: string | null
          empresa?: string
          id?: string
          nota_atendimento?: number
          nota_conteudo?: number
          nota_performance?: number
          nota_po?: number | null
          observacoes?: string | null
          recomendacao?: number
          responsavel?: string
          squad?: string | null
          telefone?: string | null
          tipo_reuniao?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "csat_responses_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "crm_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "csat_responses_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_roles: {
        Row: {
          base_role: Database["public"]["Enums"]["app_role"]
          created_at: string
          created_by: string
          description: string | null
          display_name: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          base_role?: Database["public"]["Enums"]["app_role"]
          created_at?: string
          created_by: string
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          base_role?: Database["public"]["Enums"]["app_role"]
          created_at?: string
          created_by?: string
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_roles_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      default_briefing_documents: {
        Row: {
          copy_type: string | null
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          is_active: boolean
          updated_at: string
          uploaded_at: string
          uploaded_by: string
          workspace_id: string | null
        }
        Insert: {
          copy_type?: string | null
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          is_active?: boolean
          updated_at?: string
          uploaded_at?: string
          uploaded_by: string
          workspace_id?: string | null
        }
        Update: {
          copy_type?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          is_active?: boolean
          updated_at?: string
          uploaded_at?: string
          uploaded_by?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "default_briefing_documents_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      default_prompts: {
        Row: {
          content: string
          copy_type: string | null
          created_at: string
          created_by: string
          id: string
          is_active: boolean
          position: number
          title: string
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          content: string
          copy_type?: string | null
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean
          position?: number
          title: string
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          content?: string
          copy_type?: string | null
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean
          position?: number
          title?: string
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "default_prompts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      "DOT CRM / Vendas": {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string | null
          id: number
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string
          created_at: string | null
          id: string
          is_archived: boolean | null
          is_default: boolean | null
          name: string
          subject: string
          type: string
          updated_at: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_default?: boolean | null
          name: string
          subject: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_default?: boolean | null
          name?: string
          subject?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      facebook_connections: {
        Row: {
          access_token: string
          ad_account_id: string | null
          app_id: string | null
          app_secret: string | null
          connected_by: string | null
          created_at: string
          facebook_user_id: string | null
          facebook_user_name: string | null
          form_ids: string[] | null
          id: string
          last_insights_sync_at: string | null
          last_lead_sync_at: string | null
          last_sync_at: string | null
          page_ids: string[] | null
          status: string
          token_expires_at: string | null
          updated_at: string
          webhook_verify_token: string | null
          workspace_id: string
        }
        Insert: {
          access_token: string
          ad_account_id?: string | null
          app_id?: string | null
          app_secret?: string | null
          connected_by?: string | null
          created_at?: string
          facebook_user_id?: string | null
          facebook_user_name?: string | null
          form_ids?: string[] | null
          id?: string
          last_insights_sync_at?: string | null
          last_lead_sync_at?: string | null
          last_sync_at?: string | null
          page_ids?: string[] | null
          status?: string
          token_expires_at?: string | null
          updated_at?: string
          webhook_verify_token?: string | null
          workspace_id: string
        }
        Update: {
          access_token?: string
          ad_account_id?: string | null
          app_id?: string | null
          app_secret?: string | null
          connected_by?: string | null
          created_at?: string
          facebook_user_id?: string | null
          facebook_user_name?: string | null
          form_ids?: string[] | null
          id?: string
          last_insights_sync_at?: string | null
          last_lead_sync_at?: string | null
          last_sync_at?: string | null
          page_ids?: string[] | null
          status?: string
          token_expires_at?: string | null
          updated_at?: string
          webhook_verify_token?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "facebook_connections_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: true
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      facebook_insights: {
        Row: {
          ad_id: string | null
          ad_name: string | null
          adset_id: string | null
          adset_name: string | null
          campaign_id: string | null
          campaign_name: string | null
          clicks: number | null
          connection_id: string
          created_at: string
          date_start: string
          date_stop: string
          id: string
          impressions: number | null
          spend: number | null
          updated_at: string
          workspace_id: string
        }
        Insert: {
          ad_id?: string | null
          ad_name?: string | null
          adset_id?: string | null
          adset_name?: string | null
          campaign_id?: string | null
          campaign_name?: string | null
          clicks?: number | null
          connection_id: string
          created_at?: string
          date_start: string
          date_stop: string
          id?: string
          impressions?: number | null
          spend?: number | null
          updated_at?: string
          workspace_id: string
        }
        Update: {
          ad_id?: string | null
          ad_name?: string | null
          adset_id?: string | null
          adset_name?: string | null
          campaign_id?: string | null
          campaign_name?: string | null
          clicks?: number | null
          connection_id?: string
          created_at?: string
          date_start?: string
          date_stop?: string
          id?: string
          impressions?: number | null
          spend?: number | null
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "facebook_insights_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "facebook_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facebook_insights_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      facebook_leads: {
        Row: {
          ad_id: string | null
          ad_name: string | null
          adset_id: string | null
          adset_name: string | null
          campaign_id: string | null
          campaign_name: string | null
          connection_id: string
          created_at: string
          created_time: string | null
          crm_card_id: string | null
          email: string | null
          field_data: Json | null
          form_id: string | null
          form_name: string | null
          id: string
          is_synced_to_crm: boolean | null
          lead_id: string
          nome: string | null
          telefone: string | null
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          workspace_id: string
        }
        Insert: {
          ad_id?: string | null
          ad_name?: string | null
          adset_id?: string | null
          adset_name?: string | null
          campaign_id?: string | null
          campaign_name?: string | null
          connection_id: string
          created_at?: string
          created_time?: string | null
          crm_card_id?: string | null
          email?: string | null
          field_data?: Json | null
          form_id?: string | null
          form_name?: string | null
          id?: string
          is_synced_to_crm?: boolean | null
          lead_id: string
          nome?: string | null
          telefone?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          workspace_id: string
        }
        Update: {
          ad_id?: string | null
          ad_name?: string | null
          adset_id?: string | null
          adset_name?: string | null
          campaign_id?: string | null
          campaign_name?: string | null
          connection_id?: string
          created_at?: string
          created_time?: string | null
          crm_card_id?: string | null
          email?: string | null
          field_data?: Json | null
          form_id?: string | null
          form_name?: string | null
          id?: string
          is_synced_to_crm?: boolean | null
          lead_id?: string
          nome?: string | null
          telefone?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "facebook_leads_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "facebook_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facebook_leads_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      form_fields: {
        Row: {
          created_at: string | null
          field_type: string
          id: string
          is_required: boolean | null
          label: string
          options: string[] | null
          order_index: number | null
          placeholder: string | null
          template_id: string
        }
        Insert: {
          created_at?: string | null
          field_type: string
          id?: string
          is_required?: boolean | null
          label: string
          options?: string[] | null
          order_index?: number | null
          placeholder?: string | null
          template_id: string
        }
        Update: {
          created_at?: string | null
          field_type?: string
          id?: string
          is_required?: boolean | null
          label?: string
          options?: string[] | null
          order_index?: number | null
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
          created_at: string | null
          description: string | null
          id: string
          is_archived: boolean | null
          is_default: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean | null
          is_default?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean | null
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
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
      incompatibility_reasons: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_archived: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          about_company: string | null
          about_job: string | null
          additional_info: string | null
          area_id: string | null
          closed_at: string | null
          contract_type: string
          created_at: string | null
          deadline: string | null
          description: string
          form_template_id: string | null
          id: string
          investment_amount: number | null
          is_archived: boolean | null
          is_boosted: boolean | null
          is_remote: boolean | null
          level: string
          location: string
          nice_to_have: string | null
          priority: string
          published_at: string | null
          requirements: string | null
          requirements_text: string | null
          responsibilities: string | null
          salary_max: number | null
          salary_min: number | null
          source_id: string | null
          status: string
          title: string
          updated_at: string | null
          work_model: string | null
        }
        Insert: {
          about_company?: string | null
          about_job?: string | null
          additional_info?: string | null
          area_id?: string | null
          closed_at?: string | null
          contract_type?: string
          created_at?: string | null
          deadline?: string | null
          description?: string
          form_template_id?: string | null
          id?: string
          investment_amount?: number | null
          is_archived?: boolean | null
          is_boosted?: boolean | null
          is_remote?: boolean | null
          level?: string
          location?: string
          nice_to_have?: string | null
          priority?: string
          published_at?: string | null
          requirements?: string | null
          requirements_text?: string | null
          responsibilities?: string | null
          salary_max?: number | null
          salary_min?: number | null
          source_id?: string | null
          status?: string
          title: string
          updated_at?: string | null
          work_model?: string | null
        }
        Update: {
          about_company?: string | null
          about_job?: string | null
          additional_info?: string | null
          area_id?: string | null
          closed_at?: string | null
          contract_type?: string
          created_at?: string | null
          deadline?: string | null
          description?: string
          form_template_id?: string | null
          id?: string
          investment_amount?: number | null
          is_archived?: boolean | null
          is_boosted?: boolean | null
          is_remote?: boolean | null
          level?: string
          location?: string
          nice_to_have?: string | null
          priority?: string
          published_at?: string | null
          requirements?: string | null
          requirements_text?: string | null
          responsibilities?: string | null
          salary_max?: number | null
          salary_min?: number | null
          source_id?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          work_model?: string | null
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
      marketing_tag_config: {
        Row: {
          created_at: string
          created_by: string
          id: string
          tag_id: string
          tag_type: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          tag_id: string
          tag_type: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          tag_id?: string
          tag_type?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_tag_config_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "crm_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_tag_config_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_weekly_comments: {
        Row: {
          comment: string
          created_at: string
          created_by: string
          id: string
          updated_at: string
          week_end: string
          week_start: string
          workspace_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          created_by: string
          id?: string
          updated_at?: string
          week_end: string
          week_start: string
          workspace_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          created_by?: string
          id?: string
          updated_at?: string
          week_end?: string
          week_start?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_weekly_comments_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          icon: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "modules_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_goals: {
        Row: {
          created_at: string
          goal_value: number
          id: string
          month: number
          updated_at: string
          workspace_id: string | null
          year: number
        }
        Insert: {
          created_at?: string
          goal_value: number
          id?: string
          month: number
          updated_at?: string
          workspace_id?: string | null
          year: number
        }
        Update: {
          created_at?: string
          goal_value?: number
          id?: string
          month?: number
          updated_at?: string
          workspace_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "monthly_goals_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      nps_responses: {
        Row: {
          card_id: string | null
          cnpj: string | null
          created_at: string
          email: string
          empresa: string
          id: string
          observacoes: string | null
          recomendacao: number
          responsavel: string
          sentimento_sem_dot: string
          squad: string | null
          workspace_id: string | null
        }
        Insert: {
          card_id?: string | null
          cnpj?: string | null
          created_at?: string
          email: string
          empresa: string
          id?: string
          observacoes?: string | null
          recomendacao: number
          responsavel: string
          sentimento_sem_dot: string
          squad?: string | null
          workspace_id?: string | null
        }
        Update: {
          card_id?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string
          empresa?: string
          id?: string
          observacoes?: string | null
          recomendacao?: number
          responsavel?: string
          sentimento_sem_dot?: string
          squad?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nps_responses_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "crm_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nps_responses_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_automations: {
        Row: {
          archive_to: string | null
          created_at: string
          created_by: string
          id: string
          is_active: boolean
          require_owner_transfer: boolean | null
          source_pipeline_id: string
          target_owner_role: string | null
          target_pipeline_id: string
          trigger_event: string
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          archive_to?: string | null
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean
          require_owner_transfer?: boolean | null
          source_pipeline_id: string
          target_owner_role?: string | null
          target_pipeline_id: string
          trigger_event: string
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          archive_to?: string | null
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean
          require_owner_transfer?: boolean | null
          source_pipeline_id?: string
          target_owner_role?: string | null
          target_pipeline_id?: string
          trigger_event?: string
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_automations_source_pipeline_id_fkey"
            columns: ["source_pipeline_id"]
            isOneToOne: false
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_automations_target_pipeline_id_fkey"
            columns: ["target_pipeline_id"]
            isOneToOne: false
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_automations_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_required_fields: {
        Row: {
          briefing_questions: Json | null
          created_at: string
          created_by: string
          id: string
          pipeline_id: string
          required_fields: Json
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          briefing_questions?: Json | null
          created_at?: string
          created_by: string
          id?: string
          pipeline_id: string
          required_fields?: Json
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          briefing_questions?: Json | null
          created_at?: string
          created_by?: string
          id?: string
          pipeline_id?: string
          required_fields?: Json
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_required_fields_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: true
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_required_fields_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          custom_role_id: string | null
          default_module: string | null
          department: string | null
          email: string
          id: string
          is_active: boolean
          last_login: string | null
          name: string
          onboarding_completed: boolean | null
          phone: string | null
          project_scope: string
          role: string
          selected_celebration_id: string | null
          updated_at: string
          user_id: string
          workspace_id: string | null
          workspace_role: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          custom_role_id?: string | null
          default_module?: string | null
          department?: string | null
          email: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          name: string
          onboarding_completed?: boolean | null
          phone?: string | null
          project_scope?: string
          role?: string
          selected_celebration_id?: string | null
          updated_at?: string
          user_id: string
          workspace_id?: string | null
          workspace_role?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          custom_role_id?: string | null
          default_module?: string | null
          department?: string | null
          email?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          name?: string
          onboarding_completed?: boolean | null
          phone?: string | null
          project_scope?: string
          role?: string
          selected_celebration_id?: string | null
          updated_at?: string
          user_id?: string
          workspace_id?: string | null
          workspace_role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_custom_role_id_fkey"
            columns: ["custom_role_id"]
            isOneToOne: false
            referencedRelation: "custom_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_selected_celebration_id_fkey"
            columns: ["selected_celebration_id"]
            isOneToOne: false
            referencedRelation: "celebration_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      projetos_reservados: {
        Row: {
          aviso_previo: boolean
          categoria: string | null
          churn: boolean
          churn_comercial: boolean
          created_at: string
          created_by: string | null
          empresa: string
          id: string
          implementacao: string
          inadimplente: boolean
          mrr: string
          pausa_contratual: boolean
          plano: string
          possivel_churn: boolean
          selected: boolean
          squad: string | null
          updated_at: string
          vaga_reservada_ate: string
          workspace_id: string | null
        }
        Insert: {
          aviso_previo?: boolean
          categoria?: string | null
          churn?: boolean
          churn_comercial?: boolean
          created_at?: string
          created_by?: string | null
          empresa: string
          id?: string
          implementacao?: string
          inadimplente?: boolean
          mrr?: string
          pausa_contratual?: boolean
          plano?: string
          possivel_churn?: boolean
          selected?: boolean
          squad?: string | null
          updated_at?: string
          vaga_reservada_ate: string
          workspace_id?: string | null
        }
        Update: {
          aviso_previo?: boolean
          categoria?: string | null
          churn?: boolean
          churn_comercial?: boolean
          created_at?: string
          created_by?: string | null
          empresa?: string
          id?: string
          implementacao?: string
          inadimplente?: boolean
          mrr?: string
          pausa_contratual?: boolean
          plano?: string
          possivel_churn?: boolean
          selected?: boolean
          squad?: string | null
          updated_at?: string
          vaga_reservada_ate?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projetos_reservados_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      recruitment_candidates: {
        Row: {
          created_at: string
          email: string
          form_responses: Json | null
          id: string
          job_id: string
          location: string
          name: string
          phone: string
          priority: string
          resume_url: string | null
          stage_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          form_responses?: Json | null
          id?: string
          job_id: string
          location: string
          name: string
          phone: string
          priority?: string
          resume_url?: string | null
          stage_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          form_responses?: Json | null
          id?: string
          job_id?: string
          location?: string
          name?: string
          phone?: string
          priority?: string
          resume_url?: string | null
          stage_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recruitment_candidates_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "recruitment_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      recruitment_form_questions: {
        Row: {
          created_at: string
          id: string
          is_required: boolean
          job_id: string
          options: Json | null
          position: number
          question_text: string
          question_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_required?: boolean
          job_id: string
          options?: Json | null
          position?: number
          question_text: string
          question_type: string
        }
        Update: {
          created_at?: string
          id?: string
          is_required?: boolean
          job_id?: string
          options?: Json | null
          position?: number
          question_text?: string
          question_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "recruitment_form_questions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "recruitment_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      recruitment_jobs: {
        Row: {
          contract_type: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          location: string
          location_type: string
          sector: string
          share_token: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          contract_type: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          location: string
          location_type: string
          sector: string
          share_token?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          contract_type?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          location?: string
          location_type?: string
          sector?: string
          share_token?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      recruitment_stages: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          position: number
        }
        Insert: {
          color: string
          created_at?: string
          id: string
          name: string
          position?: number
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          position?: number
        }
        Relationships: []
      }
      recruitment_tags: {
        Row: {
          color: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      rejected_applications: {
        Row: {
          application_id: string
          can_reapply: boolean
          created_at: string
          id: string
          observation: string | null
          reason_id: string | null
        }
        Insert: {
          application_id: string
          can_reapply?: boolean
          created_at?: string
          id?: string
          observation?: string | null
          reason_id?: string | null
        }
        Update: {
          application_id?: string
          can_reapply?: boolean
          created_at?: string
          id?: string
          observation?: string | null
          reason_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rejected_applications_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rejected_applications_reason_id_fkey"
            columns: ["reason_id"]
            isOneToOne: false
            referencedRelation: "incompatibility_reasons"
            referencedColumns: ["id"]
          },
        ]
      }
      role_module_permissions: {
        Row: {
          can_create: boolean
          can_delete: boolean
          can_edit: boolean
          can_view: boolean
          can_view_all: boolean | null
          created_at: string
          id: string
          module_id: string
          role_id: string
          workspace_id: string | null
        }
        Insert: {
          can_create?: boolean
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          can_view_all?: boolean | null
          created_at?: string
          id?: string
          module_id: string
          role_id: string
          workspace_id?: string | null
        }
        Update: {
          can_create?: boolean
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          can_view_all?: boolean | null
          created_at?: string
          id?: string
          module_id?: string
          role_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_module_permissions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_module_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "custom_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_module_permissions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      squads: {
        Row: {
          color: string
          created_at: string
          icon: string | null
          id: string
          is_active: boolean
          name: string
          position: number
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          color?: string
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          position?: number
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          color?: string
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          position?: number
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "squads_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
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
      stripe_customers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          stripe_customer_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          stripe_customer_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          stripe_customer_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stripe_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string | null
          price_id: string | null
          quantity: number | null
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string | null
          price_id?: string | null
          quantity?: number | null
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string | null
          price_id?: string | null
          quantity?: number | null
          status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      success_case_copies: {
        Row: {
          ai_provider: string | null
          ai_response: string | null
          client_name: string
          copy_type: string
          created_at: string
          created_by: string
          id: string
          input_context: string
          status: string | null
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          ai_provider?: string | null
          ai_response?: string | null
          client_name: string
          copy_type?: string
          created_at?: string
          created_by: string
          id?: string
          input_context: string
          status?: string | null
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          ai_provider?: string | null
          ai_response?: string | null
          client_name?: string
          copy_type?: string
          created_at?: string
          created_by?: string
          id?: string
          input_context?: string
          status?: string | null
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "success_case_copies_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      success_case_prompts: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          is_active: boolean
          position: number
          prompt_type: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean
          position?: number
          prompt_type?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean
          position?: number
          prompt_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      success_cases: {
        Row: {
          aprendizados: string | null
          client_id: string | null
          client_logo: string | null
          client_name: string
          como_chegou: string | null
          contexto_inicial: string | null
          cover_image: string | null
          created_at: string
          created_by: string | null
          descricao_curta: string | null
          display_order: number | null
          dot_logo_variant: string | null
          estrategia_dot: string | null
          id: string
          insights_replicaveis: string | null
          is_featured: boolean | null
          is_published: boolean | null
          metas_entrada: string | null
          metricas_badges: string[] | null
          nichos: string[] | null
          objetivos_alinhados: string | null
          owner: string | null
          periodo_analisado: string | null
          prazo_analise: string | null
          principais_dores: string | null
          resultados_atingidos: string | null
          resumo_case: string | null
          squad: string | null
          tentativas_anteriores: string | null
          titulo_destaque: string | null
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          aprendizados?: string | null
          client_id?: string | null
          client_logo?: string | null
          client_name: string
          como_chegou?: string | null
          contexto_inicial?: string | null
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          descricao_curta?: string | null
          display_order?: number | null
          dot_logo_variant?: string | null
          estrategia_dot?: string | null
          id?: string
          insights_replicaveis?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          metas_entrada?: string | null
          metricas_badges?: string[] | null
          nichos?: string[] | null
          objetivos_alinhados?: string | null
          owner?: string | null
          periodo_analisado?: string | null
          prazo_analise?: string | null
          principais_dores?: string | null
          resultados_atingidos?: string | null
          resumo_case?: string | null
          squad?: string | null
          tentativas_anteriores?: string | null
          titulo_destaque?: string | null
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          aprendizados?: string | null
          client_id?: string | null
          client_logo?: string | null
          client_name?: string
          como_chegou?: string | null
          contexto_inicial?: string | null
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          descricao_curta?: string | null
          display_order?: number | null
          dot_logo_variant?: string | null
          estrategia_dot?: string | null
          id?: string
          insights_replicaveis?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          metas_entrada?: string | null
          metricas_badges?: string[] | null
          nichos?: string[] | null
          objetivos_alinhados?: string | null
          owner?: string | null
          periodo_analisado?: string | null
          prazo_analise?: string | null
          principais_dores?: string | null
          resultados_atingidos?: string | null
          resumo_case?: string | null
          squad?: string | null
          tentativas_anteriores?: string | null
          titulo_destaque?: string | null
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "success_cases_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "success_cases_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      system_admins: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: string | null
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
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
      team_goals: {
        Row: {
          created_at: string
          goal_value: number
          id: string
          month: number
          reward_value: number
          team_type: string
          updated_at: string
          workspace_id: string | null
          year: number
        }
        Insert: {
          created_at?: string
          goal_value?: number
          id?: string
          month: number
          reward_value?: number
          team_type: string
          updated_at?: string
          workspace_id?: string | null
          year: number
        }
        Update: {
          created_at?: string
          goal_value?: number
          id?: string
          month?: number
          reward_value?: number
          team_type?: string
          updated_at?: string
          workspace_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "team_goals_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_export_permissions: {
        Row: {
          can_export: boolean
          created_at: string
          created_by: string | null
          id: string
          updated_at: string
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          can_export?: boolean
          created_at?: string
          created_by?: string | null
          id?: string
          updated_at?: string
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          can_export?: boolean
          created_at?: string
          created_by?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_export_permissions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_module_permissions: {
        Row: {
          can_create: boolean
          can_delete: boolean
          can_edit: boolean
          can_view: boolean
          can_view_all: boolean | null
          created_at: string
          id: string
          module_id: string
          updated_at: string
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          can_create?: boolean
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          can_view_all?: boolean | null
          created_at?: string
          id?: string
          module_id: string
          updated_at?: string
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          can_create?: boolean
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          can_view_all?: boolean | null
          created_at?: string
          id?: string
          module_id?: string
          updated_at?: string
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_module_permissions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_module_permissions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workspace_module_permissions: {
        Row: {
          created_at: string
          id: string
          is_enabled: boolean
          module_id: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          module_id: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          module_id?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_module_permissions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_module_permissions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          billing_email: string | null
          created_at: string | null
          crm_url: string | null
          cs_url: string | null
          favicon_url: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          max_cards: number | null
          max_users: number | null
          modules_enabled: string[] | null
          name: string
          owner_user_id: string | null
          plan_type: string | null
          primary_color: string | null
          secondary_color: string | null
          segment: string | null
          settings: Json | null
          slug: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          team_size: string | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          billing_email?: string | null
          created_at?: string | null
          crm_url?: string | null
          cs_url?: string | null
          favicon_url?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          max_cards?: number | null
          max_users?: number | null
          modules_enabled?: string[] | null
          name: string
          owner_user_id?: string | null
          plan_type?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          segment?: string | null
          settings?: Json | null
          slug: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          team_size?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_email?: string | null
          created_at?: string | null
          crm_url?: string | null
          cs_url?: string | null
          favicon_url?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          max_cards?: number | null
          max_users?: number | null
          modules_enabled?: string[] | null
          name?: string
          owner_user_id?: string | null
          plan_type?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          segment?: string | null
          settings?: Json | null
          slug?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          team_size?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_monthly_churn: {
        Args: { target_month: number; target_year: number }
        Returns: {
          mrr_perdido_comercial: number
          mrr_perdido_operacional: number
          mrr_perdido_total: number
          n_churn_comercial: number
          n_churn_operacional: number
          n_churn_total: number
          squad: string
        }[]
      }
      card_is_in_csm_pipeline: {
        Args: { _pipeline_id: string }
        Returns: boolean
      }
      cleanup_expired_handoff_tokens: { Args: never; Returns: undefined }
      create_user_profile: {
        Args: {
          user_department?: string
          user_email: string
          user_name: string
          user_phone?: string
          user_role: string
        }
        Returns: string
      }
      fix_conflicting_permission_overrides: {
        Args: never
        Returns: {
          action_taken: string
          module_name: string
          permission_type: string
          user_email: string
          user_name: string
        }[]
      }
      generate_csm_alerts: { Args: never; Returns: undefined }
      get_approval_job_public: {
        Args: { _token: string }
        Returns: {
          approval_deadline: string
          attached_files: Json
          client_name: string
          created_at: string
          description: string
          id: string
          title: string
        }[]
      }
      get_current_user_role: { Args: never; Returns: string }
      get_user_workspace_id: { Args: never; Returns: string }
      get_user_workspace_id_safe: { Args: never; Returns: string }
      get_users_by_base_role: {
        Args: { target_base_role: string }
        Returns: {
          user_id: string
          user_name: string
        }[]
      }
      get_users_by_custom_role: {
        Args: { role_id: string }
        Returns: {
          role_display_name: string
          user_id: string
          user_name: string
        }[]
      }
      get_users_by_custom_role_name: {
        Args: { role_name: string }
        Returns: {
          role_display_name: string
          role_uuid: string
          user_id: string
          user_name: string
        }[]
      }
      get_users_by_project: {
        Args: { project_name: string }
        Returns: {
          avatar_url: string | null
          created_at: string
          custom_role_id: string | null
          default_module: string | null
          department: string | null
          email: string
          id: string
          is_active: boolean
          last_login: string | null
          name: string
          onboarding_completed: boolean | null
          phone: string | null
          project_scope: string
          role: string
          selected_celebration_id: string | null
          updated_at: string
          user_id: string
          workspace_id: string | null
          workspace_role: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_users_with_module_permission: {
        Args: { module_name: string; permission_type?: string }
        Returns: {
          name: string
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_dot_admin: { Args: never; Returns: boolean }
      is_system_admin: { Args: { _user_id?: string }; Returns: boolean }
      is_workspace_admin: { Args: never; Returns: boolean }
      is_workspace_owner: { Args: never; Returns: boolean }
      log_sensitive_access: {
        Args: {
          action_type: string
          record_id: string
          table_name: string
          user_id?: string
        }
        Returns: undefined
      }
      update_monthly_churn_history: {
        Args: { target_month: number; target_year: number }
        Returns: undefined
      }
      user_can_export: { Args: { _user_id?: string }; Returns: boolean }
      user_can_view_all_crm_leads: {
        Args: { _user_id: string }
        Returns: boolean
      }
      user_has_copy_permission: {
        Args: { _permission_type: string; _user_id: string }
        Returns: boolean
      }
      user_has_csm_view_permission: {
        Args: { _user_id: string }
        Returns: boolean
      }
      user_has_module_permission: {
        Args: {
          _module_name: string
          _permission_type?: string
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "sdr" | "closer" | "manager" | "custom"
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
      app_role: ["admin", "sdr", "closer", "manager", "custom"],
    },
  },
} as const
