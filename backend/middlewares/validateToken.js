const jwt= require("jsonwebtoken");
const asyncHandler = require("express-async-handler");


const validToken =asyncHandler (async (req,res,next)=>{
    const authHeader= req.headers.Authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")){
        const token=authHeader.split(" ")[1];
        const {userId} =jwt.verify(token,process.env.SECRET);
        req.userId=userId;
        next();
    }else{
        return res.status(400).json({error:true,message:"Enter a valid token to continue"});
    }
});

module.exports=validToken;