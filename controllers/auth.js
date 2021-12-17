const User = require('../models/User');
const errorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const bcrypt = require('bcryptjs');

exports.register = asyncHandler(async (req,res,next) => {
    
    const { name,email,password,role} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        role
    });
    sendTokenResponse(user,200,res);
}) 


exports.login = asyncHandler(async (req,res,next) => {
    
    const { email,password} = req.body;

    if(!email || !password){
        return next(new ErrorResponse('please provide a valid email and password...',400));
    }

    const user = await User.findOne({email}).select('+password');
    
if(!user){
    return next(new ErrorResponse('Invalid Credentials...',401));
}

const isMatch =  await  user.matchPassword(password)
if(!isMatch){
    return next(new ErrorResponse('Invalid Credentials...',401));
}

sendTokenResponse(user,200,res);

}) 

const sendTokenResponse = (user,statusCode,res) => {
    const token = user.getSignedJwtToken()
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly : true
    }
 
if(process.env.NODE_ENV === 'production'){
    options.secure = true;
}

    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        token
    });
}