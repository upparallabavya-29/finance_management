// Deep debug: check all categories table (no user filter) and match with budget category_ids
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const userId = '782df9a9-388e-41d7-b7b1-b8b545194724';

async function debug() {
    const { data: budgets } = await supabase.from('budgets').select('id, category_id, amount').eq('user_id', userId);
    console.log('Budget category_ids:', budgets?.map(b => b.category_id));

    // Check categories with those specific IDs
    const catIds = budgets?.map(b => b.category_id).filter(Boolean);
    if (catIds?.length) {
        const { data: cats, error } = await supabase.from('categories').select('*').in('id', catIds);
        console.log('Categories error:', error?.message);
        console.log('Matching categories:', cats);
    }
}

debug();
