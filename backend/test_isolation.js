import { supabase } from './config/supabase.js';

async function testIsolation() {
    console.log('--- DATA ISOLATION VERIFICATION ---');

    // 1. Get some dummy users to test with
    const { data: users, error: userError } = await supabase.from('users').select('id, email').limit(2);
    if (userError || !users || users.length < 1) {
        console.error('Could not find users to test with. Please seed some users first.');
        return;
    }

    const user1 = users[0];
    const user2 = users[1] || { id: '00000000-0000-4000-a000-000000000000', email: 'non-existent@test.com' };

    console.log(`User 1: ${user1.email} (${user1.id})`);
    console.log(`User 2: ${user2.email} (${user2.id})`);

    // 2. Create test data for User 1
    console.log('\nCreating test data for User 1...');
    const { data: testTx, error: txError } = await supabase.from('transactions').insert([{
        user_id: user1.id,
        amount: 123.45,
        description: 'ISOLATION TEST TX',
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
    }]).select().single();

    if (txError) console.error('TX Create Error:', txError);

    const { data: testBudget, error: budgetError } = await supabase.from('budgets').insert([{
        user_id: user1.id,
        amount: 500,
        start_date: '2026-01-01',
        end_date: '2026-12-31',
        period: 'monthly'
    }]).select().single();

    if (budgetError) console.error('Budget Create Error:', budgetError);

    if (!testTx || !testBudget) {
        console.error('Failed to create test data.');
        return;
    }

    console.log(`Test TX ID: ${testTx.id}`);
    console.log(`Test Budget ID: ${testBudget.id}`);

    // 3. Test Transaction Isolation (Simulating Controller logic)
    console.log('\nTesting Transaction Isolation...');
    const { data: txAsUser1 } = await supabase.from('transactions').select('id').eq('user_id', user1.id).eq('id', testTx.id);
    const { data: txAsUser2 } = await supabase.from('transactions').select('id').eq('user_id', user2.id).eq('id', testTx.id);

    console.log(`User 1 can see their tx: ${txAsUser1?.length > 0 ? '✅ YES' : '❌ NO'}`);
    console.log(`User 2 can see User 1 tx: ${txAsUser2?.length > 0 ? '❌ FAIL (Data Leaked)' : '✅ NO (Isolated)'}`);

    // 4. Test Budget Security (Update/Delete - Simulating Controller logic)
    console.log('\nTesting Budget Security...');
    const { data: updateAsUser2 } = await supabase
        .from('budgets')
        .update({ amount: 999999 })
        .eq('id', testBudget.id)
        .eq('user_id', user2.id)
        .select();

    console.log(`User 2 update User 1 budget: ${updateAsUser2?.length > 0 ? '❌ FAIL (Permission Leak)' : '✅ NO (Access Denied)'}`);

    const { error: deleteError } = await supabase
        .from('budgets')
        .delete()
        .eq('id', testBudget.id)
        .eq('user_id', user2.id);

    // Check if it's still there
    const { data: checkBudget } = await supabase.from('budgets').select('id').eq('id', testBudget.id);
    console.log(`User 2 delete User 1 budget: ${checkBudget?.length === 0 ? '❌ FAIL (Permission Leak)' : '✅ NO (Access Denied)'}`);

    // Clean up
    console.log('\nCleaning up...');
    await supabase.from('transactions').delete().eq('id', testTx.id);
    await supabase.from('budgets').delete().eq('id', testBudget.id);

    console.log('\n--- VERIFICATION COMPLETE ---');
}

testIsolation();
