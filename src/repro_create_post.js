const fs = require('fs');
const path = require('path');

async function testCreatePost() {
    const timestamp = Date.now();
    const username = `testuser_${timestamp}`;
    const password = 'password123';

    try {
        // 1. Register
        console.log(`\n1. Registering user: ${username}`);
        const registerResponse = await fetch('http://localhost:8000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const registerData = await registerResponse.json();
        if (!registerResponse.ok && registerResponse.status !== 400) { // 400 might mean user exists
            console.error('Registration failed:', registerData);
            return;
        }

        // 2. Login to get token
        console.log(`\n2. Logging in...`);
        const loginResponse = await fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const loginData = await loginResponse.json();
        if (!loginResponse.ok) {
            console.error('Login failed:', loginData);
            return;
        }

        const token = loginData.token; // Assuming backend returns token in body, or cookie.
        // If cookie, we need to handle it. The backend sets a cookie named 'token'.
        // Fetch in Node doesn't automatically handle cookies like a browser.
        // We'll try to extract the cookie from the set-cookie header if token is not in body.

        let cookieHeader = loginResponse.headers.get('set-cookie');
        console.log('Login successful. Token:', token, 'Cookie:', cookieHeader);

        // 3. Create Post
        console.log(`\n3. Creating Post...`);

        // Create a dummy image file
        const dummyImagePath = path.join(__dirname, 'test_image.jpg');
        // Simple 1x1 pixel white JPEG
        const dummyImageBuffer = Buffer.from('/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwH7/9k=', 'base64');
        fs.writeFileSync(dummyImagePath, dummyImageBuffer);

        const formData = new FormData();
        const fileBlob = new Blob([dummyImageBuffer], { type: 'image/jpeg' });
        formData.append('image', fileBlob, 'test_image.jpg');

        const headers = {};
        if (cookieHeader) {
            headers['Cookie'] = cookieHeader;
        } else if (token) {
            // If manual token auth is supported by backend (e.g. Bearer)
            headers['Authorization'] = `Bearer ${token}`;
            // But backend middleware checks req.cookies.token, so we MUST send cookie.
            headers['Cookie'] = `token=${token}`;
        }

        try {
            const createPostResponse = await fetch('http://localhost:8000/api/posts', {
                method: 'POST',
                headers: headers,
                body: formData
            });

            console.log(`Create Post Status: ${createPostResponse.status}`);
            const createPostData = await createPostResponse.json();
            console.log('Create Post Response:', createPostData);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            // Cleanup
            if (fs.existsSync(dummyImagePath)) fs.unlinkSync(dummyImagePath);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

testCreatePost();
