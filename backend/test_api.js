import { supabaseAuth, supabase } from './config/supabase.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    console.log('=== Step 1: Login ===');
    const { data: loginData, error: loginErr } = await supabaseAuth.auth.signInWithPassword({
        email: 'upparallabavya@gmail.com',
        password: 'Bav@2002'  // Update if wrong
    });

    if (loginErr) {
        console.error('LOGIN ERROR:', loginErr.message);
        return;
    }
    console.log('Logged in as:', loginData.user.email, '| user.id:', loginData.user.id);

    console.log('\n=== Step 2: Fetch budgets with user_id filter ===');
    const { data: budgets, error: budgetErr } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', loginData.user.id);

    console.log('Budget error:', budgetErr?.message || 'none');
    console.log('Budget count:', budgets?.length);
    budgets?.forEach(b => console.log('  -', b.id, b.amount, b.period, b.category_id));
}

test().catch(e => console.error('FATAL:', e.message));
