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
      User: {
        Row: {
          id: string
          email: string
          firstName: string | null
          lastName: string | null
          role: 'BUYER' | 'SELLER' | 'BOTH'
          field: string | null
          techStack: string[]
          avatar: string | null
          createdAt: string
        }
        Insert: {
          id: string
          email: string
          firstName?: string | null
          lastName?: string | null
          role?: 'BUYER' | 'SELLER' | 'BOTH'
          field?: string | null
          techStack?: string[]
          avatar?: string | null
          createdAt?: string
        }
        Update: {
          id?: string
          email?: string
          firstName?: string | null
          lastName?: string | null
          role?: 'BUYER' | 'SELLER' | 'BOTH'
          field?: string | null
          techStack?: string[]
          avatar?: string | null
          createdAt?: string
        }
      }
      Project: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          price: number
          techStack: string[]
          demoUrl: string | null
          thumbnail: string | null
          sourceFile: string | null
          creatorId: string
          status: 'PENDING' | 'APPROVED' | 'REJECTED'
          createdAt: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          price: number
          techStack?: string[]
          demoUrl?: string | null
          thumbnail?: string | null
          sourceFile?: string | null
          creatorId: string
          status?: 'PENDING' | 'APPROVED' | 'REJECTED'
          createdAt?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          price?: number
          techStack?: string[]
          demoUrl?: string | null
          thumbnail?: string | null
          sourceFile?: string | null
          creatorId?: string
          status?: 'PENDING' | 'APPROVED' | 'REJECTED'
          createdAt?: string
        }
      }
      Purchase: {
        Row: {
          id: string
          amount: number
          status: string
          projectId: string | null
          buyerId: string | null
          createdAt: string
        }
        Insert: {
          id?: string
          amount: number
          status?: string
          projectId?: string | null
          buyerId?: string | null
          createdAt?: string
        }
        Update: {
          id?: string
          amount?: number
          status?: string
          projectId?: string | null
          buyerId?: string | null
          createdAt?: string
        }
      }
      Message: {
        Row: {
          id: string
          content: string
          senderId: string | null
          receiverId: string | null
          createdAt: string
        }
        Insert: {
          id?: string
          content: string
          senderId?: string | null
          receiverId?: string | null
          createdAt?: string
        }
        Update: {
          id?: string
          content?: string
          senderId?: string | null
          receiverId?: string | null
          createdAt?: string
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
