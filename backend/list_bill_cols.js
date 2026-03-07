import { supabase } from './config/supabase.js';

async function listColumns() {
    console.log('--- LISTING COLUMNS FOR bills ---');

    const columns = ['id', 'user_id', 'name', 'title', 'amount', 'due_date', 'status', 'is_recurring', 'created_at'];
    const results = {};

    for (const col of columns) {
        const { error } = await supabase.from('bills').select(col).limit(1);
        results[col] = error ? 'MISSING' : 'EXISTS';
    }

    console.log('--- COLUMN RESULTS ---');
    console.log(JSON.stringify(results, null, 2));
    console.log('--- END RESULTS ---');

    process.exit(0);
}

listColumns();
