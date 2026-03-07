import { supabase } from './config/supabase.js';

async function listTables() {
    console.log('--- LISTING ACCESSIBLE TABLES ---');
    // We can't list all tables easily without RPC, but we can try to query common names
    const tables = ['users', 'categories', 'transactions', 'budgets', 'savings_goals', 'bills', 'debts', 'investments', 'assets', 'portfolio'];
    for (const t of tables) {
        const { error } = await supabase.from(t).select('*').limit(0);
        if (!error) console.log(`Table exists: ${t}`);
        else if (error.code !== 'PGRST116' && error.code !== '42P01') console.log(`Table ${t} might exist but gave error: ${error.message}`);
    }
    process.exit(0);
}
listTables();
