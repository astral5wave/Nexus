const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactSchema");

// @desc Get all contacts
// @route /api/contact
// access Private
const getContact = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ uid: req.userId });
    return res.json({ error: false, contacts });
});


// @desc Post a contact
// @route /api/contact
// access Private
const postContact = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, contactCode, contactNumber } = req.body;
    if (!firstName || !contactCode || !contactNumber) {
        return res.status(400).json({ error: true, message: "Contact field/s missing" });
    }
    const contactData = {
        firstName: firstName[0].toUpperCase() + firstName.substring(1),
        contactCode,
        contactNumber,
        uid: req.userId,
    };
    if (email) {
        contactData.email = email.toLowerCase();
    }
    if (lastName) {
        contactData.lastName = lastName[0].toUpperCase() + lastName.substring(1);
    }
    await Contact.create(contactData);
    return res.status(201).json({ error: false, message: "Contact added successfully" });
});

// @desc Delete all contacts
// @route /api/contact
// access Private
const deleteContact = asyncHandler(async (req, res) => {
    await Contact.deleteMany({ uid: req.userId });
    return res.status(201).json({ error: false, message: "All Contact deleted" });
});

// @desc Get a contact
// @route /api/contact/id
// access Private
const getContactID = asyncHandler(async (req, res) => {
    const contact = await Contact.findOne({ uid: req.userId, _id: req.params.id });
    if (!contact) {
        return res.status(404).json({ error: true, message: "Contact not found" });
    }
    return res.status(200).json({ error: false, contact });
});

// @desc Put a contact
// @route /api/contact/id
// access Private
const putContactID = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, contactCode, contactNumber } = req.body;
    if (!firstName || !contactCode || !contactNumber) {
        return res.status(400).json({ error: true, message: "Contact field/s missing" });
    }
    const contactData = {
        firstName: firstName[0].toUpperCase() + firstName.substring(1),
        contactCode,
        contactNumber,
    };
    if (email) {
        contactData.email = email.toLowerCase();
    }
    if (lastName) {
        contactData.lastName = lastName[0].toUpperCase() + lastName.substring(1);
    }
    const updatedContact = await Contact.findOneAndUpdate(
        { uid: req.userId, _id: req.params.id },
        { $set: contactData },
        { new: true, runValidators: true }
    );
    if (!updatedContact) {
        return res.status(404).json({ error: true, message: "Contact not found" });
    }
    return res.status(200).json({ error: false, message: "Contact updated successfully" });
});

// @desc Delete a contact
// @route /api/contact/id
// access Private
const deleteContactID = asyncHandler(async (req, res) => {
    const deletedContact = await Contact.findOneAndDelete({ uid: req.userId, _id: req.params.id });
    if (!deletedContact) {
        return res.status(404).json({ error: true, message: "Contact not found" });
    }
    return res.status(200).json({ error: false, message: "Deleted contact successfully" });
});

// @desc Delete multiple contacts
// @route DELETE /api/contact/delete
// @access Private
const deleteMultipleContacts = asyncHandler(async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: true, message: "No IDs provided" });
    }
    const result = await Contact.deleteMany({ uid: req.userId, _id: { $in: ids } });
    return res.status(200).json({ error: false, message: `${result.deletedCount} contact(s) deleted` });
});

module.exports = { getContact, postContact, deleteContact, getContactID, putContactID, deleteContactID, deleteMultipleContacts };