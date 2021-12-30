const Review = require('../models/Review');
const errorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async');
const Bootcamp = require('../models/bootcamp')


exports.getReviews = asyncHandler(async (req,res,next) =>{


    if(req.params.bootcampId){
         const reviews = await Review.find({bootcamp:req.params.bootcampId});

    return res.status(200).json({
        success:true,
        count:reviews.length,
        data:reviews
})
    }
    else{
res.status(200).json(res.advancedSearchResults);
    }
})



exports.getReview = asyncHandler(async (req,res,next) =>{


    const review = await Review.findById(req.params.id).populate({
        path:'bootcamp',
        select:'name description'
      });
if(!review){
return next(new ErrorResponse(`no course with the id${req.params.id}`),404)
}
res.status(200).json({
    success:true,
    data:review
})

})