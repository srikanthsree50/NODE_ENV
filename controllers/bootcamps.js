const Bootcamp = require('../models/bootcamp');

exports.getBootcamps = async (req,res,next) =>{

    try{
        const bootcamps = await Bootcamp.find();
        res.status(200).json({
            success:true,
            count:bootcamps.length,
            data:bootcamps
    })
    }
    catch(err){
        res.status(400).json({
            success:false,
            err:err
    })
    }
}

exports.getBootcamp = async (req,res,next) =>{
    try{
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){

         return res.status(400).json({
                success:false,
                msg:'Bootcamp doesnt exist'
        })
        }
        res.status(200).json({
            success:true,
            data:bootcamp
    })
    }
    catch(err){
        res.status(400).json({
            success:false,
            err:err
    })
    }
}

exports.updateBootcamp = async (req,res,next) =>{
    try{
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        if(!bootcamp){

         return res.status(400).json({
                success:false,
                msg:'Bootcamp doesnt exist'
        })
        }
        res.status(200).json({
            success:true,
            data:bootcamp
    })
    }
    catch(err){
        res.status(400).json({
            success:false,
            err:err
    })
    }
}

exports.createBootcamp = async (req,res,next) =>{
    try{
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success:true,
            data:bootcamp
    })
    }
    catch(err){
        res.status(400).json({
            success:false,
            err:err
    })
    }
}

exports.deleteBootcamp = async (req,res,next) =>{
    try{
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if(!bootcamp){

         return res.status(400).json({
                success:false,
                msg:'Bootcamp doesnt exist'
        })
        }
        res.status(200).json({
            success:true,
            data:bootcamp
    })
    }
    catch(err){
        res.status(400).json({
            success:false,
            err:err
    })
}
}