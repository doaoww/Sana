import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  vendor_id: string;
  name: string;
  category: string;
  description: string;
  original_price: number;
  discounted_price: number;
  quantity: number;
  expiry_time: string;
  image_url: string;
  location: { lat: number; lng: number } | string | null;
  created_at: string;
  distance?: number;
  vendor_name?: string;
};
