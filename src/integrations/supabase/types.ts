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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      champions: {
        Row: {
          champion_team_id: string | null
          created_at: string
          final_score: string | null
          id: string
          mvp: string | null
          runner_up_team_id: string | null
          third_place_team_id: string | null
          top_scorer: string | null
          tournament_id: string
        }
        Insert: {
          champion_team_id?: string | null
          created_at?: string
          final_score?: string | null
          id?: string
          mvp?: string | null
          runner_up_team_id?: string | null
          third_place_team_id?: string | null
          top_scorer?: string | null
          tournament_id: string
        }
        Update: {
          champion_team_id?: string | null
          created_at?: string
          final_score?: string | null
          id?: string
          mvp?: string | null
          runner_up_team_id?: string | null
          third_place_team_id?: string | null
          top_scorer?: string | null
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "champions_champion_team_id_fkey"
            columns: ["champion_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "champions_runner_up_team_id_fkey"
            columns: ["runner_up_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "champions_third_place_team_id_fkey"
            columns: ["third_place_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "champions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: true
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      fixtures: {
        Row: {
          away_team_id: string | null
          bracket_slot: number | null
          created_at: string
          home_team_id: string | null
          id: string
          matchday: number | null
          round: string | null
          scheduled_date: string | null
          scheduled_time: string | null
          stage: string
          status: string
          tournament_id: string
        }
        Insert: {
          away_team_id?: string | null
          bracket_slot?: number | null
          created_at?: string
          home_team_id?: string | null
          id?: string
          matchday?: number | null
          round?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          stage?: string
          status?: string
          tournament_id: string
        }
        Update: {
          away_team_id?: string | null
          bracket_slot?: number | null
          created_at?: string
          home_team_id?: string | null
          id?: string
          matchday?: number | null
          round?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          stage?: string
          status?: string
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fixtures_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fixtures_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fixtures_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          id: string
          name: string
          tournament_id: string
        }
        Insert: {
          id?: string
          name: string
          tournament_id: string
        }
        Update: {
          id?: string
          name?: string
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      player_statistics: {
        Row: {
          assists: number
          goals: number
          id: string
          motm: number
          player_name: string
          team_id: string | null
          tournament_id: string
        }
        Insert: {
          assists?: number
          goals?: number
          id?: string
          motm?: number
          player_name: string
          team_id?: string | null
          tournament_id: string
        }
        Update: {
          assists?: number
          goals?: number
          id?: string
          motm?: number
          player_name?: string
          team_id?: string | null
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_statistics_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_statistics_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
        }
        Relationships: []
      }
      ranking_settings: {
        Row: {
          id: number
          points_champion: number
          points_participation: number
          points_quarter_final: number
          points_runner_up: number
          points_semi_final: number
        }
        Insert: {
          id?: number
          points_champion?: number
          points_participation?: number
          points_quarter_final?: number
          points_runner_up?: number
          points_semi_final?: number
        }
        Update: {
          id?: number
          points_champion?: number
          points_participation?: number
          points_quarter_final?: number
          points_runner_up?: number
          points_semi_final?: number
        }
        Relationships: []
      }
      results: {
        Row: {
          away_score: number
          created_at: string
          fixture_id: string
          home_score: number
          id: string
          motm: string | null
          notes: string | null
          played_at: string
          screenshot_url: string | null
        }
        Insert: {
          away_score: number
          created_at?: string
          fixture_id: string
          home_score: number
          id?: string
          motm?: string | null
          notes?: string | null
          played_at?: string
          screenshot_url?: string | null
        }
        Update: {
          away_score?: number
          created_at?: string
          fixture_id?: string
          home_score?: number
          id?: string
          motm?: string | null
          notes?: string | null
          played_at?: string
          screenshot_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "results_fixture_id_fkey"
            columns: ["fixture_id"]
            isOneToOne: true
            referencedRelation: "fixtures"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          id: string
          is_demo: boolean
          logo_url: string | null
          manager_name: string | null
          name: string
          short_name: string
          team_color: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_demo?: boolean
          logo_url?: string | null
          manager_name?: string | null
          name: string
          short_name: string
          team_color?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_demo?: boolean
          logo_url?: string | null
          manager_name?: string | null
          name?: string
          short_name?: string
          team_color?: string
        }
        Relationships: []
      }
      tournament_teams: {
        Row: {
          created_at: string
          group_id: string | null
          id: string
          team_id: string
          tournament_id: string
        }
        Insert: {
          created_at?: string
          group_id?: string | null
          id?: string
          team_id: string
          tournament_id: string
        }
        Update: {
          created_at?: string
          group_id?: string | null
          id?: string
          team_id?: string
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_teams_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_teams_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          banner_url: string | null
          created_at: string
          description: string | null
          end_date: string | null
          format: string
          id: string
          is_demo: boolean
          logo_url: string | null
          name: string
          num_groups: number
          organizer: string
          points_draw: number
          points_loss: number
          points_win: number
          qualification_rules: string | null
          rules: string | null
          season_year: number | null
          slug: string
          start_date: string | null
          status: string
          tiebreakers: string[]
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          format?: string
          id?: string
          is_demo?: boolean
          logo_url?: string | null
          name: string
          num_groups?: number
          organizer?: string
          points_draw?: number
          points_loss?: number
          points_win?: number
          qualification_rules?: string | null
          rules?: string | null
          season_year?: number | null
          slug: string
          start_date?: string | null
          status?: string
          tiebreakers?: string[]
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          format?: string
          id?: string
          is_demo?: boolean
          logo_url?: string | null
          name?: string
          num_groups?: number
          organizer?: string
          points_draw?: number
          points_loss?: number
          points_win?: number
          qualification_rules?: string | null
          rules?: string | null
          season_year?: number | null
          slug?: string
          start_date?: string | null
          status?: string
          tiebreakers?: string[]
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
    }
    Views: {
      standings: {
        Row: {
          draws: number | null
          goal_difference: number | null
          goals_against: number | null
          goals_for: number | null
          group_id: string | null
          losses: number | null
          played: number | null
          points: number | null
          team_id: string | null
          tournament_id: string | null
          wins: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_teams_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_teams_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_tff_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "organizer"
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
      app_role: ["admin", "organizer"],
    },
  },
} as const
