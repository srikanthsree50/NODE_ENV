const User = require('../models/User');
const errorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async');

exports.register = asyncHandler(async (req,res,next) => {
    res.status(200).json({
        success:true
    })
}) 