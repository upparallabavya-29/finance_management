import { supabase } from './config/supabase.js';

async function checkBoth() {
    console.log('--- CHECKING TABLES ---');
    const { data: invData, error: invErr } = await supabase.from('investments').select('*').limit(1);
    const { data: goalData, error: goalErr } = await supabase.from('savings_goals').select('*').limit(1);

    if (invErr) console.log('Investments Err:', invErr.message);
    else console.log('Investments Columns:', invData.length > 0 ? Object.keys(invData[0]) : 'Empty, but table exists');

    if (goalErr) console.log('Goals Err:', goalErr.message);
    else console.log('Goals Columns:', goalData.length > 0 ? Object.keys(goalData[0]) : 'Empty, but table exists');

    process.exit(0);
}
checkBoth();
