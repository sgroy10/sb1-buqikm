export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          username: string;
          role: string;
          designation: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          username: string;
          role: string;
          designation: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          role?: string;
          designation?: string;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_by: string;
          assigned_to: string;
          status: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_by: string;
          assigned_to: string;
          status?: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_by?: string;
          assigned_to?: string;
          status?: string;
          created_at?: string;
          updated_at?: string | null;
        };
      };
    };
  };
}