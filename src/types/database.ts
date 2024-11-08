export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string
          role: 'client' | 'developer' | 'team_manager' | 'executive'
          designation: string
          company: string
          phone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          role: 'client' | 'developer' | 'team_manager' | 'executive'
          designation: string
          company: string
          phone: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          role?: 'client' | 'developer' | 'team_manager' | 'executive'
          designation?: string
          company?: string
          phone?: string
          updated_at?: string
        }
      }
      connections: {
        Row: {
          id: string
          client_id: string
          professional_id: string
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          professional_id: string
          category: string
          created_at?: string
        }
        Update: {
          client_id?: string
          professional_id?: string
          category?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          category: string
          client_id: string
          assigned_to: string
          status: 'pending' | 'active' | 'completed'
          delivery_date: string
          remarks: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          client_id: string
          assigned_to: string
          status?: 'pending' | 'active' | 'completed'
          delivery_date: string
          remarks?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          category?: string
          assigned_to?: string
          status?: 'pending' | 'active' | 'completed'
          delivery_date?: string
          remarks?: string | null
          updated_at?: string
        }
      }
      project_files: {
        Row: {
          id: string
          project_id: string
          name: string
          file_path: string
          size: number
          type: string
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          file_path: string
          size: number
          type: string
          uploaded_by: string
          created_at?: string
        }
        Update: {
          name?: string
          file_path?: string
          size?: number
          type?: string
        }
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
  }
}