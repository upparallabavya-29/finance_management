// Debug: check what category_id values are in budgets vs categories vs transactions
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const userId = '782df9a9-388e-41d7-b7b1-b8b545194724'; // bhavyabhavyareddy4@gmail.com

async function debug() {
    // Check budgets raw
    const { data: budgets } = await supabase.from('budgets').select('*').eq('user_id', userId).limit(3);
    console.log('Sample budgets (raw):', JSON.stringify(budgets?.map(b => ({ id: b.id, category_id: b.category_id, amount: b.amount })), null, 2));

    // Check budgets with join
    const { data: budgetsJoined, error: joinErr } = await supabase.from('budgets').select('*, categories(id, name)').eq('user_id', userId).limit(3);
    console.log('Join error:', joinErr?.message);
    console.log('Sample budgets (joined):', JSON.stringify(budgetsJoined?.map(b => ({ id: b.id, categories: b.categories })), null, 2));

    // Check categories for this user
    const { data: cats } = await supabase.from('categories').select('*').eq('user_id', userId);
    console.log('Categories for user:', JSON.stringify(cats, null, 2));

    // Check transactions
    const { data: txs } = await supabase.from('transactions').select('category_id, type, amount').eq('user_id', userId).limit(5);
    console.log('Sample transactions:', JSON.stringify(txs, null, 2));
}

debug();
