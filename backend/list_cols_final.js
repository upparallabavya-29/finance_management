import { supabase } from './config/supabase.js';

async function listColumnsSQL() {
    console.log('--- GETTING COLUMNS VIA SQL ---');

    // Sometimes it's better to just try a lot of columns and see what sticks
    // but if we can't use RPC, we can try to guess from the error message of a select *
    const { data, error } = await supabase.from('investments').select('*').limit(1);

    if (error) {
        console.error('Select * error:', error.message);
        // Error message might contain column names or hints
    } else if (data && data.length > 0) {
        console.log('Columns from data:', Object.keys(data[0]));
    } else {
        console.log('Table is empty. Probing with common names...');
        // We already did this, but let's try some more obscure ones
    }

    // Let's try to query information_schema if we can use it as a table
    const { data: schemaData, error: schemaError } = await supabase
        .from('investments')
        .select('id')
        .limit(1);

    if (schemaError) {
        console.log('Basic select failed:', schemaError.message);
    } else {
        console.log('Basic select succeeded, table exists.');
    }

    process.exit(0);
}

listColumnsSQL();
