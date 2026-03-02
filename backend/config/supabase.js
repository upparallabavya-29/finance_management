import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
// Use the Service Role Key since the backend acts as a trusted admin
// and handles auth verification independently via the 'protect' middleware
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

let supabaseInstance = null

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ WARNING: Missing SUPABASE_URL or SUPABASE_KEY in backend/.env')
    console.warn('The application will start, but database operations will fail until credentials are provided.')
} else {
    try {
        supabaseInstance = createClient(supabaseUrl, supabaseKey)
    } catch (error) {
        console.error('Failed to initialize Supabase client:', error.message)
    }
}

export const supabase = supabaseInstance
