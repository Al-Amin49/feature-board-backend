import mongoose from 'mongoose';

const userSchema= new mongoose.Schema(
    {
    username:{
        type:String,
        required:[true, 'Please enter username'],
        minlength: [6, "Username must be of minimum 6 characters"],
        unique:true,
    },
    email:{
        type:String,
        required:[true, 'Please enter email'],
        minlength: [6, "Password must be of minimum 6 characters"],
        unique:true
    },
    password:{
        type:String,
        minlength: [6, "Password must be of minimum 6 characters"],
        required:true,
        //select:false
    },
    role:{
        type:String,
        enum:['admin', 'user'],
        default:'user'
    }

    }, {timestamps:true})

export const User= mongoose.model('User', userSchema)