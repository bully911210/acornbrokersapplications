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
      applicants: {
        Row: {
          abandonment_email_sent: boolean | null
          account_holder: string | null
          account_number: string | null
          account_type: Database["public"]["Enums"]["account_type"] | null
          agent_id: string | null
          bank_name: string | null
          city: string | null
          consent_timestamp: string | null
          cover_option: Database["public"]["Enums"]["cover_option"] | null
          created_at: string
          current_step: number | null
          debit_order_consent: boolean | null
          declaration_consent: boolean | null
          electronic_signature_consent: boolean | null
          email: string | null
          firearm_licence_status:
            | Database["public"]["Enums"]["firearm_licence_status"]
            | null
          first_name: string | null
          id: string
          ip_address: string | null
          last_name: string | null
          mobile: string | null
          popia_consent: boolean | null
          preferred_debit_date: number | null
          province: string | null
          sa_id_number: string | null
          session_id: string | null
          source: Database["public"]["Enums"]["application_source"] | null
          status: Database["public"]["Enums"]["application_status"] | null
          street_address: string | null
          suburb: string | null
          terms_consent: boolean | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          abandonment_email_sent?: boolean | null
          account_holder?: string | null
          account_number?: string | null
          account_type?: Database["public"]["Enums"]["account_type"] | null
          agent_id?: string | null
          bank_name?: string | null
          city?: string | null
          consent_timestamp?: string | null
          cover_option?: Database["public"]["Enums"]["cover_option"] | null
          created_at?: string
          current_step?: number | null
          debit_order_consent?: boolean | null
          declaration_consent?: boolean | null
          electronic_signature_consent?: boolean | null
          email?: string | null
          firearm_licence_status?:
            | Database["public"]["Enums"]["firearm_licence_status"]
            | null
          first_name?: string | null
          id?: string
          ip_address?: string | null
          last_name?: string | null
          mobile?: string | null
          popia_consent?: boolean | null
          preferred_debit_date?: number | null
          province?: string | null
          sa_id_number?: string | null
          session_id?: string | null
          source?: Database["public"]["Enums"]["application_source"] | null
          status?: Database["public"]["Enums"]["application_status"] | null
          street_address?: string | null
          suburb?: string | null
          terms_consent?: boolean | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          abandonment_email_sent?: boolean | null
          account_holder?: string | null
          account_number?: string | null
          account_type?: Database["public"]["Enums"]["account_type"] | null
          agent_id?: string | null
          bank_name?: string | null
          city?: string | null
          consent_timestamp?: string | null
          cover_option?: Database["public"]["Enums"]["cover_option"] | null
          created_at?: string
          current_step?: number | null
          debit_order_consent?: boolean | null
          declaration_consent?: boolean | null
          electronic_signature_consent?: boolean | null
          email?: string | null
          firearm_licence_status?:
            | Database["public"]["Enums"]["firearm_licence_status"]
            | null
          first_name?: string | null
          id?: string
          ip_address?: string | null
          last_name?: string | null
          mobile?: string | null
          popia_consent?: boolean | null
          preferred_debit_date?: number | null
          province?: string | null
          sa_id_number?: string | null
          session_id?: string | null
          source?: Database["public"]["Enums"]["application_source"] | null
          status?: Database["public"]["Enums"]["application_status"] | null
          street_address?: string | null
          suburb?: string | null
          terms_consent?: boolean | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      account_type: "cheque" | "savings" | "transmission"
      application_source: "online" | "agent" | "referral" | "other"
      application_status: "partial" | "complete"
      cover_option: "option_a" | "option_b"
      firearm_licence_status: "valid" | "in_progress"
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
      account_type: ["cheque", "savings", "transmission"],
      application_source: ["online", "agent", "referral", "other"],
      application_status: ["partial", "complete"],
      cover_option: ["option_a", "option_b"],
      firearm_licence_status: ["valid", "in_progress"],
    },
  },
} as const
