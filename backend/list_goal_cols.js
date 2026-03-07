import { supabase } from './config/supabase.js';

async function listColumns() {
    console.log('--- LISTING COLUMNS FOR savings_goals ---');

    // Attempt to select from savings_goals and inspect error if any
    // or just try common names
    const columns = ['id', 'user_id', 'name', 'title', 'target_amount', 'current_amount', 'target_date', 'deadline', 'created_at', 'updated_at'];

    for (const col of columns) {
        const { error } = await supabase.from('savings_goals').select(col).limit(1);
        if (error) {
            console.log(`Column [${col}] does NOT exist. Error: ${error.message}`);
        } else {
            console.log(`Column [${col}] EXISTS.`);
        }
    }

    process.exit(0);
}

listColumns();
