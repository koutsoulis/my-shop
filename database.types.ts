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
      basket: {
        Row: {
          id: number
          number: number
          owner_id: string
          product_id: string
        }
        Insert: {
          id?: number
          number: number
          owner_id: string
          product_id: string
        }
        Update: {
          id?: number
          number?: number
          owner_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "basket_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "basket_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      basket_movies: {
        Row: {
          id: number
          movie_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          id?: number
          movie_id: string
          quantity: number
          user_id: string
        }
        Update: {
          id?: number
          movie_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "basket_movies_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["opensearch_id"]
          },
          {
            foreignKeyName: "basket_movies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      movies: {
        Row: {
          image_url: string | null
          opensearch_id: string
          title: string
          year: number | null
        }
        Insert: {
          image_url?: string | null
          opensearch_id: string
          title: string
          year?: number | null
        }
        Update: {
          image_url?: string | null
          opensearch_id?: string
          title?: string
          year?: number | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          movie_opensearch_id: string
          order_id: number
          quantity: number
        }
        Insert: {
          movie_opensearch_id: string
          order_id: number
          quantity: number
        }
        Update: {
          movie_opensearch_id?: string
          order_id?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_movie_opensearch_id_fkey"
            columns: ["movie_opensearch_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["opensearch_id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          id: number
          order_timestamp: string | null
          stripe_payment_id: string | null
          stripe_receipt_url: string | null
          user_id: string | null
        }
        Insert: {
          id?: never
          order_timestamp?: string | null
          stripe_payment_id?: string | null
          stripe_receipt_url?: string | null
          user_id?: string | null
        }
        Update: {
          id?: never
          order_timestamp?: string | null
          stripe_payment_id?: string | null
          stripe_receipt_url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          id: string
          name: string
          price_euro_cents: number
        }
        Insert: {
          id?: string
          name: string
          price_euro_cents: number
        }
        Update: {
          id?: string
          name?: string
          price_euro_cents?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_movie_to_user_basket: {
        Args: {
          user_id_input: string
          movie_id_input: string
        }
        Returns: number
      }
      buy_movie: {
        Args: {
          session_id: string
          movie_title_input: string
          image_url_input: string
        }
        Returns: undefined
      }
      get_movies_in_user_basket: {
        Args: {
          user_id_arg: string
        }
        Returns: {
          opensearch_id: string
          year: number
          image_url: string
          title: string
          quantity: number
        }[]
      }
      get_user_by_session: {
        Args: {
          session_id: string
        }
        Returns: string
      }
      move_basket_to_order: {
        Args: {
          user_id_arg: string
          stripe_payment_id_arg: string
        }
        Returns: {
          order_id: number
        }[]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
