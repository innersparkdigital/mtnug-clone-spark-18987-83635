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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      account_deletion_requests: {
        Row: {
          comments: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          reason: string | null
          status: string
        }
        Insert: {
          comments?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          reason?: string | null
          status?: string
        }
        Update: {
          comments?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          reason?: string | null
          status?: string
        }
        Relationships: []
      }
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      admin_clients: {
        Row: {
          address: string | null
          company_name: string
          contact_person: string | null
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          company_name: string
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          company_name?: string
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      admin_page_permissions: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          page_key: string
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          page_key: string
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          page_key?: string
          user_id?: string
        }
        Relationships: []
      }
      assessment_emails: {
        Row: {
          consent_given: boolean
          created_at: string
          device_type: string | null
          email: string
          id: string
          score: number | null
          session_id: string
          severity_level: string | null
          source: string | null
          test_type: string
        }
        Insert: {
          consent_given?: boolean
          created_at?: string
          device_type?: string | null
          email: string
          id?: string
          score?: number | null
          session_id: string
          severity_level?: string | null
          source?: string | null
          test_type: string
        }
        Update: {
          consent_given?: boolean
          created_at?: string
          device_type?: string | null
          email?: string
          id?: string
          score?: number | null
          session_id?: string
          severity_level?: string | null
          source?: string | null
          test_type?: string
        }
        Relationships: []
      }
      assessment_sessions: {
        Row: {
          abandoned_at: string | null
          completed_at: string | null
          created_at: string
          device_type: string | null
          id: string
          last_question_reached: number | null
          max_score: number | null
          referrer: string | null
          score: number | null
          session_id: string
          severity_level: string | null
          source: string | null
          started_at: string
          test_type: string
          total_questions: number
          user_agent: string | null
        }
        Insert: {
          abandoned_at?: string | null
          completed_at?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          last_question_reached?: number | null
          max_score?: number | null
          referrer?: string | null
          score?: number | null
          session_id: string
          severity_level?: string | null
          source?: string | null
          started_at?: string
          test_type: string
          total_questions: number
          user_agent?: string | null
        }
        Update: {
          abandoned_at?: string | null
          completed_at?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          last_question_reached?: number | null
          max_score?: number | null
          referrer?: string | null
          score?: number | null
          session_id?: string
          severity_level?: string | null
          source?: string | null
          started_at?: string
          test_type?: string
          total_questions?: number
          user_agent?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          category: string | null
          content: string
          created_at: string
          created_by: string | null
          excerpt: string | null
          hero_image_url: string | null
          id: string
          published_at: string | null
          read_time: string | null
          scheduled_for: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          hero_image_url?: string | null
          id?: string
          published_at?: string | null
          read_time?: string | null
          scheduled_for?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          hero_image_url?: string | null
          id?: string
          published_at?: string | null
          read_time?: string | null
          scheduled_for?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      callback_requests: {
        Row: {
          created_at: string
          device_type: string | null
          full_name: string
          id: string
          phone_number: string
          session_id: string | null
          source: string | null
          status: string | null
          wellbeing_percentage: number
          wellbeing_score: number
        }
        Insert: {
          created_at?: string
          device_type?: string | null
          full_name: string
          id?: string
          phone_number: string
          session_id?: string | null
          source?: string | null
          status?: string | null
          wellbeing_percentage: number
          wellbeing_score: number
        }
        Update: {
          created_at?: string
          device_type?: string | null
          full_name?: string
          id?: string
          phone_number?: string
          session_id?: string | null
          source?: string | null
          status?: string | null
          wellbeing_percentage?: number
          wellbeing_score?: number
        }
        Relationships: []
      }
      campaign_faq_events: {
        Row: {
          company_id: string | null
          created_at: string
          event_type: string
          id: string
          item_index: number | null
          language: string | null
          session_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          item_index?: number | null
          language?: string | null
          session_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          item_index?: number | null
          language?: string | null
          session_id?: string
        }
        Relationships: []
      }
      career_applications: {
        Row: {
          country: string
          cover_letter: string
          created_at: string
          email: string
          experience_years: number
          full_name: string
          id: string
          linkedin_url: string | null
          phone: string
          position: string
          resume_url: string | null
          specialization: string | null
        }
        Insert: {
          country?: string
          cover_letter: string
          created_at?: string
          email: string
          experience_years: number
          full_name: string
          id?: string
          linkedin_url?: string | null
          phone: string
          position: string
          resume_url?: string | null
          specialization?: string | null
        }
        Update: {
          country?: string
          cover_letter?: string
          created_at?: string
          email?: string
          experience_years?: number
          full_name?: string
          id?: string
          linkedin_url?: string | null
          phone?: string
          position?: string
          resume_url?: string | null
          specialization?: string | null
        }
        Relationships: []
      }
      chat_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          session_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_leads: {
        Row: {
          anonymous_id: string | null
          created_at: string
          email: string | null
          handled_at: string | null
          handled_by: string | null
          id: string
          intent: string | null
          message: string | null
          name: string | null
          notes: string | null
          phone: string | null
          session_id: string | null
          source_path: string | null
          status: string
          updated_at: string
        }
        Insert: {
          anonymous_id?: string | null
          created_at?: string
          email?: string | null
          handled_at?: string | null
          handled_by?: string | null
          id?: string
          intent?: string | null
          message?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          session_id?: string | null
          source_path?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          anonymous_id?: string | null
          created_at?: string
          email?: string | null
          handled_at?: string | null
          handled_by?: string | null
          id?: string
          intent?: string | null
          message?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          session_id?: string | null
          source_path?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_leads_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          flagged: boolean
          id: string
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          flagged?: boolean
          id?: string
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          flagged?: boolean
          id?: string
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          anonymous_id: string
          created_at: string
          escalated: boolean
          high_risk_triggered: boolean
          id: string
          message_count: number
          review_notes: string | null
          review_status: string
          reviewed_at: string | null
          reviewed_by: string | null
          source_path: string | null
          summary: string | null
          summary_updated_at: string | null
          tags: string[] | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          anonymous_id: string
          created_at?: string
          escalated?: boolean
          high_risk_triggered?: boolean
          id?: string
          message_count?: number
          review_notes?: string | null
          review_status?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_path?: string | null
          summary?: string | null
          summary_updated_at?: string | null
          tags?: string[] | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          anonymous_id?: string
          created_at?: string
          escalated?: boolean
          high_risk_triggered?: boolean
          id?: string
          message_count?: number
          review_notes?: string | null
          review_status?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_path?: string | null
          summary?: string | null
          summary_updated_at?: string | null
          tags?: string[] | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      commission_claim_items: {
        Row: {
          amount: number
          claim_id: string
          created_at: string
          id: string
          referral_id: string
        }
        Insert: {
          amount: number
          claim_id: string
          created_at?: string
          id?: string
          referral_id: string
        }
        Update: {
          amount?: number
          claim_id?: string
          created_at?: string
          id?: string
          referral_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_claim_items_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "commission_claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_claim_items_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: true
            referencedRelation: "doctor_referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_claims: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string
          doctor_id: string
          doctor_name: string
          doctor_phone: string
          id: string
          paid_at: string | null
          payout_details: string | null
          payout_method: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string
          doctor_id: string
          doctor_name: string
          doctor_phone: string
          id?: string
          paid_at?: string | null
          payout_details?: string | null
          payout_method?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string
          doctor_id?: string
          doctor_name?: string
          doctor_phone?: string
          id?: string
          paid_at?: string | null
          payout_details?: string | null
          payout_method?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_claims_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          subject?: string
        }
        Relationships: []
      }
      corporate_companies: {
        Row: {
          campaign_close_date: string | null
          campaign_headline: string | null
          campaign_subtext: string | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          context_notes: string | null
          created_at: string
          created_by: string | null
          employee_count: number | null
          id: string
          incentive_amount_ugx: number
          industry: string | null
          languages_enabled: string[]
          location: string | null
          logo_url: string | null
          mode: string
          name: string
          slug: string | null
          slug_locked: boolean
          updated_at: string
        }
        Insert: {
          campaign_close_date?: string | null
          campaign_headline?: string | null
          campaign_subtext?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          context_notes?: string | null
          created_at?: string
          created_by?: string | null
          employee_count?: number | null
          id?: string
          incentive_amount_ugx?: number
          industry?: string | null
          languages_enabled?: string[]
          location?: string | null
          logo_url?: string | null
          mode?: string
          name: string
          slug?: string | null
          slug_locked?: boolean
          updated_at?: string
        }
        Update: {
          campaign_close_date?: string | null
          campaign_headline?: string | null
          campaign_subtext?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          context_notes?: string | null
          created_at?: string
          created_by?: string | null
          employee_count?: number | null
          id?: string
          incentive_amount_ugx?: number
          industry?: string | null
          languages_enabled?: string[]
          location?: string | null
          logo_url?: string | null
          mode?: string
          name?: string
          slug?: string | null
          slug_locked?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      corporate_crisis_alerts: {
        Row: {
          alert_code: string | null
          assigned_to: string | null
          company_id: string
          created_at: string
          employee_id: string
          id: string
          level: number
          notes: string | null
          outreach_attempts: Json
          resolved_at: string | null
          resolved_by: string | null
          screening_id: string | null
          sla_deadline: string | null
          status: string
          triggers: string[]
          updated_at: string
        }
        Insert: {
          alert_code?: string | null
          assigned_to?: string | null
          company_id: string
          created_at?: string
          employee_id: string
          id?: string
          level: number
          notes?: string | null
          outreach_attempts?: Json
          resolved_at?: string | null
          resolved_by?: string | null
          screening_id?: string | null
          sla_deadline?: string | null
          status?: string
          triggers?: string[]
          updated_at?: string
        }
        Update: {
          alert_code?: string | null
          assigned_to?: string | null
          company_id?: string
          created_at?: string
          employee_id?: string
          id?: string
          level?: number
          notes?: string | null
          outreach_attempts?: Json
          resolved_at?: string | null
          resolved_by?: string | null
          screening_id?: string | null
          sla_deadline?: string | null
          status?: string
          triggers?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      corporate_employees: {
        Row: {
          access_code: string
          company_id: string
          created_at: string
          email: string
          gender: string | null
          id: string
          invitation_sent: boolean
          invitation_sent_at: string | null
          name: string
          phone: string | null
          screening_completed: boolean
          secure_token: string
          updated_at: string
        }
        Insert: {
          access_code?: string
          company_id: string
          created_at?: string
          email: string
          gender?: string | null
          id?: string
          invitation_sent?: boolean
          invitation_sent_at?: string | null
          name: string
          phone?: string | null
          screening_completed?: boolean
          secure_token?: string
          updated_at?: string
        }
        Update: {
          access_code?: string
          company_id?: string
          created_at?: string
          email?: string
          gender?: string | null
          id?: string
          invitation_sent?: boolean
          invitation_sent_at?: string | null
          name?: string
          phone?: string | null
          screening_completed?: boolean
          secure_token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "corporate_employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "corporate_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      corporate_reports: {
        Row: {
          business_impact: Json | null
          company_id: string
          created_at: string
          created_by: string | null
          id: string
          observations: string | null
          period_label: string | null
          recommended_service_ids: string[]
          sections: Json
          sent_at: string | null
          sent_to_email: string | null
          service_notes: Json
          status: string
          updated_at: string
        }
        Insert: {
          business_impact?: Json | null
          company_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          observations?: string | null
          period_label?: string | null
          recommended_service_ids?: string[]
          sections?: Json
          sent_at?: string | null
          sent_to_email?: string | null
          service_notes?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          business_impact?: Json | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          observations?: string | null
          period_label?: string | null
          recommended_service_ids?: string[]
          sections?: Json
          sent_at?: string | null
          sent_to_email?: string | null
          service_notes?: Json
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      corporate_screening_bookings: {
        Row: {
          company_name: string
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string
          employee_count: number | null
          id: string
          notes: string | null
          preferred_date: string | null
          preferred_format: string | null
          status: string
          updated_at: string
        }
        Insert: {
          company_name: string
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          employee_count?: number | null
          id?: string
          notes?: string | null
          preferred_date?: string | null
          preferred_format?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          company_name?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          employee_count?: number | null
          id?: string
          notes?: string | null
          preferred_date?: string | null
          preferred_format?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      corporate_screenings: {
        Row: {
          company_id: string
          completed_at: string
          created_at: string
          crisis_alert_level: number | null
          employee_id: string
          id: string
          per_question: Json
          risk_category: string | null
          total_score: number
          triggered_clusters: string[]
          triggered_flags: string[]
          wellbeing_category: string
          who5_percentage: number
          who5_score: number
          workplace_responses: Json | null
        }
        Insert: {
          company_id: string
          completed_at?: string
          created_at?: string
          crisis_alert_level?: number | null
          employee_id: string
          id?: string
          per_question?: Json
          risk_category?: string | null
          total_score?: number
          triggered_clusters?: string[]
          triggered_flags?: string[]
          wellbeing_category?: string
          who5_percentage?: number
          who5_score?: number
          workplace_responses?: Json | null
        }
        Update: {
          company_id?: string
          completed_at?: string
          created_at?: string
          crisis_alert_level?: number | null
          employee_id?: string
          id?: string
          per_question?: Json
          risk_category?: string | null
          total_score?: number
          triggered_clusters?: string[]
          triggered_flags?: string[]
          wellbeing_category?: string
          who5_percentage?: number
          who5_score?: number
          workplace_responses?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "corporate_screenings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "corporate_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "corporate_screenings_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "corporate_employees"
            referencedColumns: ["id"]
          },
        ]
      }
      corporate_service_catalog: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          per_employee_price: number | null
          physical_price: number | null
          sort_order: number
          unit_label: string | null
          updated_at: string
          virtual_price: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          per_employee_price?: number | null
          physical_price?: number | null
          sort_order?: number
          unit_label?: string | null
          updated_at?: string
          virtual_price?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          per_employee_price?: number | null
          physical_price?: number | null
          sort_order?: number
          unit_label?: string | null
          updated_at?: string
          virtual_price?: number | null
        }
        Relationships: []
      }
      corporate_service_interests: {
        Row: {
          clicked_at: string
          company_id: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          id: string
          ip_address: string | null
          message: string | null
          preferred_mode: string | null
          report_id: string | null
          service_id: string | null
          service_name_snapshot: string | null
          submitted: boolean
          user_agent: string | null
        }
        Insert: {
          clicked_at?: string
          company_id?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          id?: string
          ip_address?: string | null
          message?: string | null
          preferred_mode?: string | null
          report_id?: string | null
          service_id?: string | null
          service_name_snapshot?: string | null
          submitted?: boolean
          user_agent?: string | null
        }
        Update: {
          clicked_at?: string
          company_id?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          id?: string
          ip_address?: string | null
          message?: string | null
          preferred_mode?: string | null
          report_id?: string | null
          service_id?: string | null
          service_name_snapshot?: string | null
          submitted?: boolean
          user_agent?: string | null
        }
        Relationships: []
      }
      course_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          enrolled_at: string
          id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      doctor_referrals: {
        Row: {
          admin_notes: string | null
          commission_amount: number | null
          commission_rate: number
          commission_status: string
          concern: string | null
          consent_confirmed: boolean
          created_at: string
          doctor_email: string | null
          doctor_id: string
          doctor_name: string
          doctor_phone: string
          id: string
          location: string | null
          patient_name: string
          patient_phone: string
          payment_amount: number | null
          payment_status: string
          preferred_mode: string
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          commission_amount?: number | null
          commission_rate?: number
          commission_status?: string
          concern?: string | null
          consent_confirmed?: boolean
          created_at?: string
          doctor_email?: string | null
          doctor_id: string
          doctor_name: string
          doctor_phone: string
          id?: string
          location?: string | null
          patient_name: string
          patient_phone: string
          payment_amount?: number | null
          payment_status?: string
          preferred_mode?: string
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          commission_amount?: number | null
          commission_rate?: number
          commission_status?: string
          concern?: string | null
          consent_confirmed?: boolean
          created_at?: string
          doctor_email?: string | null
          doctor_id?: string
          doctor_name?: string
          doctor_phone?: string
          id?: string
          location?: string | null
          patient_name?: string
          patient_phone?: string
          payment_amount?: number | null
          payment_status?: string
          preferred_mode?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_referrals_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          created_at: string
          credentials_email_error: string | null
          credentials_email_sent_at: string | null
          credentials_email_status: string
          deactivated_at: string | null
          deactivated_reason: string | null
          email: string
          facility: string | null
          full_name: string
          id: string
          is_active: boolean
          location: string | null
          phone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credentials_email_error?: string | null
          credentials_email_sent_at?: string | null
          credentials_email_status?: string
          deactivated_at?: string | null
          deactivated_reason?: string | null
          email: string
          facility?: string | null
          full_name: string
          id?: string
          is_active?: boolean
          location?: string | null
          phone: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credentials_email_error?: string | null
          credentials_email_sent_at?: string | null
          credentials_email_status?: string
          deactivated_at?: string | null
          deactivated_reason?: string | null
          email?: string
          facility?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          location?: string | null
          phone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          body: string | null
          created_at: string
          created_by: string | null
          event_date: string | null
          gallery: string[] | null
          hero_image_url: string | null
          id: string
          published_at: string | null
          slug: string
          status: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          created_by?: string | null
          event_date?: string | null
          gallery?: string[] | null
          hero_image_url?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          created_by?: string | null
          event_date?: string | null
          gallery?: string[] | null
          hero_image_url?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          custom_category: string | null
          description: string
          expense_date: string
          id: string
          is_tax_deductible: boolean
          linked_income_id: string | null
          recorded_by: string | null
          tax_code_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          category?: string
          created_at?: string
          custom_category?: string | null
          description: string
          expense_date?: string
          id?: string
          is_tax_deductible?: boolean
          linked_income_id?: string | null
          recorded_by?: string | null
          tax_code_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          custom_category?: string | null
          description?: string
          expense_date?: string
          id?: string
          is_tax_deductible?: boolean
          linked_income_id?: string | null
          recorded_by?: string | null
          tax_code_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_linked_income_id_fkey"
            columns: ["linked_income_id"]
            isOneToOne: false
            referencedRelation: "income_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_tax_code_id_fkey"
            columns: ["tax_code_id"]
            isOneToOne: false
            referencedRelation: "tax_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_snapshots: {
        Row: {
          cash_balance: number
          created_at: string
          created_by: string | null
          id: string
          label: string
          notes: string | null
          receivables: number
          retained_earnings: number
          snapshot_date: string
          total_assets: number
          total_equity: number
          total_liabilities: number
        }
        Insert: {
          cash_balance?: number
          created_at?: string
          created_by?: string | null
          id?: string
          label: string
          notes?: string | null
          receivables?: number
          retained_earnings?: number
          snapshot_date?: string
          total_assets?: number
          total_equity?: number
          total_liabilities?: number
        }
        Update: {
          cash_balance?: number
          created_at?: string
          created_by?: string | null
          id?: string
          label?: string
          notes?: string | null
          receivables?: number
          retained_earnings?: number
          snapshot_date?: string
          total_assets?: number
          total_equity?: number
          total_liabilities?: number
        }
        Relationships: []
      }
      income_entries: {
        Row: {
          amount: number
          client_name: string | null
          created_at: string
          custom_service: string | null
          id: string
          income_date: string
          invoice_id: string | null
          is_taxable: boolean
          linked_expense_total: number
          net_amount: number
          notes: string | null
          payment_id: string | null
          payment_method: string | null
          recorded_by: string | null
          reference: string | null
          service_type: string
          source: string
          tax_code_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          client_name?: string | null
          created_at?: string
          custom_service?: string | null
          id?: string
          income_date?: string
          invoice_id?: string | null
          is_taxable?: boolean
          linked_expense_total?: number
          net_amount?: number
          notes?: string | null
          payment_id?: string | null
          payment_method?: string | null
          recorded_by?: string | null
          reference?: string | null
          service_type?: string
          source?: string
          tax_code_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          client_name?: string | null
          created_at?: string
          custom_service?: string | null
          id?: string
          income_date?: string
          invoice_id?: string | null
          is_taxable?: boolean
          linked_expense_total?: number
          net_amount?: number
          notes?: string | null
          payment_id?: string | null
          payment_method?: string | null
          recorded_by?: string | null
          reference?: string | null
          service_type?: string
          source?: string
          tax_code_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "income_entries_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "income_entries_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "income_entries_tax_code_id_fkey"
            columns: ["tax_code_id"]
            isOneToOne: false
            referencedRelation: "tax_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          quantity: number
          service_type: string
          total: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          quantity?: number
          service_type?: string
          total?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          service_type?: string
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_paid: number
          balance_due: number
          client_id: string | null
          created_at: string
          created_by: string | null
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          payment_instructions: string | null
          status: string
          subtotal: number
          tax_amount: number
          tax_rate: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          amount_paid?: number
          balance_due?: number
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          due_date?: string
          id?: string
          invoice_number: string
          issue_date?: string
          notes?: string | null
          payment_instructions?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          balance_due?: number
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          payment_instructions?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "admin_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          course_id: string
          created_at: string
          id: string
          last_slide: number | null
          lesson_id: string
          module_id: string
          quiz_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          course_id: string
          created_at?: string
          id?: string
          last_slide?: number | null
          lesson_id: string
          module_id: string
          quiz_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          course_id?: string
          created_at?: string
          id?: string
          last_slide?: number | null
          lesson_id?: string
          module_id?: string
          quiz_score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mindcheck_page_visits: {
        Row: {
          device_type: string | null
          id: string
          referrer: string | null
          session_id: string
          source: string | null
          user_agent: string | null
          visited_at: string
        }
        Insert: {
          device_type?: string | null
          id?: string
          referrer?: string | null
          session_id: string
          source?: string | null
          user_agent?: string | null
          visited_at?: string
        }
        Update: {
          device_type?: string | null
          id?: string
          referrer?: string | null
          session_id?: string
          source?: string | null
          user_agent?: string | null
          visited_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Relationships: []
      }
      newsletters: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          recipient_count: number | null
          recipient_filter: Json | null
          scheduled_at: string | null
          sent_at: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          recipient_count?: number | null
          recipient_filter?: Json | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          recipient_count?: number | null
          recipient_filter?: Json | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          notes: string | null
          payment_date: string
          payment_method: string
          recorded_by: string | null
          reference_number: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          recorded_by?: string | null
          reference_number?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          recorded_by?: string | null
          reference_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_sections: {
        Row: {
          data: Json
          id: string
          is_visible: boolean
          section_key: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          data?: Json
          id?: string
          is_visible?: boolean
          section_key: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          data?: Json
          id?: string
          is_visible?: boolean
          section_key?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      specialist_availability: {
        Row: {
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean
          specialist_id: string
          start_time: string
        }
        Insert: {
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean
          specialist_id: string
          start_time: string
        }
        Update: {
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean
          specialist_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "specialist_availability_specialist_id_fkey"
            columns: ["specialist_id"]
            isOneToOne: false
            referencedRelation: "specialists"
            referencedColumns: ["id"]
          },
        ]
      }
      specialist_certificates: {
        Row: {
          certificate_name: string
          certificate_url: string
          created_at: string
          id: string
          specialist_id: string
        }
        Insert: {
          certificate_name: string
          certificate_url: string
          created_at?: string
          id?: string
          specialist_id: string
        }
        Update: {
          certificate_name?: string
          certificate_url?: string
          created_at?: string
          id?: string
          specialist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "specialist_certificates_specialist_id_fkey"
            columns: ["specialist_id"]
            isOneToOne: false
            referencedRelation: "specialists"
            referencedColumns: ["id"]
          },
        ]
      }
      specialist_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          is_verified: boolean
          rating: number
          reviewer_name: string
          specialist_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean
          rating: number
          reviewer_name: string
          specialist_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean
          rating?: number
          reviewer_name?: string
          specialist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "specialist_reviews_specialist_id_fkey"
            columns: ["specialist_id"]
            isOneToOne: false
            referencedRelation: "specialists"
            referencedColumns: ["id"]
          },
        ]
      }
      specialists: {
        Row: {
          available_options: string[]
          bio: string | null
          certifications: string[] | null
          country: string
          created_at: string
          education: string | null
          experience_years: number
          id: string
          image_url: string | null
          is_active: boolean
          languages: string[]
          name: string
          price_per_hour: number
          specialties: string[]
          type: string
          updated_at: string
        }
        Insert: {
          available_options?: string[]
          bio?: string | null
          certifications?: string[] | null
          country?: string
          created_at?: string
          education?: string | null
          experience_years?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          languages?: string[]
          name: string
          price_per_hour: number
          specialties?: string[]
          type: string
          updated_at?: string
        }
        Update: {
          available_options?: string[]
          bio?: string | null
          certifications?: string[] | null
          country?: string
          created_at?: string
          education?: string | null
          experience_years?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          languages?: string[]
          name?: string
          price_per_hour?: number
          specialties?: string[]
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      tax_codes: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          rate: number
          type: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          rate?: number
          type?: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          rate?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      therapists: {
        Row: {
          availability: string[]
          bio: string | null
          created_at: string
          created_by: string | null
          email: string
          full_name: string
          id: string
          languages: string[]
          license_number: string | null
          license_status: Database["public"]["Enums"]["therapist_license_status"]
          licensing_body: string | null
          phone: string
          photo_url: string | null
          platform_status: Database["public"]["Enums"]["therapist_platform_status"]
          qualification: string | null
          rating: number
          removed_at: string | null
          session_count: number
          session_types: string[]
          specialisations: string[]
          suspension_reason: string | null
          suspension_review_date: string | null
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          availability?: string[]
          bio?: string | null
          created_at?: string
          created_by?: string | null
          email: string
          full_name: string
          id?: string
          languages?: string[]
          license_number?: string | null
          license_status?: Database["public"]["Enums"]["therapist_license_status"]
          licensing_body?: string | null
          phone: string
          photo_url?: string | null
          platform_status?: Database["public"]["Enums"]["therapist_platform_status"]
          qualification?: string | null
          rating?: number
          removed_at?: string | null
          session_count?: number
          session_types?: string[]
          specialisations?: string[]
          suspension_reason?: string | null
          suspension_review_date?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          availability?: string[]
          bio?: string | null
          created_at?: string
          created_by?: string | null
          email?: string
          full_name?: string
          id?: string
          languages?: string[]
          license_number?: string | null
          license_status?: Database["public"]["Enums"]["therapist_license_status"]
          licensing_body?: string | null
          phone?: string
          photo_url?: string | null
          platform_status?: Database["public"]["Enums"]["therapist_platform_status"]
          qualification?: string | null
          rating?: number
          removed_at?: string | null
          session_count?: number
          session_types?: string[]
          specialisations?: string[]
          suspension_reason?: string | null
          suspension_review_date?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      training_registrations: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          organisation: string | null
          phone_number: string
          position: string | null
          training_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          organisation?: string | null
          phone_number: string
          position?: string | null
          training_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          organisation?: string | null
          phone_number?: string
          position?: string | null
          training_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_registrations_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
        ]
      }
      trainings: {
        Row: {
          created_at: string
          description: string
          end_time: string | null
          facilitator_name: string
          facilitator_title: string
          flier_image_url: string | null
          id: string
          is_active: boolean
          meeting_link: string | null
          meeting_password: string | null
          session_focus: string[] | null
          target_audience: string
          title: string
          training_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          end_time?: string | null
          facilitator_name?: string
          facilitator_title?: string
          flier_image_url?: string | null
          id?: string
          is_active?: boolean
          meeting_link?: string | null
          meeting_password?: string | null
          session_focus?: string[] | null
          target_audience?: string
          title: string
          training_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          end_time?: string | null
          facilitator_name?: string
          facilitator_title?: string
          flier_image_url?: string | null
          id?: string
          is_active?: boolean
          meeting_link?: string | null
          meeting_password?: string | null
          session_focus?: string[] | null
          target_audience?: string
          title?: string
          training_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whisper_events: {
        Row: {
          country: string | null
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          referrer: string | null
          user_agent: string | null
          whisper_id: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          referrer?: string | null
          user_agent?: string | null
          whisper_id: string
        }
        Update: {
          country?: string | null
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          referrer?: string | null
          user_agent?: string | null
          whisper_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whisper_events_whisper_id_fkey"
            columns: ["whisper_id"]
            isOneToOne: false
            referencedRelation: "whispers"
            referencedColumns: ["id"]
          },
        ]
      }
      whispers: {
        Row: {
          ai_analyzed_at: string | null
          ai_crisis: boolean | null
          ai_language_detected: string | null
          ai_sentiment: string | null
          ai_summary: string | null
          ai_theme: string | null
          ai_urgency: string | null
          audio_path: string
          country: string | null
          created_at: string
          duration_seconds: number | null
          email: string
          id: string
          language: string | null
          public_token: string
          replied_by: string | null
          reply_audio_path: string | null
          reply_sent_at: string | null
          reply_text: string | null
          source: string | null
          status: string
          topic_hint: string | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          ai_analyzed_at?: string | null
          ai_crisis?: boolean | null
          ai_language_detected?: string | null
          ai_sentiment?: string | null
          ai_summary?: string | null
          ai_theme?: string | null
          ai_urgency?: string | null
          audio_path: string
          country?: string | null
          created_at?: string
          duration_seconds?: number | null
          email: string
          id?: string
          language?: string | null
          public_token?: string
          replied_by?: string | null
          reply_audio_path?: string | null
          reply_sent_at?: string | null
          reply_text?: string | null
          source?: string | null
          status?: string
          topic_hint?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          ai_analyzed_at?: string | null
          ai_crisis?: boolean | null
          ai_language_detected?: string | null
          ai_sentiment?: string | null
          ai_summary?: string | null
          ai_theme?: string | null
          ai_urgency?: string | null
          audio_path?: string
          country?: string | null
          created_at?: string
          duration_seconds?: number | null
          email?: string
          id?: string
          language?: string | null
          public_token?: string
          replied_by?: string | null
          reply_audio_path?: string | null
          reply_sent_at?: string | null
          reply_text?: string | null
          source?: string | null
          status?: string
          topic_hint?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      who5_cta_clicks: {
        Row: {
          clicked_at: string
          cta_type: string
          device_type: string | null
          id: string
          session_id: string
          source: string | null
        }
        Insert: {
          clicked_at?: string
          cta_type: string
          device_type?: string | null
          id?: string
          session_id: string
          source?: string | null
        }
        Update: {
          clicked_at?: string
          cta_type?: string
          device_type?: string | null
          id?: string
          session_id?: string
          source?: string | null
        }
        Relationships: []
      }
      who5_sessions: {
        Row: {
          abandoned_at: string | null
          completed_at: string | null
          created_at: string
          device_type: string | null
          id: string
          last_question_reached: number | null
          percentage_score: number | null
          raw_score: number | null
          referrer: string | null
          session_id: string
          source: string | null
          started_at: string
          time_taken_seconds: number | null
          user_agent: string | null
          wellbeing_level: string | null
        }
        Insert: {
          abandoned_at?: string | null
          completed_at?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          last_question_reached?: number | null
          percentage_score?: number | null
          raw_score?: number | null
          referrer?: string | null
          session_id: string
          source?: string | null
          started_at?: string
          time_taken_seconds?: number | null
          user_agent?: string | null
          wellbeing_level?: string | null
        }
        Update: {
          abandoned_at?: string | null
          completed_at?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          last_question_reached?: number | null
          percentage_score?: number | null
          raw_score?: number | null
          referrer?: string | null
          session_id?: string
          source?: string | null
          started_at?: string
          time_taken_seconds?: number | null
          user_agent?: string | null
          wellbeing_level?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      clear_mindcheck_data: {
        Args: { tables_to_clear: string[] }
        Returns: Json
      }
      complete_employee_screening: {
        Args: { _employee_id: string; _gender?: string }
        Returns: boolean
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_campaign_by_slug: { Args: { _slug: string }; Returns: Json }
      get_campaign_completion: { Args: { _company_id: string }; Returns: Json }
      get_doctor_email_by_phone: { Args: { _phone: string }; Returns: string }
      get_service_recommendation_details: {
        Args: { _report_id: string; _service_id: string }
        Returns: Json
      }
      get_whisper_by_token: { Args: { _token: string }; Returns: Json }
      has_page_access: {
        Args: { _page_key: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      lock_campaign_slug: { Args: { _slug: string }; Returns: undefined }
      lookup_employee_by_code: { Args: { _code: string }; Returns: Json }
      lookup_employee_by_token: { Args: { _token: string }; Returns: Json }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      recalc_doctor_monthly_commissions: {
        Args: { _doctor_id: string; _month_start: string }
        Returns: undefined
      }
      slugify_company_name: { Args: { _name: string }; Returns: string }
      sync_form_emails_to_subscribers: { Args: never; Returns: Json }
    }
    Enums: {
      app_role:
        | "admin"
        | "moderator"
        | "user"
        | "finance_admin"
        | "operations_admin"
        | "content_admin"
      therapist_license_status: "verified" | "pending" | "suspended"
      therapist_platform_status: "active" | "inactive" | "suspended" | "removed"
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
      app_role: [
        "admin",
        "moderator",
        "user",
        "finance_admin",
        "operations_admin",
        "content_admin",
      ],
      therapist_license_status: ["verified", "pending", "suspended"],
      therapist_platform_status: ["active", "inactive", "suspended", "removed"],
    },
  },
} as const
