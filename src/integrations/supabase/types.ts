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
      bookie_audit_log: {
        Row: {
          action_type: string
          actor_id: string
          bookie_id: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          reason: string | null
          target_id: string | null
          user_agent: string | null
        }
        Insert: {
          action_type: string
          actor_id: string
          bookie_id: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          reason?: string | null
          target_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          actor_id?: string
          bookie_id?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          reason?: string | null
          target_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookie_audit_log_bookie_id_fkey"
            columns: ["bookie_id"]
            isOneToOne: false
            referencedRelation: "bookie_operators"
            referencedColumns: ["id"]
          },
        ]
      }
      bookie_credit_lines: {
        Row: {
          approved_by: string | null
          available_credit: number
          bookie_id: string
          collateral_amount: number
          collateral_type: string
          created_at: string
          credit_limit: number
          id: string
          interest_rate: number
          next_review_date: string | null
          risk_score: number
          status: string
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          available_credit: number
          bookie_id: string
          collateral_amount: number
          collateral_type: string
          created_at?: string
          credit_limit: number
          id?: string
          interest_rate?: number
          next_review_date?: string | null
          risk_score?: number
          status?: string
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          available_credit?: number
          bookie_id?: string
          collateral_amount?: number
          collateral_type?: string
          created_at?: string
          credit_limit?: number
          id?: string
          interest_rate?: number
          next_review_date?: string | null
          risk_score?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookie_credit_lines_bookie_id_fkey"
            columns: ["bookie_id"]
            isOneToOne: false
            referencedRelation: "bookie_operators"
            referencedColumns: ["id"]
          },
        ]
      }
      bookie_lines: {
        Row: {
          bookie_id: string
          created_at: string
          event_id: string
          expiry_time: string
          id: string
          is_active: boolean
          is_private: boolean
          market_type: string
          match_name: string
          odds: number
          selection: string
          sport_key: string
          stake_limit: number
          updated_at: string
        }
        Insert: {
          bookie_id: string
          created_at?: string
          event_id: string
          expiry_time: string
          id?: string
          is_active?: boolean
          is_private?: boolean
          market_type: string
          match_name: string
          odds: number
          selection: string
          sport_key: string
          stake_limit?: number
          updated_at?: string
        }
        Update: {
          bookie_id?: string
          created_at?: string
          event_id?: string
          expiry_time?: string
          id?: string
          is_active?: boolean
          is_private?: boolean
          market_type?: string
          match_name?: string
          odds?: number
          selection?: string
          sport_key?: string
          stake_limit?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookie_lines_bookie_id_fkey"
            columns: ["bookie_id"]
            isOneToOne: false
            referencedRelation: "bookie_operators"
            referencedColumns: ["id"]
          },
        ]
      }
      bookie_operators: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          bank_account_verified: boolean
          business_name: string
          created_at: string
          crypto_escrow_verified: boolean
          id: string
          kyc_verified: boolean
          kyc_verified_at: string | null
          license_number: string | null
          liquidity_validated: boolean
          liquidity_validated_at: string | null
          monthly_fee: number
          status: Database["public"]["Enums"]["bookie_status"]
          tier: Database["public"]["Enums"]["bookie_tier_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          bank_account_verified?: boolean
          business_name: string
          created_at?: string
          crypto_escrow_verified?: boolean
          id?: string
          kyc_verified?: boolean
          kyc_verified_at?: string | null
          license_number?: string | null
          liquidity_validated?: boolean
          liquidity_validated_at?: string | null
          monthly_fee: number
          status?: Database["public"]["Enums"]["bookie_status"]
          tier?: Database["public"]["Enums"]["bookie_tier_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          bank_account_verified?: boolean
          business_name?: string
          created_at?: string
          crypto_escrow_verified?: boolean
          id?: string
          kyc_verified?: boolean
          kyc_verified_at?: string | null
          license_number?: string | null
          liquidity_validated?: boolean
          liquidity_validated_at?: string | null
          monthly_fee?: number
          status?: Database["public"]["Enums"]["bookie_status"]
          tier?: Database["public"]["Enums"]["bookie_tier_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bookie_payouts: {
        Row: {
          bet_id: string | null
          bookie_id: string
          created_at: string
          escrow_fee: number
          gross_win: number
          hold_reason: string | null
          hold_until: string | null
          id: string
          net_payout: number
          platform_fee: number
          processed_at: string | null
          status: string
          syndicate_id: string | null
          user_id: string
          vig_amount: number
        }
        Insert: {
          bet_id?: string | null
          bookie_id: string
          created_at?: string
          escrow_fee: number
          gross_win: number
          hold_reason?: string | null
          hold_until?: string | null
          id?: string
          net_payout: number
          platform_fee: number
          processed_at?: string | null
          status?: string
          syndicate_id?: string | null
          user_id: string
          vig_amount: number
        }
        Update: {
          bet_id?: string | null
          bookie_id?: string
          created_at?: string
          escrow_fee?: number
          gross_win?: number
          hold_reason?: string | null
          hold_until?: string | null
          id?: string
          net_payout?: number
          platform_fee?: number
          processed_at?: string | null
          status?: string
          syndicate_id?: string | null
          user_id?: string
          vig_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "bookie_payouts_bet_id_fkey"
            columns: ["bet_id"]
            isOneToOne: false
            referencedRelation: "bets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookie_payouts_bookie_id_fkey"
            columns: ["bookie_id"]
            isOneToOne: false
            referencedRelation: "bookie_operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookie_payouts_syndicate_id_fkey"
            columns: ["syndicate_id"]
            isOneToOne: false
            referencedRelation: "bookie_syndicates"
            referencedColumns: ["id"]
          },
        ]
      }
      bookie_syndicate_participants: {
        Row: {
          amount: number
          id: string
          joined_at: string
          syndicate_id: string
          user_id: string
        }
        Insert: {
          amount: number
          id?: string
          joined_at?: string
          syndicate_id: string
          user_id: string
        }
        Update: {
          amount?: number
          id?: string
          joined_at?: string
          syndicate_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookie_syndicate_participants_syndicate_id_fkey"
            columns: ["syndicate_id"]
            isOneToOne: false
            referencedRelation: "bookie_syndicates"
            referencedColumns: ["id"]
          },
        ]
      }
      bookie_syndicates: {
        Row: {
          bookie_id: string
          closes_at: string
          created_at: string
          current_amount: number
          description: string | null
          id: string
          is_private: boolean
          line_id: string
          max_participants: number
          min_participants: number
          status: string
          target_amount: number
          title: string
          updated_at: string
        }
        Insert: {
          bookie_id: string
          closes_at: string
          created_at?: string
          current_amount?: number
          description?: string | null
          id?: string
          is_private?: boolean
          line_id: string
          max_participants?: number
          min_participants?: number
          status?: string
          target_amount: number
          title: string
          updated_at?: string
        }
        Update: {
          bookie_id?: string
          closes_at?: string
          created_at?: string
          current_amount?: number
          description?: string | null
          id?: string
          is_private?: boolean
          line_id?: string
          max_participants?: number
          min_participants?: number
          status?: string
          target_amount?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookie_syndicates_bookie_id_fkey"
            columns: ["bookie_id"]
            isOneToOne: false
            referencedRelation: "bookie_operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookie_syndicates_line_id_fkey"
            columns: ["line_id"]
            isOneToOne: false
            referencedRelation: "bookie_lines"
            referencedColumns: ["id"]
          },
        ]
      }
      bookie_transactions: {
        Row: {
          bet_id: string | null
          bookie_id: string
          escrow_fee: number
          gross_amount: number
          id: string
          metadata: Json | null
          net_amount: number
          platform_fee: number
          processed_at: string
          syndicate_id: string | null
          transaction_type: string
        }
        Insert: {
          bet_id?: string | null
          bookie_id: string
          escrow_fee?: number
          gross_amount: number
          id?: string
          metadata?: Json | null
          net_amount: number
          platform_fee?: number
          processed_at?: string
          syndicate_id?: string | null
          transaction_type: string
        }
        Update: {
          bet_id?: string | null
          bookie_id?: string
          escrow_fee?: number
          gross_amount?: number
          id?: string
          metadata?: Json | null
          net_amount?: number
          platform_fee?: number
          processed_at?: string
          syndicate_id?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookie_transactions_bet_id_fkey"
            columns: ["bet_id"]
            isOneToOne: false
            referencedRelation: "bets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookie_transactions_bookie_id_fkey"
            columns: ["bookie_id"]
            isOneToOne: false
            referencedRelation: "bookie_operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookie_transactions_syndicate_id_fkey"
            columns: ["syndicate_id"]
            isOneToOne: false
            referencedRelation: "bookie_syndicates"
            referencedColumns: ["id"]
          },
        ]
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
      referral_activity: {
        Row: {
          bet_id: string
          bonus_amount: number
          completed_at: string | null
          created_at: string
          id: string
          share_link_id: string | null
          source_user_id: string
          status: string
          target_user_id: string | null
        }
        Insert: {
          bet_id: string
          bonus_amount?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          share_link_id?: string | null
          source_user_id: string
          status?: string
          target_user_id?: string | null
        }
        Update: {
          bet_id?: string
          bonus_amount?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          share_link_id?: string | null
          source_user_id?: string
          status?: string
          target_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_activity_share_link_id_fkey"
            columns: ["share_link_id"]
            isOneToOne: false
            referencedRelation: "share_links"
            referencedColumns: ["id"]
          },
        ]
      }
      share_links: {
        Row: {
          bet_id: string
          channel: string | null
          clicks: number
          conversions: number
          converted_at: string | null
          created_at: string
          expires_at: string
          id: string
          last_clicked_at: string | null
          source_user_id: string
          type: string
        }
        Insert: {
          bet_id: string
          channel?: string | null
          clicks?: number
          conversions?: number
          converted_at?: string | null
          created_at?: string
          expires_at: string
          id?: string
          last_clicked_at?: string | null
          source_user_id: string
          type: string
        }
        Update: {
          bet_id?: string
          channel?: string | null
          clicks?: number
          conversions?: number
          converted_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          last_clicked_at?: string | null
          source_user_id?: string
          type?: string
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
      is_bookie_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_bookie_operator: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
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
      bookie_status: "pending" | "active" | "suspended" | "terminated"
      bookie_tier_type: "starter" | "pro" | "elite"
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
    Enums: {
      bookie_status: ["pending", "active", "suspended", "terminated"],
      bookie_tier_type: ["starter", "pro", "elite"],
    },
  },
} as const
