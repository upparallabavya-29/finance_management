import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function purgeUser() {
    const email = 'bhavyabhavyareddy4@gmail.com';
    console.log(`--- PURGING USER: ${email} ---`);

    // 1. Find user in Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
        console.error('List Error:', listError.message);
        process.exit(1);
    }

    const user = users.find(u => u.email === email);
    if (!user) {
        console.log('User not found in Auth. Nothing to purge.');
    } else {
        console.log(`Found Auth User ID: ${user.id}. Deleting...`);
        const { error: delError } = await supabase.auth.admin.deleteUser(user.id);
        if (delError) console.error('Delete Auth Error:', delError.message);
        else console.log('Successfully deleted from Auth.');
    }

    // 2. Clear from public.users just in case
    const { error: dbError } = await supabase.from('users').delete().eq('email', email);
    if (dbError) console.error('Delete DB Error:', dbError.message);
    else console.log('Successfully cleared from public.users.');

    process.exit(0);
}
purgeUser();
