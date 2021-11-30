const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
title:{
    type:String,
    trim:true,
    required:[ true, ' please add a title']
},
description:{
    type: String,
    required:[true, 'please add some description']
},
weeks:{
    type: String,
    required:[true, 'please add number of weeks']
},
courseFees:{
    type: Number,
    required:[true, 'please add courseFees']
},
expertise:{
    type: String,
    required:[true, 'please add some experience level'],
    enum:['beginner','intermediate','expert']
},
scholarshipAvailable:{
    type: Boolean,
    default:false
},
createdAt:{
    type: Date,
    default:Date.now
},
bootcamp:{
    type: mongoose.Schema.ObjectId,
    ref:'Bootcamp',
required:true
}
});

module.exports = mongoose.model('Course',courseSchema);