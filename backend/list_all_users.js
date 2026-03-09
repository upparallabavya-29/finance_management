import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const fs = require('fs');

async function listUsers() {
    let output = '';
    output += '--- Public Users Table ---\n';
    const { data: publicUsers, error: publicErr } = await supabase
        .from('users')
        .select('id, email, first_name, last_name');

    if (publicErr) {
        output += `Error fetching public users: ${publicErr.message}\n`;
    } else {
        output += JSON.stringify(publicUsers, null, 2) + '\n';
    }

    output += '\n--- Auth Users ---\n';
    const { data: authUsers, error: authErr } = await supabase.auth.admin.listUsers();
    if (authErr) {
        output += `Auth Admin Error: ${authErr.message}\n`;
    } else {
        const users = authUsers.users.map(u => ({
            id: u.id,
            email: u.email,
            last_sign_in: u.last_sign_in_at
        }));
        output += JSON.stringify(users, null, 2) + '\n';
    }
    fs.writeFileSync('user_list_output.txt', output);
    console.log('Output written to user_list_output.txt');
}

listUsers();
