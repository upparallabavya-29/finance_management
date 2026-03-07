import { createClient } from '@supabase/supabase-js';

// Testing with an invalid API key
const supabaseUrl = 'https://ykfnzvkcqelxopnhndjw.supabase.co';
const invalidKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.invalid';

const supabase = createClient(supabaseUrl, invalidKey);

async function testInvalidKey() {
    try {
        console.log('Testing login with invalid Supabase key...');
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
