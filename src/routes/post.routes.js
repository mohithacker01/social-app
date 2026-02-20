const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router(); const userModel = require('../models/user.models')
const authMiddleware = require('../middlewares/auth.middleware')
const { createPostController, getFeedController } = require('../controllers/post.controller')
const multer = require('multer')

const upload = multer({ storage: multer.memoryStorage() })

router.post('/', authMiddleware, upload.single('image'), createPostController);
router.get('/', authMiddleware, getFeedController);

module.exports = router;


