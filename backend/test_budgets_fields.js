const BASE = 'http://localhost:5000/api';

async function run() {
    const loginRes = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'bhavyabhavyareddy4@gmail.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    if (!loginData.success) { console.error('Login failed:', loginData.message); return; }

    const token = loginData.session.access_token;

    const budgetsRes = await fetch(`${BASE}/budgets`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const budgetsData = await budgetsRes.json();

    // Print each budget's key fields
    if (budgetsData.data) {
        budgetsData.data.forEach((b, i) => {
            console.log(`--- Budget ${i + 1} ---`);
            console.log('category name:', b.categories?.name);
            console.log('spent_amount:', b.spent_amount);
            console.log('limit (amount):', b.amount);
            console.log('start_date:', b.start_date);
            console.log('end_date:', b.end_date);
        });
    } else {
        console.log('No budgets found or error:', budgetsData);
    }
}
run();
