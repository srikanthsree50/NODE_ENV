const Bootcamp = require('../models/bootcamp');
const errorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async');
const geocoder = require('../utils/geocoder')

exports.getBootcamps = asyncHandler(async (req,res,next) =>{


let query;
const reqQuery = {...req.query}
const removeFields = ['select'];

removeFields.forEach(param => delete reqQuery[param])
let queryStr = JSON.stringify(reqQuery);
 
queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g , match => `$${match}`);
query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

if(req.query.select){
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
}

if(req.query.sort){
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
}
else{ 
    query = query.sort('-createdAt')
}

const page = parseInt(req.query.page,10) || 1;
const limit = parseInt(req.query.limit,10) || 1;
const startIndex = (page - 1) * limit;
const endIndex = page * limit;
const total = await Bootcamp.countDocuments();

query = query.skip(startIndex).limit(limit);

const bootcamps = await query;

const pagination = {};

if(endIndex < total){
    pagination.next = {
        page: page + 1,
        limit
    }
}

if(startIndex > 0){
    pagination.prev = {
        page: page - 1,
        limit
    }
}

        res.status(200).json({
            success:true,
            count:bootcamps.length,
            pagination,
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

        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){

            return next(new errorResponse(` resource not found with id : ${req.params.id}`,400));
        }

        bootcamp.remove();
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