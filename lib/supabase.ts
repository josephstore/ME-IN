import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jltnvoyjnzlswsmddojf.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsdG52b3lqbnpsc3dzbWRkb2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzODk5MjQsImV4cCI6MjA3MDk2NTkyNH0.5blt8JeShSgBA50l5bcE30Um1nGlYJAl685XBdVrqdg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth types
export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    name?: string
    user_type?: 'brand' | 'influencer'
    language?: string[]
    timezone?: string
  }
  created_at: string
  updated_at: string
}

export interface AuthError {
  message: string
  status?: number
}
