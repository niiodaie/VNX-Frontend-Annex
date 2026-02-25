import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eojnpjnlvscxtboimhln.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvam5wam5sdnNjeHRib2ltaGxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExOTc1NDQsImV4cCI6MjA2Njc3MzU0NH0.gZPBJ2RpQRv6qZIZatD_N5Cf_LQmezxN6NNLibu5zyU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const isSupabaseConfigured = () => {
  return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
}