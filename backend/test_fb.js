import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function test() {
    console.log("Starting test...");
    // 1. Register a test user
    const email = `test_${Date.now()}@example.com`;
    console.log("Registering:", email);
    const { data: authData, error: authErr } = await supabase.auth.signUp({
        email, password: "password123", options: { data: { first_name: "Test", last_name: "User" } }
    });
    if (authErr) return console.error("Signup err:", authErr);

    const userId = authData.user.id;
    console.log("Logged in UID:", userId);

    // Wait a brief moment to allow trigger to run
    await new Promise(res => setTimeout(res, 500));

    // 2. Check if user is in public.users
    const { data: profile, error: profErr } = await supabase.from('users').select('*').eq('id', userId);
    console.log("Public profile:", profile, "Err:", profErr);

    // 3. Try inserting category
    const { data: cat, error: catErr } = await supabase.from('categories').insert([{ user_id: userId, name: "TestCat", type: "income" }]).select();
    console.log("Insert category result:", cat, "Err:", catErr);
}
test();
