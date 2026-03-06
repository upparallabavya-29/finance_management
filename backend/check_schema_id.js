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

async function check() {
    console.log("Checking transactions schema again...");
    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/`, {
            method: 'GET',
            headers: {
                'apikey': serviceKey,
                'Authorization': `Bearer ${serviceKey}`,
                // Extremely aggressive headers to break cache
                'Accept-Profile': 'public, public',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        });
        const openapiObj = await res.json();

        if (!openapiObj?.definitions?.transactions?.properties) {
            console.error("Could not read definitions from OpenAPI.");
            return;
        }

        const cols = Object.keys(openapiObj.definitions.transactions.properties);
        console.log("Current cached columns on transactions table:", cols);

        if (!cols.includes('category_id')) {
            console.log("CACHE IS STALE! The API still does not see category_id.");
            console.log("Attempting SQL cache flush via query manipulation...");

            // Often, adding or removing a comment on a table forces PostgREST to reload
            const { error: rpcErr } = await supabase.rpc('pg_reload_conf');

            // And triggering another head request
            await fetch(`${supabaseUrl}/rest/v1/`, {
                method: 'HEAD',
                headers: {
                    'apikey': serviceKey,
                    'Authorization': `Bearer ${serviceKey}`
                }
            });

            console.log("Cache reload triggered. You may need to wait 60 seconds for Supabase to apply it.");
        } else {
            console.log("SUCCESS: The cache correctly sees category_id!");
        }

    } catch (err) {
        console.error("Error:", err);
    }
}
check();
