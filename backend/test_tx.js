import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testTx() {
    console.log('Fetching a category ID...');
    const { data: catData } = await supabase.from('categories').select('id, user_id, type').limit(1);

    if (!catData || catData.length === 0) {
        console.log('No categories found.');
        return;
    }

    const cat = catData[0];
    console.log('Using category:', cat);

    const txObj = {
        user_id: cat.user_id,
        category_id: cat.id,
        amount: 50.00,
        date: '2026-03-01',
        description: 'Test housing via backend script',
        type: cat.type
    };

    console.log('Inserting transaction:', txObj);
    const { data, error } = await supabase.from('transactions').insert([txObj]).select();

    if (error) {
        console.error('Supabase Error:', error);
    } else {
        console.log('Success:', data);
    }
}

testTx();
