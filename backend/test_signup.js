const testSignup = async () => {
    try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'testbhavya@gmail.com',
                password: 'password123',
                firstName: 'Test',
                lastName: 'User'
            })
        });
        const data = await res.json();
        console.log('Register response:', data);
    } catch (e) {
        console.error(e);
    }
};
testSignup();
