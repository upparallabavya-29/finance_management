async function testLogin() {
    try {
        console.log('Attempting to login via backend API at http://localhost:5001/api/auth/login...');
        const response = await fetch('http://localhost:5001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'bavyaupparalla@gmail.com',
                password: 'password123'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response Data:', data);
    } catch (error) {
        console.error('Request Error:', error.message);
    }
}

testLogin();
