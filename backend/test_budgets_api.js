// Test: Get budgets with Authorization header
// First login to get a token, then call /api/budgets
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
    console.log('Logged in. Fetching budgets...');

    const budgetsRes = await fetch(`${BASE}/budgets`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const budgetsData = await budgetsRes.json();
    console.log('Budgets response:', JSON.stringify(budgetsData, null, 2));
}
run();
