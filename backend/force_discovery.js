import { supabase } from './config/supabase.js';

async function forceDiscovery() {
    console.log('--- FORCING DISCOVERY ---');
    // Select * and log keys of the first row if possible
    const { data } = await supabase.from('investments').select('*');
    if (data && data.length > 0) {
        console.log('Found row! Keys:', Object.keys(data[0]));
    } else {
        console.log('Table empty. Testing insert for discovery...');
        const { error } = await supabase.from('investments').insert([{}]).select();
        if (error) {
            console.log('Insert error (Discovery):', error.message);
            console.log('Error Details:', JSON.stringify(error, null, 2));
        }
    }
    process.exit(0);
}
forceDiscovery();
