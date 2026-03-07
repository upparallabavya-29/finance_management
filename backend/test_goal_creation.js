import { supabase } from './config/supabase.js';

async function testGoalCreation() {
    console.log('--- TESTING GOAL CREATION ---');

    const dummyGoal = {
        user_id: '87b97459-2871-426f-8231-666e5762cf93', // Bhavyas ID
        title: 'Test Goal ' + Date.now(),
        target_amount: 1000,
        current_amount: 100,
        deadline: '2026-12-31'
    };

    console.log('Attempting insert into savings_goals:', dummyGoal);
    const { data, error } = await supabase.from('savings_goals').insert([dummyGoal]).select();

    if (error) {
        console.error('Goal Creation Error:', error.message);
        console.error('Details:', error.details);
    } else {
        console.log('Goal Created Successfully:', data[0]);
    }

    process.exit(0);
}
testGoalCreation();
