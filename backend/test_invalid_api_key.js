import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ykfnzvkcqelxopnhndjw.supabase.co';
const newlineKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrZm56dmtjcWVseG9wbmhuZGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4ODIyMzIsImV4cCI6MjA4NzQ1ODIzMn0\n.ftYAbj3kQ8hlG73PQjzVpc8BZAQK2CU5udpBf_3XTDs';

const supabase = createClient(supabaseUrl, newlineKey);

async function testInvalidKey() {
    try {
        console.log('Testing login with newline in Supabase key...');
        const { error } = await supabase.auth.signInWithPassword({
            email: 'bavyaupparalla@gmail.com',
            password: 'password123'
        });

        if (error) {
            console.log('Error returned by Supabase:', error.message);
        } else {
            console.log('Login succeeded (unexpected)');
        }
    } catch (e) {
        console.error('Exception caught:', e);
    }
}

testInvalidKey();
