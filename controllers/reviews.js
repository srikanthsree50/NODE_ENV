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


exports.addReview = asyncHandler(async (req,res,next) =>{

     req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id
    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

if(!bootcamp){
return next(new ErrorResponse(`no bootcamp with the id${req.params.id}`),404)
}

const review = await Review.create(req.body);

res.status(201).json({
    success:true,
    data:review
})

})


exports.updateReview = asyncHandler(async (req,res,next) =>{

    let review = await Review.findById(req.params.id);

if(!review){
return next(new errorResponse(`no review with the id${req.params.id}`),404)
}

if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){

    return next(new errorResponse(` User ${req.params.id} is not authorized to update this course`,401));
}

review = await Review.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true
});

res.status(200).json({
    success:true,
    data:review
})

})


exports.deleteReview = asyncHandler(async (req,res,next) =>{

const review = await Review.findById(req.params.id);

if(!review){
return next(new errorResponse(`no review with the id${req.params.id}`),404)
}

if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){

return next(new errorResponse(` User ${req.params.id} is not authorized to delete this course`,401));
}

await review.remove();
res.status(200).json({
success:true,
data:{}
})

})

