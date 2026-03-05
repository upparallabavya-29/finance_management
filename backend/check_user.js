import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

async function checkUser() {
    const email = 'bhavyabhavyareddy4@gmail.com';

    // Check public.users
    const { data: publicUser, error: publicErr } = await supabase
        .from('users')
        .select('*')
        .eq('email', email);

    console.log('Public Users Table:', publicUser);

    // Try to list users from the auth schema via admin API
    const { data: authUsers, error: authErr } = await supabase.auth.admin.listUsers();
    if (authErr) {
        console.error('Auth Admin Error:', authErr.message);
    } else {
        const user = authUsers.users.find(u => u.email === email);
        console.log('Auth Users Table found:', user ? 'YES' : 'NO', user);
    }
}

checkUser();
