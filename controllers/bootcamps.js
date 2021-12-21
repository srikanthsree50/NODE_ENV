const Bootcamp = require('../models/bootcamp');
const errorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async');
const geocoder = require('../utils/geocoder')
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');

exports.getBootcamps = asyncHandler(async (req,res,next) =>{

        res.status(200).json(res.advancedSearchResults);
})

exports.getBootcamp = asyncHandler(async (req,res,next) =>{
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
         return next(new errorResponse(` resource not found with id : ${req.params.id}`,400));
        }
        res.status(200).json({
            success:true,
            data:bootcamp
    })
 
})

exports.updateBootcamp = asyncHandler(async (req,res,next) =>{
    
        let bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){

            return next(new errorResponse(` resource not found with id : ${req.params.id}`,400));
        } 

if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){

    return next(new errorResponse(` User ${req.params.id} is not authorized to update thois bootcamp`,401));
}

bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
    new : true,
    runValidators:true
})
        res.status(200).json({
            success:true,
            data:bootcamp
    })

})

exports.createBootcamp = asyncHandler(async (req,res,next) =>{
req.body.user = req.user.id;
const publishedBootcamp = await Bootcamp.findOne({user:req.user.id})
if(publishedBootcamp && req.user.role !== 'admin'){
    return next(new errorResponse(` user with Id ${req.user.id} already published a bootcamp`,400));
}
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success:true,
            data:bootcamp
    })
 
})

exports.deleteBootcamp = asyncHandler(async (req,res,next) =>{

        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){

            return next(new errorResponse(` resource not found with id : ${req.params.id}`,400));
        }


if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){

    return next(new errorResponse(` User ${req.params.id} is not authorized to remove this bootcamp`,401));
}

        bootcamp.remove();
        res.status(200).json({
            success:true,
            data:bootcamp
    })
 
})


exports.bootcampPhotoUpload = asyncHandler(async (req,res,next) =>{

    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){

        return next(new errorResponse(` resource not found with id : ${req.params.id}`,400));
    }

    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){

        return next(new errorResponse(` User ${req.params.id} is not authorized to update this bootcamp Photo`,401));
    }

    if(!req.files){

        return next(new errorResponse(` please upload a file`,400));
    }
    const file = req.files.file;
    if(!file.mimetype.startsWith('image')){
        return next(new errorResponse(` please upload an image`,400));
    }

    if(file.size > process.env.MAX_UPLOAD_SIZE){

        return next(new errorResponse(` file size should be less than ${process.env.MAX_UPLOAD_SIZE}`,400));
    }

    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            return next(new errorResponse(` something went wrong with file upload...`,500));
        }
        await Bootcamp.findByIdAndUpdate(req.params.id,{photo:file.name})
        res.status(200).json({
            success:true,
            data:file.name
    })
    })
})

exports.getBootcampInRadius = asyncHandler(async (req,res,next) =>{

    const {zipcode,distance} = req.params;
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  const radius = distance/ 3963;
  const bootcamps = await Bootcamp.find({
      location:{ $geoWithin: { $centerSphere: [[lng,lat] , radius] } }
  })

  res.status(200).send({
      success:true,
      count:bootcamps.length,
      data:bootcamps

  })
})