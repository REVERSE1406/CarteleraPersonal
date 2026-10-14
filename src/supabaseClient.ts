import { createClient } from '@supabase/supabase-js'

// Solo URL y anon key públicas. Nunca uses service_role en el cliente.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. Copia .env.example a .env y completa las claves.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
