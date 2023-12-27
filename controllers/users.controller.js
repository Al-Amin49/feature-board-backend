import { User } from "../models/user.model.js";
import asyncWrapper from "../utils/asyncWrapper.js"

//@dest     create a new user
//@route    POST api/v1/users
//@access  public
const register=asyncWrapper(async(req, res)=>{
    const {username, email, password}=req.body;
    const result= await User.create({username, email, password})
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    
})
export const usersController ={register}