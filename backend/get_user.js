import { supabase } from '../config/supabase.js';

async function getUser() {
    const { data, error } = await supabase.from('users').select('id, email').limit(1);
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('User:', data[0]);
    }
    process.exit();
}
getUser();
