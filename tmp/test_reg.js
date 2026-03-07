import axios from 'axios';

async function testRegister() {
    const email = `test_success_${Date.now()}@example.com`;
    console.log('Testing registration with:', email);
    try {
        const response = await axios.post('http://localhost:5001/api/auth/register', {
            firstName: 'Success',
            lastName: 'Test',
            email: email,
            password: 'Password@123'
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testRegister();
