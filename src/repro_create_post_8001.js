const fs = require('fs');
const path = require('path');

async function testCreatePost() {
    const timestamp = Date.now();
    const username = `testuser_${timestamp}`;
    const password = 'password123';
    const BASE_URL = 'http://localhost:8001';

    try {
        // 1. Register
        console.log(`\n1. Registering user: ${username}`);
        const registerResponse = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const registerData = await registerResponse.json();
        if (!registerResponse.ok && registerResponse.status !== 400) {
            console.error('Registration failed:', registerData);
            return;
        }

        // 2. Login to get token
        console.log(`\n2. Logging in...`);
        const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const loginData = await loginResponse.json();
        if (!loginResponse.ok) {
            console.error('Login failed:', loginData);
            return;
        }

        const token = loginData.token;
        let cookieHeader = loginResponse.headers.get('set-cookie');
        console.log('Login successful. Token:', token);

        // 3. Create Post
        console.log(`\n3. Creating Post...`);

        const dummyImagePath = path.join(__dirname, 'test_image_8001.jpg');
        // Simple 1x1 pixel white JPEG
        const dummyImageBuffer = Buffer.from('/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oADAMBAAIRAxEAPwH7/9k=', 'base64');
        fs.writeFileSync(dummyImagePath, dummyImageBuffer);

        const formData = new FormData();
        const fileBlob = new Blob([dummyImageBuffer], { type: 'image/jpeg' });
        formData.append('image', fileBlob, 'test_image_8001.jpg');

        const headers = {};
        if (cookieHeader) {
            headers['Cookie'] = cookieHeader;
        } else if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            headers['Cookie'] = `token=${token}`;
        }

        try {
            const createPostResponse = await fetch(`${BASE_URL}/api/posts`, {
                method: 'POST',
                headers: headers,
                body: formData
            });

            console.log(`Create Post Status: ${createPostResponse.status}`);
            const textBody = await createPostResponse.text();
            console.log('Create Post Response Body:', textBody);

            try {
                const jsonBody = JSON.parse(textBody);
                console.log('Parsed JSON:', jsonBody);
            } catch (e) {
                console.log('Could not parse JSON response');
            }

        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            if (fs.existsSync(dummyImagePath)) fs.unlinkSync(dummyImagePath);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

testCreatePost();
