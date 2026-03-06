import { supabase } from './config/supabase.js';
import dotenv from 'dotenv';
dotenv.config();

async function debug() {
    // Get all budgets with their user_ids
    const { data: budgets, error } = await supabase
        .from('budgets')
        .select('id, user_id, amount, period');

    console.log('BUDGET ERROR:', error?.message || 'none');
    console.log('BUDGET COUNT:', budgets?.length);

    budgets?.forEach(b => console.log(`  Budget user_id=${b.user_id} amount=${b.amount} period=${b.period}`));

    // Get all users
    const { data: users } = await supabase
        .from('users')
        .select('id, email');

    console.log('\nUSERS:');
    users?.forEach(u => console.log(`  User id=${u.id} email=${u.email}`));

    // Now test matching
    if (budgets?.length && users?.length) {
        const userId = users[0].id;
        const matched = budgets.filter(b => b.user_id === userId);
        console.log(`\nBudgets matching first user (${userId}):`, matched.length);
    }
}

debug();
