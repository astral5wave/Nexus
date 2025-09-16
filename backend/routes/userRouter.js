const express = require("express");
const router = express.Router();
const validateToken = require("../middlewares/validateToken");
const {deleteUser,userDetails} = require("../controllers/userController");

router.use(validateToken);

router.route("/details").get(userDetails);
router.route("/delete").delete(deleteUser);

module.exports = router;
