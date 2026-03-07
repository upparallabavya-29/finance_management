import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../backend/.env') })

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function checkSchema() {
    try {
        console.log('Querying investments table structure...');
        const { data, error } = await supabase
            .from('investments')
            .select('*')
            .limit(1);

        if (error) {
            console.error('Schema Error:', error);
        } else {
            console.log('Table exists. Columns in first row:', data.length > 0 ? Object.keys(data[0]) : 'No data');
        }
    } catch (err) {
        console.error('Fatal:', err);
    }
}

checkSchema()
