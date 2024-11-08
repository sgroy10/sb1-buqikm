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
          username: string | null
          role: 'client' | 'designer' | 'developer' | 'manager' | 'executive'
          designation: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          username?: string | null
          role?: 'client' | 'designer' | 'developer' | 'manager' | 'executive'
          designation?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          role?: 'client' | 'designer' | 'developer' | 'manager' | 'executive'
          designation?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          category: string
          client_id: string
          professional_id: string
          delivery_date: string
          remarks: string | null
          status: 'pending' | 'active' | 'completed'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          client_id: string
          professional_id: string
          delivery_date: string
          remarks?: string | null
          status?: 'pending' | 'active' | 'completed'
          created_at?: string
        }
        Update: {
          name?: string
          category?: string
          delivery_date?: string
          remarks?: string | null
          status?: 'pending' | 'active' | 'completed'
        }
      }
      project_files: {
        Row: {
          id: string
          project_id: string
          file_name: string
          file_type: string
          file_url: string
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          file_name: string
          file_type: string
          file_url: string
          uploaded_by: string
          created_at?: string
        }
        Update: {
          file_name?: string
          file_type?: string
          file_url?: string
        }
      }
    }
  }
}