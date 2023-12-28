import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
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



//pre hook middleware for hashing password before saving
userSchema.pre('save',async function(next){
    const user=this;
    if(!user.isModified("password")){
        next()
    }
    try{
        const saltRound= await bcrypt.genSalt(12);
        const hash_Password= await bcrypt.hash(user.password, saltRound)
        user.password=hash_Password
    }
    catch(error){
        next(error.message)
    }
})

//instance methods for generating jwt token.
userSchema.methods.generateToken=async function(){
    try{
        return jwt.sign(
            {
                //payload(user identity)
                userId:this._id.toString(),
                email:this.email,
                role:this.role
            },
            process.env.JWT_SECRET_KEY,
            {expiresIn:'30d'}
        )

    }
    catch(error){
        console.log(error);
    }
}


export const User= mongoose.model('User', userSchema);