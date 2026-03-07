import axios from 'axios';

async function testInvestments() {
    const email = `invest_test_${Date.now()}@example.com`;
    console.log('Registering user for investment test:', email);
    try {
        const regRes = await axios.post('http://localhost:5001/api/auth/register', {
            firstName: 'Investor',
            lastName: 'Test',
            email: email,
            password: 'Password@123'
        });

        const token = regRes.data.session.access_token;
        console.log('Login success, token obtained.');

        console.log('Creating investment...');
        const invRes = await axios.post('http://localhost:5001/api/investments', {
            name: 'Apple Inc',
            type: 'Stocks',
            quantity: 10,
            purchase_price: 150.50,
            current_value: 175.25
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Investment Response:', invRes.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testInvestments();
