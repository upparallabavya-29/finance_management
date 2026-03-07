import { supabase } from './config/supabase.js';

async function testLegacy() {
    console.log('--- LEGACY FIELD TEST ---');
    const { data, error } = await supabase.from('investments').insert([{
        user_id: '8f8196e5-3afc-4efe-9082-744958ccd362', // Just a test ID
        asset_name: 'Legacy Test',
        asset_type: 'Stocks',
        purchase_price: 100,
        quantity: 1,
        current_price: 110
    }]).select();

    if (error) {
        console.error('Legacy Error:', error.message);
    } else {
        console.log('LEGACY SUCCESS! Columns in DB are asset_name, asset_type, current_price.');
    }
    process.exit(0);
}
testLegacy();
