const mongoose=require('mongoose')

const UserSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required:true
    },
    lastName: {
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
      },
      gender: {
        type: String,
        required: true,
      },
      dob: {
        type: Date,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      isAdmin: {
        type: Boolean,
        required: true,
      },
      wallet: {
        type: Number,
        default:0,
        required: true,
      },
      surveys: {
        type: Number,
        default:0,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
})

module.exports=mongoose.model("User",UserSchema)