require('dotenv').config();
const { generateCaption } = require('./service/ai.service');

async function test() {
    try {
        console.log("Testing generateCaption...");

        // 1x1 pixel transparent gif
        const base64Image = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        const mimeType = "image/gif";

        const caption = await generateCaption(base64Image, mimeType);

        console.log("Caption generated successfully:");
        console.log(caption);

    } catch (error) {
        console.error("Error generating caption:", error);
    }
}

test();
