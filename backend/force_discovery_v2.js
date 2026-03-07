import { supabase } from './config/supabase.js';

async function forceDiscovery() {
    console.log('--- FORCING DISCOVERY STEP 2 ---');
    const { error } = await supabase.from('investments').insert([{
        user_id: '8f8196e5-3afc-4efe-9082-744958ccd362',
        title: 'Discovery'
    }]).select();

    if (error) {
        console.log('Insert error:', error.message);
    } else {
        console.log('Insert successful! Trying to fetch row to see columns...');
        const { data } = await supabase.from('investments').select('*').eq('title', 'Discovery');
        if (data && data.length > 0) console.log('Columns:', Object.keys(data[0]));
    }
    process.exit(0);
}
forceDiscovery();
