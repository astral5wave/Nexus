const asyncHandler = require("express-async-handler");
const User = require("../models/userSchema");
const Contact = require("../models/contactSchema");
const bcrypt = require("bcrypt");
const demoContacts = require("../utils/demoContacts.json");

// @desc Post demo users
// @route /api/demouser/create
// @access Public
const createDemoUser = asyncHandler(async (req, res) => {
  const demoEmails = ["demo1@example.com", "demo2@example.com"];
  const oldUsers = await User.find({ email: { $in: demoEmails } });

  if (oldUsers.length > 0) {
    const oldUserIds = oldUsers.map((u) => u._id);
    await Contact.deleteMany({ uid: { $in: oldUserIds } });
    await User.deleteMany({ _id: { $in: oldUserIds } });
  }

  const hashedPassword = await bcrypt.hash("12345678", 10);
  const usersToCreate = [
    { name: "Demo User One", email: "demo1@example.com", password: hashedPassword },
    { name: "Demo User Two", email: "demo2@example.com", password: hashedPassword },
  ];
  const createdUsers = await User.insertMany(usersToCreate);

  const contactsToInsert = createdUsers.flatMap((user) =>
    demoContacts.map((contact) => ({
      ...contact,
      uid: user._id,
    }))
  );

  await Contact.insertMany(contactsToInsert);

  return res.status(201).json({
    error: false,
    message: "Demo users and contacts created successfully",
  });
});

module.exports = { createDemoUser };
