import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function renameColumn() {
    console.log('--- ATTEMPTING TO RENAME COLUMN ---');

    // We try to use the rpc 'exec_sql' if it exists.
    // This is a common pattern in some Supabase projects for migrations.
    const { data, error } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE public.savings_goals RENAME COLUMN name TO title;'
    });

    if (error) {
        console.error('Error executing SQL via RPC:', error.message);
        console.log('Hint: The "exec_sql" function might not exist in this project.');
    } else {
        console.log('Successfully renamed column!');
    }
    process.exit(0);
}

renameColumn();
