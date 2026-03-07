import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../backend/.env') })

const supabaseUrl = process.env.SUPABASE_URL
const anonKey = process.env.SUPABASE_ANON_KEY

console.log('URL:', supabaseUrl)
console.log('Key length:', anonKey?.length)

const supabase = createClient(supabaseUrl, anonKey)

async function test() {
    try {
        console.log('Attempting signUp...')
        const { data, error } = await supabase.auth.signUp({
            email: `test${Date.now()}@example.com`,
            password: 'password123'
        })
        if (error) {
            console.error('Supabase Error:', error)
        } else {
            console.log('Success:', data.user?.id)
        }
    } catch (err) {
        console.error('Fatal Error:', err)
    }
}

test()
