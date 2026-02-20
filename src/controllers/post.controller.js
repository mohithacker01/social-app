const postModel = require('../models/post.model')
const { generateCaption } = require('../service/ai.service')



async function createPostController(req, res) {
    try {
        console.log("createPostController: Request received");
        const file = req.file;
        console.log("createPostController: File received:", file ? "Yes" : "No");
        if (file) {
            console.log("createPostController: File details:", { originalname: file.originalname, mimetype: file.mimetype, size: file.size });
        }

        if (!file) {
            return res.status(400).json({ message: "Image file is required" });
        }

        const base64ImageFile = Buffer.from(file.buffer).toString("base64");

        // USER REQUESTED: Only use AI generated caption
        let caption;
        try {
            caption = await generateCaption(base64ImageFile, file.mimetype);
        } catch (error) {
            console.error("AI Caption Generation Failed:", error.message);
            caption = "Check out this photo!"; // Fallback caption
        }

        const newPost = await postModel.create({
            image: `data:${file.mimetype};base64,${base64ImageFile}`,
            caption: caption,
            user: req.user._id
        });

        res.status(201).json({
            message: "Post created successfully",
            post: newPost
        });

    } catch (error) {
        console.error("Error creating post - Full Error:", error);
        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

async function getFeedController(req, res) {
    try {
        const posts = await postModel.find().populate('user', 'username').sort({ _id: -1 });
        res.status(200).json({ posts });
    } catch (error) {
        console.error("Error fetching feed:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    createPostController,
    getFeedController
}
