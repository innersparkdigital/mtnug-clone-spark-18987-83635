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
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string
          created_by: string | null
          employee_count: number | null
          id: string
          industry: string | null
          name: string
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          employee_count?: number | null
          id?: string
          industry?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          employee_count?: number | null
          id?: string
          industry?: string | null
          name?: string
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
      corporate_screenings: {
        Row: {
          company_id: string
          completed_at: string
          created_at: string
          employee_id: string
          id: string
          total_score: number
          wellbeing_category: string
          who5_percentage: number
          who5_score: number
          workplace_responses: Json | null
        }
        Insert: {
          company_id: string
          completed_at?: string
          created_at?: string
          employee_id: string
          id?: string
          total_score?: number
          wellbeing_category?: string
          who5_percentage?: number
          who5_score?: number
          workplace_responses?: Json | null
        }
        Update: {
          company_id?: string
          completed_at?: string
          created_at?: string
          employee_id?: string
          id?: string
          total_score?: number
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
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
      sync_form_emails_to_subscribers: { Args: never; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    },
  },
} as const
