import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const adminClient = createClient(supabaseUrl, serviceKey);

async function checkUser() {
    try {
        console.log('Checking for user: bavyaupparalla@gmail.com');
        const { data: users, error } = await adminClient.from('users').select('email, first_name, last_name, created_at').eq('email', 'bavyaupparalla@gmail.com');

        if (error) {
            console.error('Error querying users table:', error.message);
            return;
        }

        if (users && users.length > 0) {
            console.log('User found in database:', users[0]);
        } else {
            console.log('User NOT found in the users table.');
        }

    } catch (e) {
        console.error('Script Error:', e.message);
    }
}

checkUser();
