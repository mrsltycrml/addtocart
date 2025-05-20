import { createClient } from '@supabase/supabase-js'

export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables are not set.')
  }
  return createClient(supabaseUrl, supabaseKey)
}

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