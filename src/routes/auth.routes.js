const express = require("express");
const router = express.Router();
const { registerController, loginController, logoutController, getUserController } = require("../controllers/auth.controllers");

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/logout", logoutController);
router.get("/user", getUserController);

router.get("/test", (req, res) => {
    res.send("Auth route working ✅");
});

module.exports = router;