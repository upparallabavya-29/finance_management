import { supabase } from '../config/supabase.js';
import { transactions, budgets, goals } from '../../src/lib/data.js';

async function seedData() {
    console.log('🚀 Starting database seeding...');

    try {
        // Clear existing data (Optional - Use with caution)
        // await supabase.from('transactions').delete().neq('id', 0);
        // await supabase.from('budgets').delete().neq('id', 0);
        // await supabase.from('goals').delete().neq('id', 0);

        // Seed Transactions
        console.log('📦 Seeding transactions...');
        const { error: transError } = await supabase
            .from('transactions')
            .upsert(transactions.map(({ id, ...rest }) => rest)); // Using rest to let Supabase handle IDs if needed
        if (transError) throw transError;

        // Seed Budgets
        console.log('📦 Seeding budgets...');
        const { error: budgetError } = await supabase
            .from('budgets')
            .upsert(budgets.map(({ limit, spent, ...rest }) => ({
                ...rest,
                limit_amount: limit,
                spent_amount: spent,
                period: 'monthly'
            })));
        if (budgetError) throw budgetError;

        // Seed Goals
        console.log('📦 Seeding goals...');
        const { error: goalError } = await supabase
            .from('goals')
            .upsert(goals.map(({ target, current, ...rest }) => ({
                ...rest,
                target_amount: target,
                current_amount: current
            })));
        if (goalError) throw goalError;

        console.log('✅ Seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error during seeding:', error.message);
    }
}

seedData();
