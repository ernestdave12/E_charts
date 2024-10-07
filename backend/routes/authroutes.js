const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require("../controllers/userController");

router.post('/register', userController.addUser);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh_token', authController.refreshToken);
router.get("/validate_token", authController.validateToken);

module.exports = router;