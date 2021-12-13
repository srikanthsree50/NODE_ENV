const User = require('../models/User');
const errorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

exports.register = asyncHandler(async (req,res,next) => {
    
    const { name,email,password,role} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        role
    });

const token = user.getSignedJwtToken()

    res.status(200).json({
        success:true,
        token
    })
}) 


exports.login = asyncHandler(async (req,res,next) => {
    
    const { email,password} = req.body;

    if(!email || !password){
        return next(new ErrorResponse('please provide a valid email and password...',400));
    }

    const user = User.findOne({email}).select('+password');
if(!user){
    return next(new ErrorResponse('Invalid Credentials...',401));
}
//console.log('//user////',user)
const isMatch = await user.matchPassword(password)
if(!isMatch){
    return next(new ErrorResponse('Invalid Credentials...',401));
}
const token = user.getSignedJwtToken()

    res.status(200).json({
        success:true,
        token
    })
}) 