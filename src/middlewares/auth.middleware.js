const jwt = require("jsonwebtoken");
const userModel = require("../models/user.models");

async function authMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decodedToken.id)
        next()
        req.user = user
    } catch (err) {
        console.error(err)
        return res.status(401).json({ message: "Invalid token" })
    }
}

module.exports = authMiddleware;