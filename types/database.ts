export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      access_requests: {
        Row: {
          attempt_count: number;
          brand_link: string | null;
          created_at: string | null;
          email: string;
          full_name: string;
          id: string;
          invite_code: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          social_handle: string | null;
          status: Database['public']['Enums']['access_request_status'];
        };
        Insert: {
          attempt_count?: number;
          brand_link?: string | null;
          created_at?: string | null;
          email: string;
          full_name: string;
          id?: string;
          invite_code?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          social_handle?: string | null;
          status?: Database['public']['Enums']['access_request_status'];
        };
        Update: {
          attempt_count?: number;
          brand_link?: string | null;
          created_at?: string | null;
          email?: string;
          full_name?: string;
          id?: string;
          invite_code?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          social_handle?: string | null;
          status?: Database['public']['Enums']['access_request_status'];
        };
        Relationships: [
          {
            foreignKeyName: 'access_requests_invite_code_fkey';
            columns: ['invite_code'];
            isOneToOne: false;
            referencedRelation: 'invitations';
            referencedColumns: ['code'];
          },
          {
            foreignKeyName: 'access_requests_reviewed_by_fkey';
            columns: ['reviewed_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      exchanges: {
        Row: {
          created_at: string;
          id: string;
          initiator_note: string | null;
          initiator_profile_id: string | null;
          initiator_shared_fields: Json;
          recipient_profile_id: string;
          recipient_shared_fields: Json | null;
          status: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          initiator_note?: string | null;
          initiator_profile_id?: string | null;
          initiator_shared_fields?: Json;
          recipient_profile_id: string;
          recipient_shared_fields?: Json | null;
          status?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          initiator_note?: string | null;
          initiator_profile_id?: string | null;
          initiator_shared_fields?: Json;
          recipient_profile_id?: string;
          recipient_shared_fields?: Json | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'exchanges_initiator_profile_id_fkey';
            columns: ['initiator_profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exchanges_recipient_profile_id_fkey';
            columns: ['recipient_profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      invitations: {
        Row: {
          code: string;
          created_at: string | null;
          expires_at: string | null;
          id: string;
          invitee_email: string | null;
          inviter_id: string | null;
          used_at: string | null;
          used_by: string | null;
        };
        Insert: {
          code: string;
          created_at?: string | null;
          expires_at?: string | null;
          id?: string;
          invitee_email?: string | null;
          inviter_id?: string | null;
          used_at?: string | null;
          used_by?: string | null;
        };
        Update: {
          code?: string;
          created_at?: string | null;
          expires_at?: string | null;
          id?: string;
          invitee_email?: string | null;
          inviter_id?: string | null;
          used_at?: string | null;
          used_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'invitations_inviter_id_fkey';
            columns: ['inviter_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'invitations_used_by_fkey';
            columns: ['used_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      portfolio_images: {
        Row: {
          created_at: string | null;
          id: string;
          position: number;
          profile_id: string;
          url: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          position?: number;
          profile_id: string;
          url: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          position?: number;
          profile_id?: string;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'portfolio_images_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profile_components: {
        Row: {
          ai_generated: boolean;
          created_at: string | null;
          data: Json;
          id: string;
          is_predefined: boolean;
          is_visible: boolean;
          position: number;
          profile_id: string | null;
          type: string;
          updated_at: string | null;
        };
        Insert: {
          ai_generated?: boolean;
          created_at?: string | null;
          data?: Json;
          id?: string;
          is_predefined?: boolean;
          is_visible?: boolean;
          position?: number;
          profile_id?: string | null;
          type: string;
          updated_at?: string | null;
        };
        Update: {
          ai_generated?: boolean;
          created_at?: string | null;
          data?: Json;
          id?: string;
          is_predefined?: boolean;
          is_visible?: boolean;
          position?: number;
          profile_id?: string | null;
          type?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_components_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          brand_statement: string | null;
          created_at: string | null;
          cta_buttons: string[] | null;
          full_name: string | null;
          has_seen_tour: boolean;
          id: string;
          invite_code: string;
          invited_by: string | null;
          invites_remaining: number;
          is_admin: boolean;
          is_published: boolean | null;
          location: string | null;
          logo_url: string | null;
          membership_type: Database['public']['Enums']['membership_type'] | null;
          palette: Database['public']['Enums']['profile_palette'] | null;
          profile_complete: boolean | null;
          recommended_by: string[];
          role: string | null;
          social_links: Json;
          style: Database['public']['Enums']['profile_style'] | null;
          testimonials: Json;
          updated_at: string | null;
          user_id: string;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          brand_statement?: string | null;
          created_at?: string | null;
          cta_buttons?: string[] | null;
          full_name?: string | null;
          has_seen_tour?: boolean;
          id?: string;
          invite_code?: string;
          invited_by?: string | null;
          invites_remaining?: number;
          is_admin?: boolean;
          is_published?: boolean | null;
          location?: string | null;
          logo_url?: string | null;
          membership_type?: Database['public']['Enums']['membership_type'] | null;
          palette?: Database['public']['Enums']['profile_palette'] | null;
          profile_complete?: boolean | null;
          recommended_by?: string[];
          role?: string | null;
          social_links?: Json;
          style?: Database['public']['Enums']['profile_style'] | null;
          testimonials?: Json;
          updated_at?: string | null;
          user_id: string;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          brand_statement?: string | null;
          created_at?: string | null;
          cta_buttons?: string[] | null;
          full_name?: string | null;
          has_seen_tour?: boolean;
          id?: string;
          invite_code?: string;
          invited_by?: string | null;
          invites_remaining?: number;
          is_admin?: boolean;
          is_published?: boolean | null;
          location?: string | null;
          logo_url?: string | null;
          membership_type?: Database['public']['Enums']['membership_type'] | null;
          palette?: Database['public']['Enums']['profile_palette'] | null;
          profile_complete?: boolean | null;
          recommended_by?: string[];
          role?: string | null;
          social_links?: Json;
          style?: Database['public']['Enums']['profile_style'] | null;
          testimonials?: Json;
          updated_at?: string | null;
          user_id?: string;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_invited_by_fkey';
            columns: ['invited_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      vault_contacts: {
        Row: {
          city: string | null;
          created_at: string | null;
          email: string | null;
          id: string;
          instagram: string | null;
          linkedin_url: string | null;
          name: string;
          notes: string | null;
          phone: string | null;
          photo_url: string | null;
          profile_id: string | null;
          role: string | null;
          tiktok: string | null;
          updated_at: string | null;
          user_id: string;
          website: string | null;
          youtube: string | null;
        };
        Insert: {
          city?: string | null;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          instagram?: string | null;
          linkedin_url?: string | null;
          name: string;
          notes?: string | null;
          phone?: string | null;
          photo_url?: string | null;
          profile_id?: string | null;
          role?: string | null;
          tiktok?: string | null;
          updated_at?: string | null;
          user_id: string;
          website?: string | null;
          youtube?: string | null;
        };
        Update: {
          city?: string | null;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          instagram?: string | null;
          linkedin_url?: string | null;
          name?: string;
          notes?: string | null;
          phone?: string | null;
          photo_url?: string | null;
          profile_id?: string | null;
          role?: string | null;
          tiktok?: string | null;
          updated_at?: string | null;
          user_id?: string;
          website?: string | null;
          youtube?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'vault_contacts_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      accept_exchange: { Args: { p_exchange_id: string }; Returns: undefined };
      create_guest_exchange: {
        Args: {
          p_initiator_fields: Json;
          p_note?: string;
          p_recipient_profile_id: string;
        };
        Returns: boolean;
      };
      get_has_exchanged: { Args: { p_profile_id: string }; Returns: boolean };
      mark_invite_used: {
        Args: { p_code: string; p_user_id: string };
        Returns: undefined;
      };
      merge_component_data: {
        Args: { p_component_id: string; p_patch: Json };
        Returns: {
          ai_generated: boolean;
          created_at: string | null;
          data: Json;
          id: string;
          is_predefined: boolean;
          is_visible: boolean;
          position: number;
          profile_id: string | null;
          type: string;
          updated_at: string | null;
        };
        SetofOptions: {
          from: '*';
          to: 'profile_components';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      perform_exchange: {
        Args: {
          p_initiator_fields?: Json;
          p_note?: string;
          p_recipient_email?: string;
          p_recipient_instagram?: string;
          p_recipient_name: string;
          p_recipient_phone?: string;
          p_recipient_photo_url?: string;
          p_recipient_profile_id: string;
          p_recipient_role?: string;
          p_recipient_tiktok?: string;
          p_recipient_website?: string;
          p_recipient_youtube?: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      access_request_status: 'pending' | 'approved' | 'rejected';
      exchange_request_status: 'pending' | 'seen' | 'archived';
      membership_type: 'guest' | 'member';
      profile_palette: 'blanc' | 'noir';
      profile_style: 'visual' | 'editorial';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      access_request_status: ['pending', 'approved', 'rejected'],
      exchange_request_status: ['pending', 'seen', 'archived'],
      membership_type: ['guest', 'member'],
      profile_palette: ['blanc', 'noir'],
      profile_style: ['visual', 'editorial'],
    },
  },
} as const;
