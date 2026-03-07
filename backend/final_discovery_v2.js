import { supabase } from './config/supabase.js';

async function finalDiscovery() {
    console.log('--- FINAL SCHEMA DISCOVERY ---');

    console.log('\n[Investments Table]');
    const { data: invData, error: invErr } = await supabase.from('investments').select('*').limit(1);
    if (invErr) console.error('Investments Select Error:', invErr.message);
    else console.log('Columns:', Object.keys(invData[0] || { 'EMPTY': 'TABLE' }));

    console.log('\n[Savings Goals Table (prob goals)]');
    const { data: goalData, error: goalErr } = await supabase.from('goals').select('*').limit(1);
    if (goalErr) console.error('Goals Select Error:', goalErr.message);
    else console.log('Columns:', Object.keys(goalData[0] || { 'EMPTY': 'TABLE' }));

    console.log('\n[Savings Goals Table (prob savings_goals)]');
    const { data: sgoalData, error: sgoalErr } = await supabase.from('savings_goals').select('*').limit(1);
    if (sgoalErr) console.error('Savings Goals Select Error:', sgoalErr.message);
    else console.log('Columns:', Object.keys(sgoalData[0] || { 'EMPTY': 'TABLE' }));

    process.exit(0);
}
finalDiscovery();
