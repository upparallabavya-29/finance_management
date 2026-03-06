const testLoginResetted = async () => {
    try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'bhavyabhavyareddy4@gmail.com',
                password: 'password123'
            })
        });
        const data = await res.json();
        console.log('Login response for resetted user:', data);
    } catch (e) {
        console.error(e);
    }
};
testLoginResetted();
