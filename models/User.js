const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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
    enum:['user','publisher','admin'],
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
    if(!this.isModified('password')){
        next();
    }
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password,salt);
})

userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES})
}

userSchema.methods.matchPassword = async function(enteredPassword)  {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
}
module.exports = mongoose.model('User',userSchema);