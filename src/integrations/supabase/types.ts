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
      applications: {
        Row: {
          created_at: string
          email: string
          expedition_date_id: string | null
          expedition_id: string
          first_name: string
          id: string
          last_name: string
          linkedin_url: string | null
          motivation_text: string
          nationality: string
          phone: string
          physical_condition: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          expedition_date_id?: string | null
          expedition_id: string
          first_name: string
          id?: string
          last_name: string
          linkedin_url?: string | null
          motivation_text: string
          nationality: string
          phone: string
          physical_condition: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          expedition_date_id?: string | null
          expedition_id?: string
          first_name?: string
          id?: string
          last_name?: string
          linkedin_url?: string | null
          motivation_text?: string
          nationality?: string
          phone?: string
          physical_condition?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_expedition_date_id_fkey"
            columns: ["expedition_date_id"]
            isOneToOne: false
            referencedRelation: "expedition_dates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_expedition_id_fkey"
            columns: ["expedition_id"]
            isOneToOne: false
            referencedRelation: "expeditions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_applications_expedition"
            columns: ["expedition_id"]
            isOneToOne: false
            referencedRelation: "expeditions"
            referencedColumns: ["id"]
          },
        ]
      }
      expedition_dates: {
        Row: {
          capacity_max: number
          created_at: string
          end_date: string
          expedition_id: string
          id: string
          spots_taken: number
          start_date: string
          status: string
        }
        Insert: {
          capacity_max?: number
          created_at?: string
          end_date: string
          expedition_id: string
          id?: string
          spots_taken?: number
          start_date: string
          status?: string
        }
        Update: {
          capacity_max?: number
          created_at?: string
          end_date?: string
          expedition_id?: string
          id?: string
          spots_taken?: number
          start_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "expedition_dates_expedition_id_fkey"
            columns: ["expedition_id"]
            isOneToOne: false
            referencedRelation: "expeditions"
            referencedColumns: ["id"]
          },
        ]
      }
      expedition_days_itinerary: {
        Row: {
          day_number: number
          description: string
          expedition_id: string
          id: string
          title: string
        }
        Insert: {
          day_number: number
          description: string
          expedition_id: string
          id?: string
          title: string
        }
        Update: {
          day_number?: number
          description?: string
          expedition_id?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "expedition_days_itinerary_expedition_id_fkey"
            columns: ["expedition_id"]
            isOneToOne: false
            referencedRelation: "expeditions"
            referencedColumns: ["id"]
          },
        ]
      }
      expedition_exclusions: {
        Row: {
          expedition_id: string
          id: string
          item_text: string
        }
        Insert: {
          expedition_id: string
          id?: string
          item_text: string
        }
        Update: {
          expedition_id?: string
          id?: string
          item_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "expedition_exclusions_expedition_id_fkey"
            columns: ["expedition_id"]
            isOneToOne: false
            referencedRelation: "expeditions"
            referencedColumns: ["id"]
          },
        ]
      }
      expedition_gallery: {
        Row: {
          created_at: string
          display_order: number
          expedition_id: string
          id: string
          image_url: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          expedition_id: string
          id?: string
          image_url: string
        }
        Update: {
          created_at?: string
          display_order?: number
          expedition_id?: string
          id?: string
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "expedition_gallery_expedition_id_fkey"
            columns: ["expedition_id"]
            isOneToOne: false
            referencedRelation: "expeditions"
            referencedColumns: ["id"]
          },
        ]
      }
      expedition_inclusions: {
        Row: {
          expedition_id: string
          id: string
          item_text: string
        }
        Insert: {
          expedition_id: string
          id?: string
          item_text: string
        }
        Update: {
          expedition_id?: string
          id?: string
          item_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "expedition_inclusions_expedition_id_fkey"
            columns: ["expedition_id"]
            isOneToOne: false
            referencedRelation: "expeditions"
            referencedColumns: ["id"]
          },
        ]
      }
      expeditions: {
        Row: {
          cancellation_reason: string | null
          capacity_max: number
          continent: string
          coordinates: Json | null
          country: string
          created_at: string
          difficulty_level: string
          duration_days: number
          end_date: string
          expedition_status: string
          hero_image_url: string | null
          id: string
          intensity_level: string
          intensity_type: string
          location: string
          long_description: string
          name: string
          price_eur: number
          price_usd: number
          short_description: string
          slug: string
          spots_taken: number
          start_date: string
          status: string
          storytelling: string | null
        }
        Insert: {
          cancellation_reason?: string | null
          capacity_max?: number
          continent?: string
          coordinates?: Json | null
          country?: string
          created_at?: string
          difficulty_level?: string
          duration_days: number
          end_date: string
          expedition_status?: string
          hero_image_url?: string | null
          id?: string
          intensity_level: string
          intensity_type?: string
          location: string
          long_description: string
          name: string
          price_eur: number
          price_usd?: number
          short_description: string
          slug: string
          spots_taken?: number
          start_date: string
          status?: string
          storytelling?: string | null
        }
        Update: {
          cancellation_reason?: string | null
          capacity_max?: number
          continent?: string
          coordinates?: Json | null
          country?: string
          created_at?: string
          difficulty_level?: string
          duration_days?: number
          end_date?: string
          expedition_status?: string
          hero_image_url?: string | null
          id?: string
          intensity_level?: string
          intensity_type?: string
          location?: string
          long_description?: string
          name?: string
          price_eur?: number
          price_usd?: number
          short_description?: string
          slug?: string
          spots_taken?: number
          start_date?: string
          status?: string
          storytelling?: string | null
        }
        Relationships: []
      }
      hero_images: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string
          is_active: boolean
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
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
      waitlist: {
        Row: {
          created_at: string
          email: string
          expedition_date_id: string | null
          expedition_id: string
          first_name: string
          id: string
          last_name: string
          nationality: string
          number_of_people: number
        }
        Insert: {
          created_at?: string
          email: string
          expedition_date_id?: string | null
          expedition_id: string
          first_name: string
          id?: string
          last_name: string
          nationality: string
          number_of_people?: number
        }
        Update: {
          created_at?: string
          email?: string
          expedition_date_id?: string | null
          expedition_id?: string
          first_name?: string
          id?: string
          last_name?: string
          nationality?: string
          number_of_people?: number
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_expedition_date_id_fkey"
            columns: ["expedition_date_id"]
            isOneToOne: false
            referencedRelation: "expedition_dates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waitlist_expedition_id_fkey"
            columns: ["expedition_id"]
            isOneToOne: false
            referencedRelation: "expeditions"
            referencedColumns: ["id"]
          },
        ]
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
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
