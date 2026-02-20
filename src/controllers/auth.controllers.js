const userModel = require("../models/user.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


async function registerController(req, res) {
    try {
        console.log("registerController: Start");
        const { username, password } = req.body || {};
        console.log("registerController: Payload", { username, password: "***" });

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const isUserAlreadyExist = await userModel.findOne({ username });
        console.log("registerController: User exists?", !!isUserAlreadyExist);

        if (isUserAlreadyExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        console.log("registerController: Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("registerController: Creating user...");
        const user = await userModel.create({
            username,
            password: hashedPassword
        });
        console.log("registerController: User created", user._id);

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secretKey");
        console.log("registerController: Token generated");

        res.cookie("token", token);
        res.status(201).json({ message: "User created successfully", user: { _id: user._id, username: user.username } });
    } catch (error) {
        console.error("registerController: Error", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function loginController(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secretKey");
        res.cookie("token", token);
        res.status(200).json({ message: "Login successful", token, user: { _id: user._id, username: user.username } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

async function logoutController(req, res) {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
}

async function getUserController(req, res) {
    try {
        const token = req.cookies.token || req.cookies.chacha;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretKey");
        const user = await userModel.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = {
    registerController,
    loginController,
    logoutController,
    getUserController
};
