import { supabase } from './config/supabase.js';

async function probeNotVerbose() {
    console.log('--- VERBOSE CONSTRAINT PROBE ---');

    // Probing investments
    console.log('\n[Investments]');
    const { error: invErr } = await supabase.from('investments').insert([{}]).select();
    if (invErr) {
        console.log('MSG:', invErr.message);
        console.log('DETAILS:', invErr.details);
    }

    // Probing savings_goals
    console.log('\n[Savings Goals]');
    const { error: sgoalErr } = await supabase.from('savings_goals').insert([{}]).select();
    if (sgoalErr) {
        console.log('MSG:', sgoalErr.message);
        console.log('DETAILS:', sgoalErr.details);
    }

    process.exit(0);
}
probeNotVerbose();
