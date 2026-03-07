import { supabase } from './config/supabase.js';

async function probeNot() {
    console.log('--- PROBING NOT-NULL CONSTRAINTS ---');

    // Probing investments
    console.log('\n[Probing investments]');
    // Try to insert an empty object. It will likely fail with a not-null constraint error on the FIRST mandatory column.
    const { error: invErr } = await supabase.from('investments').insert([{}]).select();
    if (invErr) {
        console.log('Error Message:', invErr.message);
        console.log('Error Details:', invErr.details);
    }

    // Probing savings_goals
    console.log('\n[Probing savings_goals]');
    const { error: sgoalErr } = await supabase.from('savings_goals').insert([{}]).select();
    if (sgoalErr) {
        console.log('Error Message:', sgoalErr.message);
        console.log('Error Details:', sgoalErr.details);
    }

    process.exit(0);
}
probeNot();
