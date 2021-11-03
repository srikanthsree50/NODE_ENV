const Bootcamp = require('../models/bootcamp');
const errorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async');

exports.getBootcamps = asyncHandler(async (req,res,next) =>{

        const bootcamps = await Bootcamp.find();

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