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

courseSchema.statics.getAverageCost = async function(bootcampId)  {
const obj = await this.aggregate([
    {
        $match:{bootcamp:bootcampId}
    },
    {
        $group:{
            _id:'$bootcamp',
            averageCost:{ $avg : '$courseFees'}
        }
    }
])
try{
await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
    averageCost : Math.ceil(obj[0].averageCost/10)*10
})
}
catch(err){
console.error(err)
}
}

courseSchema.post('save', function(){
this.constructor.getAverageCost(this.bootcamp);
})

courseSchema.pre('remove', function(){
    
this.constructor.getAverageCost(this.bootcamp);
})


module.exports = mongoose.model('Course',courseSchema);