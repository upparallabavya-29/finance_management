import { supabase } from './config/supabase.js';

async function discover() {
    console.log('--- DATABASE STRUCTURE DISCOVERY ---');

    // We can use a trick to get table list if RPC is enabled, 
    // but the most reliable way in many Supabase setups is to check what we can select from.
    const tables = ['investments', 'savings_goals', 'goals', 'assets', 'portfolio'];

    for (const table of tables) {
        console.log(`\n[Table: ${table}]`);
        // Try to select a non-existent column to trigger the schema cache error which sometimes lists columns
        const { error } = await supabase.from(table).select('columns_probe_123').limit(1);
        if (error) {
            console.log(`Error on ${table}:`, error.message);
            // If the error message mentions "Could not find column ...", it means the table exists.
            // If it says "relation does not exist", the table doesn't exist.
        }
    }

    // Try to get columns using a known valid table if possible
    console.log('\n[Schema Probe]');
    const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'investments' });
    if (error) console.log('RPC get_table_columns not available:', error.message);
    else console.log('Investments Columns (via RPC):', data);

    process.exit(0);
}
discover();
