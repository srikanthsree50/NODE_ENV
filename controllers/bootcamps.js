const Bootcamp = require('../models/bootcamp');
const errorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async');
const geocoder = require('../utils/geocoder')

exports.getBootcamps = asyncHandler(async (req,res,next) =>{


let query;
 let queryStr = JSON.stringify(req.query);
queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g , match => `$${match}`);
query = Bootcamp.find(JSON.parse(queryStr));
const bootcamps = await query;

        res.status(200).json({
            success:true,
            count:bootcamps.length,
            data:bootcamps
    })
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
    
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        if(!bootcamp){

            return next(new errorResponse(` resource not found with id : ${req.params.id}`,400));
        }
        res.status(200).json({
            success:true,
            data:bootcamp
    })

})

exports.createBootcamp = asyncHandler(async (req,res,next) =>{

        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success:true,
            data:bootcamp
    })
 
})

exports.deleteBootcamp = asyncHandler(async (req,res,next) =>{

        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if(!bootcamp){

            return next(new errorResponse(` resource not found with id : ${req.params.id}`,400));
        }
        res.status(200).json({
            success:true,
            data:bootcamp
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