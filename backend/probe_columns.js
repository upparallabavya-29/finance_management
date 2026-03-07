import { supabase } from './config/supabase.js';

async function probe() {
    console.log('--- PROBING COLUMNS ---');

    // Probing investments
    console.log('\n[Probing investments]');
    const { error: invErr } = await supabase.from('investments').select('non_existent_column_abc_123').limit(1);
    if (invErr) {
        console.log('Error Message:', invErr.message);
        console.log('Error Details:', invErr.details);
        console.log('Error Hint:', invErr.hint);
    }

    // Probing savings_goals
    console.log('\n[Probing savings_goals]');
    const { error: sgoalErr } = await supabase.from('savings_goals').select('non_existent_column_abc_123').limit(1);
    if (sgoalErr) {
        console.log('Error Message:', sgoalErr.message);
        console.log('Error Details:', sgoalErr.details);
        console.log('Error Hint:', sgoalErr.hint);
    }

    // Probing goals (just in case)
    console.log('\n[Probing goals]');
    const { error: goalErr } = await supabase.from('goals').select('non_existent_column_abc_123').limit(1);
    if (goalErr) {
        console.log('Error Message:', goalErr.message);
    }

    process.exit(0);
}
probe();
