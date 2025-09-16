const asyncHandler = require("express-async-handler");
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

// @desc Register new user
// @route /api/auth/register
// access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: true, message: "Registration field is missing" });
    }
    const userFind = await User.findOne({ email });
    if (userFind) {
        return res.status(409).json({ error: true, message: "User already exists, please login" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = generateToken(user._id);
    return res.status(201).json({ error: false, message: "User created successfully", token });
});

// @desc Login user
// @route /api/auth/login
// access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: true, message: "Login field is missing" });
    }
    const userFind = await User.findOne({ email });
    if (userFind && !userFind.password) {
        let provider = null;
        if (userFind.googleId && userFind.facebookId) {
            provider = "Google or Facebook";
        } else if (userFind.googleId) {
            provider = "Google";
        }
        else if (userFind.facebookId) {
            provider = "Facebook";
        }
        return res.status(400).json({
            error: true, message: provider
                ? `This account was created using ${provider} account. Please log in with your ${provider} account.`
                : "This account does not support password login."
        });
    }
    else if (userFind && await bcrypt.compare(password, userFind.password)) {
        const token = generateToken(userFind._id);
        return res.status(200).json({ error: false, message: "Login Successful", token });
    }
    else {
        return res.status(400).json({ error: true, message: "Enter a valid email and password" });
    }
});

// @desc Return JWT token for OAuth2.0 login method
// @route /api/auth/google/callback || /api/auth/github/callback
// access Protected
const returnToken = asyncHandler(async (req, res) => {
    const token = generateToken(req.user.userId);
    return res.redirect(`${process.env.FRONTEND_URL}/home?token=${token}`);
});

module.exports = { registerUser, loginUser, returnToken };