const http = require('http');

async function testAuth() {
    const timestamp = Date.now();
    const username = `testuser_${timestamp}`;
    const password = 'password123';

    try {
        // Register
        console.log(`Attempting to register user: ${username}`);
        const registerResponse = await fetch('http://localhost:8000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        console.log(`Register Status: ${registerResponse.status}`);
        const registerData = await registerResponse.json();
        console.log('Register Response:', registerData);

        if (!registerResponse.ok) {
            console.error('Registration failed');
            return;
        }

        // Login
        console.log(`Attempting to login user: ${username}`);
        const loginResponse = await fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        console.log(`Login Status: ${loginResponse.status}`);
        const loginData = await loginResponse.json();
        console.log('Login Response:', loginData);

        if (loginResponse.ok) {
            console.log('Login successful!');
        } else {
            console.error('Login failed');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

testAuth();
