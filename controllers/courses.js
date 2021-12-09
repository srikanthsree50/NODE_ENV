const Course = require('../models/Course');
const errorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async');
const Bootcamp = require('../models/bootcamp')

exports.getCourses = asyncHandler(async (req,res,next) =>{


    if(req.params.bootcampId){
         const courses = await Course.find({bootcamp:req.params.bootcampId});

    return res.status(200).json({
        success:true,
        count:courses.length,
        data:courses
})
    }
    else{
res.status(200).json(res.advancedSearchResults);
    }
})


exports.getCourse = asyncHandler(async (req,res,next) =>{


        const course = await Course.findById(req.params.id).populate({
            path:'bootcamp',
            select:'name description'
          });
if(!course){
    return next(new ErrorResponse(`no course with the id${req.params.id}`),404)
}
    res.status(200).json({
        success:true,
        data:course
})

})

exports.addCourse = asyncHandler(async (req,res,next) =>{

req.body.bootcamp = req.params.bootcampId;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

if(!bootcamp){
return next(new ErrorResponse(`no bootcamp with the id${req.params.bootcampId}`),404)
}

const course = await Course.create(req.body);

res.status(200).json({
    success:true,
    data:course
})

})


exports.updateCourse = asyncHandler(async (req,res,next) =>{

        let course = await Course.findById(req.params.id);
    
    if(!course){
    return next(new ErrorResponse(`no course with the id${req.params.id}`),404)
    }
    
    course = await Course.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });
    
    res.status(200).json({
        success:true,
        data:course
    })

})


exports.deleteCourse = asyncHandler(async (req,res,next) =>{

    const course = await Course.findById(req.params.id);

if(!course){
return next(new ErrorResponse(`no course with the id${req.params.id}`),404)
}
await course.remove();
res.status(200).json({
    success:true,
    data:{}
})

})