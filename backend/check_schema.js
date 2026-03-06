import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function check() {
    console.log("Fetching live columns for 'transactions' table...");
    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/`, {
            method: 'GET',
            headers: {
                'apikey': serviceKey,
                'Authorization': `Bearer ${serviceKey}`
            }
        });
        const openapiObj = await res.json();
        const transactionsSchema = openapiObj.definitions.transactions.properties;
        console.log("Columns on transactions table:", Object.keys(transactionsSchema));
    } catch (err) {
        console.error("Error:", err);
    }
}
check();
