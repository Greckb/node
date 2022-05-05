const express = require('express');
const { loginForm, registerForm, registerUser } = require('../controllers/authController');
const router = express.Router();

router.get("/login", loginForm);

router.post("/register", registerUser );
router.get("/register", registerForm);




module.exports = router
