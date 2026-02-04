const postModel = require('../models/post.model')
const { generateCaption } = require('../service/ai.service')



async function createPostController(req, res) {
    const file = req.file;
    console.log("file recieved:", file);
}

module.exports = {
    createPostController
}

const base64ImageFile = new Buffer(file.buffer).toString("base64");
const caption = await generateCaption(base64ImageFile);