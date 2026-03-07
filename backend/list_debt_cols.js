import { supabase } from './config/supabase.js';

async function listColumns() {
    console.log('--- LISTING COLUMNS FOR debts ---');

    const columns = ['id', 'user_id', 'name', 'title', 'lender_name', 'total_amount', 'principal_amount', 'balance', 'remaining_balance', 'remaining_amount', 'due_date', 'created_at'];
    const results = {};

    for (const col of columns) {
        const { error } = await supabase.from('debts').select(col).limit(1);
        results[col] = error ? 'MISSING' : 'EXISTS';
    }

    console.log('--- COLUMN RESULTS ---');
    console.log(JSON.stringify(results, null, 2));
    console.log('--- END RESULTS ---');

    process.exit(0);
}

listColumns();
