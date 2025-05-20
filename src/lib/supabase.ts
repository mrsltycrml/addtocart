import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export const getSupabaseClient = () => supabase

// Types for our database tables
export type Product = {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  created_at: string
  category?: string
  dataAiHint?: string
}

export type CartItem = {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
}

export type PurchaseHistory = {
  id: string
  user_id: string
  product_id: string
  quantity: number
  total_price: number
  purchase_date: string
  status?: string
} 