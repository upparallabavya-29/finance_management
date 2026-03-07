import { supabase } from './config/supabase.js';

async function checkUser() {
    console.log('--- CHECKING USER PROFILE ---');
    const email = 'bhavyabhavyareddy4@gmail.com';
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email);

    if (error) {
        console.error('Error fetching user profile:', error.message);
    } else {
        console.log('Profile count found:', data.length);
        if (data.length > 0) {
            console.log('User ID:', data[0].id);
        } else {
            console.log('NO PROFILE FOUND in public.users for this email.');
        }
    }
    process.exit(0);
}
checkUser();
