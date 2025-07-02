export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bets: {
        Row: {
          amount: number | null
          bet_selection: string | null
          bet_type: string | null
          created_at: string | null
          creator_id: string | null
          event_id: string | null
          expiry_time: string | null
          id: string
          odds: string | null
          opponent_id: string | null
          outcome: string | null
          status: string | null
          updated_at: string | null
          vig_percent: number | null
        }
        Insert: {
          amount?: number | null
          bet_selection?: string | null
          bet_type?: string | null
          created_at?: string | null
          creator_id?: string | null
          event_id?: string | null
          expiry_time?: string | null
          id?: string
          odds?: string | null
          opponent_id?: string | null
          outcome?: string | null
          status?: string | null
          updated_at?: string | null
          vig_percent?: number | null
        }
        Update: {
          amount?: number | null
          bet_selection?: string | null
          bet_type?: string | null
          created_at?: string | null
          creator_id?: string | null
          event_id?: string | null
          expiry_time?: string | null
          id?: string
          odds?: string | null
          opponent_id?: string | null
          outcome?: string | null
          status?: string | null
          updated_at?: string | null
          vig_percent?: number | null
        }
        Relationships: []
      }
      escrow_wallets: {
        Row: {
          amount: number | null
          bet_id: string | null
          created_at: string | null
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          bet_id?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          bet_id?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      group_bet_contributions: {
        Row: {
          amount: number | null
          group_bet_id: string | null
          id: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          group_bet_id?: string | null
          id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          group_bet_id?: string | null
          id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_bet_contributions_group_bet_id_fkey"
            columns: ["group_bet_id"]
            isOneToOne: false
            referencedRelation: "group_bets"
            referencedColumns: ["id"]
          },
        ]
      }
      group_bets: {
        Row: {
          bet_type: string | null
          created_at: string | null
          creator_id: string | null
          event_id: string | null
          id: string
          result: string | null
          status: string | null
          target_outcome: string | null
          total_pot: number | null
        }
        Insert: {
          bet_type?: string | null
          created_at?: string | null
          creator_id?: string | null
          event_id?: string | null
          id?: string
          result?: string | null
          status?: string | null
          target_outcome?: string | null
          total_pot?: number | null
        }
        Update: {
          bet_type?: string | null
          created_at?: string | null
          creator_id?: string | null
          event_id?: string | null
          id?: string
          result?: string | null
          status?: string | null
          target_outcome?: string | null
          total_pot?: number | null
        }
        Relationships: []
      }
      group_challenges: {
        Row: {
          bet_type: string
          created_at: string
          creator_id: string | null
          current_amount: number | null
          description: string | null
          entry_fee: number
          event_id: string
          expiry_time: string
          id: string
          max_participants: number | null
          min_participants: number | null
          status: string | null
          target_amount: number
          title: string
          updated_at: string
          vig_percent: number | null
        }
        Insert: {
          bet_type: string
          created_at?: string
          creator_id?: string | null
          current_amount?: number | null
          description?: string | null
          entry_fee: number
          event_id: string
          expiry_time: string
          id?: string
          max_participants?: number | null
          min_participants?: number | null
          status?: string | null
          target_amount: number
          title: string
          updated_at?: string
          vig_percent?: number | null
        }
        Update: {
          bet_type?: string
          created_at?: string
          creator_id?: string | null
          current_amount?: number | null
          description?: string | null
          entry_fee?: number
          event_id?: string
          expiry_time?: string
          id?: string
          max_participants?: number | null
          min_participants?: number | null
          status?: string | null
          target_amount?: number
          title?: string
          updated_at?: string
          vig_percent?: number | null
        }
        Relationships: []
      }
      live_odds: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          match_name: string | null
          odds: Json | null
          sport_key: string | null
          start_time: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          match_name?: string | null
          odds?: Json | null
          sport_key?: string | null
          start_time?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          match_name?: string | null
          odds?: Json | null
          sport_key?: string | null
          start_time?: string | null
        }
        Relationships: []
      }
      match_odds: {
        Row: {
          away_team: string | null
          bookmaker: string
          commence_time: string | null
          created_at: string
          event_id: string
          home_team: string | null
          id: string
          last_updated: string
          market: string
          match_name: string
          odds_data: Json
          sport_key: string
        }
        Insert: {
          away_team?: string | null
          bookmaker: string
          commence_time?: string | null
          created_at?: string
          event_id: string
          home_team?: string | null
          id?: string
          last_updated?: string
          market: string
          match_name: string
          odds_data: Json
          sport_key: string
        }
        Update: {
          away_team?: string | null
          bookmaker?: string
          commence_time?: string | null
          created_at?: string
          event_id?: string
          home_team?: string | null
          id?: string
          last_updated?: string
          market?: string
          match_name?: string
          odds_data?: Json
          sport_key?: string
        }
        Relationships: []
      }
      picks: {
        Row: {
          bet_type: string
          confidence: number
          created_at: string
          explanation: string
          id: string
          is_premium: boolean | null
          odds: string
          sport: string
          title: string
          updated_at: string
        }
        Insert: {
          bet_type: string
          confidence: number
          created_at?: string
          explanation: string
          id?: string
          is_premium?: boolean | null
          odds: string
          sport: string
          title: string
          updated_at?: string
        }
        Update: {
          bet_type?: string
          confidence?: number
          created_at?: string
          explanation?: string
          id?: string
          is_premium?: boolean | null
          odds?: string
          sport?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          full_name: string | null
          id: string
          ip_address: unknown | null
          kyc_verified: boolean | null
          kyc_verified_at: string | null
          plan_type: string | null
          risk_score: number | null
          stripe_customer_id: string | null
          subscription_status: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          ip_address?: unknown | null
          kyc_verified?: boolean | null
          kyc_verified_at?: string | null
          plan_type?: string | null
          risk_score?: number | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          ip_address?: unknown | null
          kyc_verified?: boolean | null
          kyc_verified_at?: string | null
          plan_type?: string | null
          risk_score?: number | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_bet_audit: {
        Row: {
          action_type: string
          amount_after: number | null
          amount_before: number | null
          bet_id: string | null
          created_at: string
          escrow_amount: number | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          amount_after?: number | null
          amount_before?: number | null
          bet_id?: string | null
          created_at?: string
          escrow_amount?: number | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          amount_after?: number | null
          amount_before?: number | null
          bet_id?: string | null
          created_at?: string
          escrow_amount?: number | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_bet_audit_bet_id_fkey"
            columns: ["bet_id"]
            isOneToOne: false
            referencedRelation: "bets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_consent_log: {
        Row: {
          consent_given: boolean
          consent_timestamp: string
          consent_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
          version: string | null
        }
        Insert: {
          consent_given: boolean
          consent_timestamp?: string
          consent_type: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
          version?: string | null
        }
        Update: {
          consent_given?: boolean
          consent_timestamp?: string
          consent_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
          version?: string | null
        }
        Relationships: []
      }
      user_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_picks: {
        Row: {
          accessed_at: string
          id: string
          pick_id: string
          user_id: string
        }
        Insert: {
          accessed_at?: string
          id?: string
          pick_id: string
          user_id: string
        }
        Update: {
          accessed_at?: string
          id?: string
          pick_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_picks_pick_id_fkey"
            columns: ["pick_id"]
            isOneToOne: false
            referencedRelation: "picks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          daily_limit: number | null
          escrow_held: number | null
          id: string
          last_transaction_at: string | null
          margin_status: boolean | null
          updated_at: string | null
          user_id: string | null
          weekly_limit: number | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          daily_limit?: number | null
          escrow_held?: number | null
          id?: string
          last_transaction_at?: string | null
          margin_status?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          weekly_limit?: number | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          daily_limit?: number | null
          escrow_held?: number | null
          id?: string
          last_transaction_at?: string | null
          margin_status?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          weekly_limit?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      log_bet_audit: {
        Args:
          | Record<PropertyKey, never>
          | {
              p_user_id: string
              p_bet_id: string
              p_action_type: string
              p_amount_before?: number
              p_amount_after?: number
              p_escrow_amount?: number
              p_metadata?: Json
            }
        Returns: string
      }
      log_user_event: {
        Args:
          | Record<PropertyKey, never>
          | {
              p_user_id: string
              p_event_type: string
              p_event_data?: Json
              p_ip_address?: unknown
              p_user_agent?: string
            }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
