import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Testing Keys...');
console.log('URL:', supabaseUrl);

async function test() {
    try {
        const client = createClient(supabaseUrl, anonKey);
        const { data, error } = await client.from('users').select('*').limit(1);
        if (error) {
            console.error('Anon Key Error:', error.message);
        } else {
            console.log('Anon Key Success!');
        }

        const adminClient = createClient(supabaseUrl, serviceKey);
        const { data: adminData, error: adminError } = await adminClient.from('users').select('*').limit(1);
        if (adminError) {
            console.error('Service Key Error:', adminError.message);
        } else {
            console.log('Service Key Success!');
        }

        console.log('Testing Auth Client...');
        const { data: authData, error: authError } = await client.auth.signInWithPassword({
            email: 'test@example.com',
            password: 'wrongpassword'
        });

        if (authError) {
            console.log('Auth Client Error (Expected if wrong password, but should not be "Invalid API key"):', authError.message);
        } else {
            console.log('Auth Client Success (Unlikely with wrong password)');
        }
    } catch (e) {
        console.error('Script Error:', e.message);
    }
}

test();
