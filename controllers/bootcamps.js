exports.getBootcamps = (req,res,next) =>{
    res.status(200).json({
        success:true,
        msg:"show all bootcamps... "
    })
}

exports.getBootcamp = (req,res,next) =>{
    res.status(200).json({
        success:true,
        msg:`show bootcamp with ${req.params.id} `
    })
}

exports.updateBootcamp = (req,res,next) =>{
    res.status(200).json({
        success:true,
        msg:`update all bootcamps with id ${req.params.id} `
    })
}

exports.createBootcamp = (req,res,next) =>{
    res.status(201).json({
        success:true,
        msg:"saving all bootcamps... "
})
}

exports.deleteBootcamp = (req,res,next) =>{
    res.status(200).json({
        success:true,
        msg:`delete all bootcamps with id ${req.params.id}  `
    })
}