import { supabase } from './config/supabase.js';

async function describe() {
    console.log('--- DESCRIBING TABLES ---');
    // Using a trick: query a non-existent column to see the available columns in the error message,
    // OR just select all and let's see why it's empty.
    const { data: cols, error: err } = await supabase.rpc('get_table_columns', { table_name: 'investments' });

    if (err) {
        console.log('RPC failed (expected if not exists). Trying raw query error...');
        const { error: err2 } = await supabase.from('investments').select('non_existent_column_for_debug');
        if (err2) console.log('Error output:', err2.message);
    } else {
        console.log('Columns:', cols);
    }
    process.exit(0);
}
describe();
