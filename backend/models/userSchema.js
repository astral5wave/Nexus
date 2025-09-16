const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"]
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: [true, "Email already exists"],
    match: [/^\S+@\S+\.\S+$/, "Email must be valid"]
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true 
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
