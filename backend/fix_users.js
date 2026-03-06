import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceKey) {
    console.error("Missing Service Role Key!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function syncUsers() {
    console.log("Fetching users from auth.users...");
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
        console.error("Failed to fetch auth users:", authError);
        return;
    }

    const authUsers = authData.users;
    console.log(`Found ${authUsers.length} users in Auth system.`);

    console.log("Fetching users from public.users...");
    const { data: publicUsers, error: publicError } = await supabase.from('users').select('id');

    if (publicError) {
        console.error("Failed to fetch public users:", publicError);
        return;
    }

    const publicUserIds = new Set(publicUsers.map(u => u.id));
    console.log(`Found ${publicUserIds.size} users in Public system.`);

    let syncedCount = 0;

    for (const user of authUsers) {
        if (!publicUserIds.has(user.id)) {
            console.log(`Syncing missing user: ${user.email} (${user.id})`);
            const { error: insertError } = await supabase.from('users').insert({
                id: user.id,
                email: user.email,
                first_name: user.user_metadata?.first_name || '',
                last_name: user.user_metadata?.last_name || '',
                password_hash: 'SYNCED_BY_AUTH_DO_NOT_USE'
            });

            if (insertError) {
                console.error(`Failed to insert ${user.email}:`, insertError);
            } else {
                syncedCount++;
            }
        }
    }

    console.log(`Done! Synced ${syncedCount} missing users.`);
}

syncUsers();
