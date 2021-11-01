const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new Schema({
name:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    maxlength:[50,'Name should not be greater than 50 characters']
},
slug:String,
description:{
    type:String,
    required:true,
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
       type: String,
   //   required:true,
        enum:['Point']
    },
    coordinates:{
        type:[Number],
    //    required:true,
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
        "Js",
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

BootcampSchema.pre('save',  function(next) {
    this.slug = slugify(this.name,{lower:true})
    next();
})

BootcampSchema.pre('save', async function(next){
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type:'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city:loc[0].city,
        state:loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    };
    this.address = undefined;
    next();
})

module.exports = mongoose.model('Bootcamp',BootcampSchema);