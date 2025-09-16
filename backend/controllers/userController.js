const asyncHandler = require("express-async-handler");
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const Contact = require("../models/contactSchema");

// @desc Get user
// @route /api/user/details
// access Private
const userDetails=asyncHandler(async (req,res)=>{
  const userId=req.userId;
  const user=await User.findById(userId);
  if(!user){
    return res.status(404).json({error:true,message:"User not found"});
  }
  return res.status(200).json({error:false, message:"User retrieved successfully",user:
    {
      _id:user._id,
      name:user.name,
      email:user.email
    }
  });
})

// @desc Delete user
// @route /api/user/delete
// access Private
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.userId;
  await Contact.deleteMany({ uid: userId });
  await User.findByIdAndDelete(userId);
  return res.status(200).json({ error: false, message: "Account deleted successfully" });
});

module.exports = { deleteUser,userDetails };
