const express = require('express');
const passport = require('../config/passport');
const { registerUser, loginUser, returnToken } = require("../controllers/authController");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}`, session: false }),  // url for frontend i case of failure /localhost:5173/login
    returnToken
);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: `${process.env.FRONTEND_URL}`, session: false }),
    returnToken
);


module.exports = router;
