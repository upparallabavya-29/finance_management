// Direct inspection of budgets table for userId
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const userId = '782df9a9-388e-41d7-b7b1-b8b545194724';

async function debug() {
    const { data: budgets, error } = await supabase.from('budgets').select('*').eq('user_id', userId);
    if (error) { console.error(error); return; }
    console.log('Total budgets:', budgets?.length);
    if (budgets?.length) {
        budgets.forEach((b, i) => {
            console.log(`Budget ${i + 1}:`, JSON.stringify(b));
        });
    }

    // Also check all distinct user_ids in budgets to see if wrong userId is used
    const { data: allBudgets } = await supabase.from('budgets').select('user_id').limit(20);
    const distinctUsers = [...new Set(allBudgets?.map(b => b.user_id))];
    console.log('\nDistinct user_ids in budgets table:', distinctUsers);
}

debug();
