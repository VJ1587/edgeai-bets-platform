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
          created_at: string | null
          creator_id: string | null
          event_id: string | null
          expiry_time: string | null
          id: string
          opponent_id: string | null
          outcome: string | null
          status: string | null
          vig_percent: number | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          creator_id?: string | null
          event_id?: string | null
          expiry_time?: string | null
          id?: string
          opponent_id?: string | null
          outcome?: string | null
          status?: string | null
          vig_percent?: number | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          creator_id?: string | null
          event_id?: string | null
          expiry_time?: string | null
          id?: string
          opponent_id?: string | null
          outcome?: string | null
          status?: string | null
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
          email: string | null
          full_name: string | null
          id: string
          plan_type: string | null
          stripe_customer_id: string | null
          subscription_status: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          plan_type?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          plan_type?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          updated_at?: string
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
          escrow_held: number | null
          id: string
          margin_status: boolean | null
          user_id: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          escrow_held?: number | null
          id?: string
          margin_status?: boolean | null
          user_id?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          escrow_held?: number | null
          id?: string
          margin_status?: boolean | null
          user_id?: string | null
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
