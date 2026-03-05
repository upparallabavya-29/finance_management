import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function testAuth() {
    console.log('Testing with ANON KEY...');
    const anonSupabase = createClient(supabaseUrl, anonKey);
    const { data: anonData, error: anonErr } = await anonSupabase.auth.signInWithPassword({
        email: 'bhavyabhavyareddy4@gmail.com',
        password: 'password123'
    });
    console.log('Anon Error:', anonErr ? anonErr.message : 'Success!');

    console.log('\nTesting with SERVICE ROLE KEY...');
    const serviceSupabase = createClient(supabaseUrl, serviceKey);
    const { data: srvData, error: srvErr } = await serviceSupabase.auth.signInWithPassword({
        email: 'bhavyabhavyareddy4@gmail.com',
        password: 'password123'
    });
    console.log('Service Role Error:', srvErr ? srvErr.message : 'Success!');
}

testAuth();
