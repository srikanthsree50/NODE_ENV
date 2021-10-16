const mongoose = require('mongoose');

const BootcampSchema = mongoose.Schema({
name:{
    type:String,
    required:[true,'please provide a name'],
    unique:true,
    trim:true,
    maxlength:[50,'Name should not be greater than 50 characters']
},
slug:String,
description:{
    type:String,
    required:[true,'please provide a description'],
    maxlength:[500,' Description should not be greater than 500 characters']
},
website:{
    type:String,
    match:[
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS'
    ]
},
phone:{
    type:String,
    maxlength:[20,' phone number should not be longer than 20 numbers']
},
email:{
    type:String,
    match:[
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid emailId'
    ]
},
address:{
    type:String,
    maxlength:[20,'Address should not be longer than 20 characters']
},
location:{
    type:{
        String,
        enum:['Point'],
        required:true
    },
    coordinates:{
        type:[Number],
        required:true,
        index:'2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state:String,
    zipcode:String,
    country:String
},
careers:{
    type:[String],
    required:true,
    enum:[
        'Web Development',
        'Mobile Development',
        'UI/UX',
        'Data Science',
        'Business',
        'Other'
    ]
},
averageRating:{
    type:Number,
    min:[1,' rating should not be less than 1 '],
    max:[10, ' rating should not be more than 10']
},
averageCost:Number,
photo:{
    type:String,
    default:' no-photo.jpg'
},
housing:{
    type:Boolean,
    default:false
},
jobAssistance:{
    type:Boolean,
    default:false
},
jobGaurantee:{
    type:Boolean,
    default:false
},
acceptGi:{
    type:Boolean,
    default:false
},
createdAt:{
    type:Date,
    default:Date.now
}
});

module.exports = mongoose.model('Bootcamp',BootcampSchema);