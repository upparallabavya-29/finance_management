import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function syncUser() {
    const email = 'bhavyabhavyareddy4@gmail.com';

    // 1. Get user from Auth
    const { data: authData, error: authErr } = await supabase.auth.admin.listUsers();
    if (authErr) return console.error('Auth DB Error:', authErr);

    const authUser = authData.users.find(u => u.email === email);
    if (!authUser) return console.log('User not found in Auth DB either.');

    console.log('User exists in Auth DB with ID:', authUser.id);

    // 2. Check public.users
    const { data: publicUser } = await supabase.from('users').select('*').eq('id', authUser.id).single();

    if (publicUser) {
        console.log('User already exists in public.users:', publicUser.id);
    } else {
        console.log('User missing from public.users! Attempting manual sync...');
        const { data, error } = await supabase.from('users').insert([{
            id: authUser.id,
            email: authUser.email,
            first_name: authUser.user_metadata?.first_name || 'Bhavya',
            last_name: authUser.user_metadata?.last_name || 'Reddy'
        }]).select();

        if (error) console.error('Failed to sync to public.users:', error);
        else console.log('Successfully synced user to public.users:', data);
    }
}

syncUser();
