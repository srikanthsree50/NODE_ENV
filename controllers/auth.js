const User = require('../models/User');
const errorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async');

exports.register = asyncHandler(async (req,res,next) => {
    
    const { name,email,password,role} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        role
    });
    res.status(200).json({
        success:true
    })
}) 