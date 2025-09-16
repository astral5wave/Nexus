const express = require("express");
const router = express.Router();
const validateToken = require("../middlewares/validateToken");
const { 
    getContact, deleteContact,
    postContact, getContactID, putContactID, 
    deleteContactID,deleteMultipleContacts 
    } = require("../controllers/contactController");

router.use(validateToken);

router.route("/")
    .get(getContact)
    .post(postContact)
    .delete(deleteContact);

router.route("/delete")
    .delete(deleteMultipleContacts);

router.route("/:id")
    .get(getContactID)
    .put(putContactID)
    .delete(deleteContactID);

module.exports = router;