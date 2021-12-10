const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true, 'please provide a name']
    },
email:{
    type:String,
    required:[true,'please provide an email'],
    unique:true,
    match:[
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid emailId'
    ]
},
role: {
    type:String,
    enum:['user','publisher'],
    default:'user'
},
password:{
    type: String,
    required:[true,' please provide a password'],
    minlength:6,
    select:false
},
resetPasswordToken:String,
resetPasswordExpire:Date,
createdAt:{
    type:Date,
    default:Date.now
}
})

userSchema.pre('save', async function(next) {
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password,salt);
})

module.exports = mongoose.model('User',userSchema);