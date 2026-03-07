import { supabase } from './config/supabase.js';

async function check() {
    console.log('--- SCHEMA CHECK ---');
    const { data, error } = await supabase.from('investments').select('*').limit(1);
    if (error) {
        console.error('Error:', error.message);
        if (error.message.includes('asset_name')) {
            console.log('CONFIRMED: Database is missing "name" column or has "asset_name" instead.');
        }
    } else {
        console.log('Success connecting to table.');
        if (data.length > 0) {
            console.log('Columns found:', Object.keys(data[0]));
        } else {
            console.log('No data, but table exists.');
            // Try to force an error by selecting a likely column
            const { error: err2 } = await supabase.from('investments').select('name').limit(1);
            if (err2) console.log('Column "name" DOES NOT exist:', err2.message);
            else console.log('Column "name" EXISTS.');
        }
    }
    process.exit();
}
check();
