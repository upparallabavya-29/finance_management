import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL?.trim()
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
const anonKey = process.env.SUPABASE_ANON_KEY?.trim()

let supabaseInstance = null
let supabaseAuthInstance = null

if (!supabaseUrl || !anonKey) {
    console.warn('⚠️ WARNING: Missing SUPABASE_URL or SUPABASE_ANON_KEY in backend/.env')
    console.warn('The application will start, but database operations will fail until credentials are provided.')
} else {
    try {
        // Use Service Role Key for backend data ops (bypasses RLS). If missing, gracefully fall back to Anon.
        supabaseInstance = createClient(supabaseUrl, serviceKey || anonKey)
        // Use Anon Key strictly for authenticating users (signIn, signUp)
        supabaseAuthInstance = createClient(supabaseUrl, anonKey)
    } catch (error) {
        console.error('Failed to initialize Supabase client:', error.message)
    }
}

export const supabase = supabaseInstance
export const supabaseAuth = supabaseAuthInstance
