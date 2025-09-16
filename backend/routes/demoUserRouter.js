const express = require("express");
const { createDemoUser } = require("../controllers/demoUserController");

const router = express.Router();

router.route("/create")
    .post(createDemoUser);

module.exports = router;