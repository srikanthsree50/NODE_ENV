const User = require('../models/User');
const errorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const sendMail = require('../utils/sendMail');

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

exports.getCurrentLoggedInUser = asyncHandler(async (req,res,next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success:true,
        data:user
    })
})


exports.resetPassword = asyncHandler(async (req,res,next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user = await User.findOne({ 
        resetPasswordToken,
        resetPasswordExpire : { $gt : Date.now() }
    })
if(!user){
return next( new ErrorResponse(' Invalid Token ',400));
}

user.password = req.body.password;
user.resetPasswordToken = undefined;
user.resetPasswordExpire = undefined;
await user.save();

 sendTokenResponse(user,200,res);
})

exports.forgotPassword = asyncHandler(async (req,res,next) => {
    const user = await User.findOne({
        email:req.body.email
    })
    if(!user){
        return next(new ErrorResponse('user doesnt exist with this emailId please try again...',404))
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave : false })

const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`
const message = ` you are receiving this email b'coz you have requested for reset password please make a PUT request to \n\n ${resetUrl}`
    
try{
await sendMail({
    email:user.email,
    subject: 'password reset token',
    message
})
res.status(200).json({ success:true , data:' email sent successfully...'})
}
catch(err){
console.log(err);
user.resetPasswordToken = undefined;
user.resetPasswordExpire = undefined;
await user.save({ validateBeforeSave: false});
return next(' Email could not be sent or invalid mailtrap username /password...',500);
}

// res.status(200).json({
//         success:true,
//         data:user
//     })
})