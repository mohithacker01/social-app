require('dotenv').config();

async function testRest() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("Key missing");
        return;
    }

    console.log("Key length:", key.length);
    console.log("Starts with AIza:", key.startsWith("AIza"));

    const model = "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

    console.log("Fetching URL:", `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=HIDDEN`);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: "Hello" }]
                }]
            })
        });

        console.log("Status:", response.status);
        console.log("Status Text:", response.statusText);

        const data = await response.json();
        console.log("Response Body:", JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("Fetch error:", error);
    }
}

testRest();
