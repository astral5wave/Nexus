const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    firstName: {
      type: String,
      required: [true, "Please add the first name"],
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Email must be valid"],
    },
    contactCode: {
      type: String,
      required: [true, "Please enter the country code"],
      validate: {
        validator: function (v) {
          const clean = v.startsWith("+") ? v.slice(1) : v;
          return /^\d{1,3}$/.test(clean);
        },
        message: "Country code must be 1 to 3 digits (optionally starting with +)",
      },
    },
    contactNumber: {
      type: String,
      required: [true, "Please enter the contact number"],
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: "Contact number must be exactly 10 digits",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", contactSchema);
