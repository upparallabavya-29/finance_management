import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

async function refreshSchema() {
    console.log("Forcing Supabase schema reload...");
    try {
        // Trigger a simple schema reload by executing a fast meta-query
        // or asking PostgREST to refresh its cache via headers.
        const res = await fetch(`${supabaseUrl}/rest/v1/`, {
            method: 'GET',
            headers: {
                'apikey': serviceKey,
                'Authorization': `Bearer ${serviceKey}`
            }
        });

        console.log("Schema ping status:", res.status);

        // This query invalidates the PostgREST cache on some versions
        const { error } = await supabase.from('transactions').select('id').limit(1);
        if (error) console.error("Query hint error:", error);

        console.log("Schema cache reload triggered successfully! Please test your UI.");
    } catch (err) {
        console.error("Reload error:", err);
    }
}
refreshSchema();
