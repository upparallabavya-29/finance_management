import { supabase } from './config/supabase.js';

async function check() {
    console.log('--- TABLE STRUCTURE ---');
    // RPC is usually the best way if allowed, but we can try a simple select and check the error message or just select one row
    const { data, error } = await supabase.from('investments').select('*').limit(1);
    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Columns found:', data.length > 0 ? Object.keys(data[0]) : 'No data in table');
    }
    process.exit();
}
check();
