const errorResponse = require('../utils/errorResponse')
const errorHandler = (err,req,res,next) =>{

    let error = {...err}
error.message = err.message;

console.log(err);

if(err.name === 'CastError'){
    const message = `resource not found with id ${err.value}`
    error = new errorResponse(message,404)
}

if(err.code === 11000){
    const message = `Duplicate field value`
    error = new errorResponse(message,400)
}

if(err.name === 'ValidationError'){
    const message = Object.values(err.errors).map(val => val.message);
    error = new errorResponse(message,400)
}
    res.status(error.statusCode || 500).json({
        success:false,
        err:error.message || 'Server Error' 
    })
}

module.exports = errorHandler;