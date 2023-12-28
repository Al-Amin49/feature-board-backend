import { User } from "../models/user.model.js";
import asyncWrapper from "../utils/asyncWrapper.js";

/*-------------------
@desc     create a new user
@route    POST api/v1/users/register
@access  public
*/
const register = asyncWrapper(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if email already exists
  const userWithEmail = await User.findOne({ email: email });
  if (userWithEmail) {
    return res.status(400).json({ msg: "Email already exists" });
  }

  // Check if username already exists
  const userWithUsername = await User.findOne({ username: username });
  if (userWithUsername) {
    return res.status(400).json({ msg: "Username already exists" });
  }

  const result = await User.create({ username, email, password });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token: await result.generateToken(),
    data: result,
  });
});
/*-------------------
@desc    Authenticate and login a user
@route    POST api/v1/users/login
@access  public
*/
const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (!userExist) {
    return res.status(404).json({ message: "User not found" });
  }
   //comparing password
   const passwordMatch = await userExist.comparePassword(password);

   if(passwordMatch){
     res.status(201).json({
       success: true,
       message: "Login successfully",
       token: await userExist.generateToken(),
       data: userExist,
     });
   }
   else{
     res.status(401).json({message:'Invalid email or password'})
   }
});
/*-------------------
 @desc    Get user data based on the provided JWT token
 @route   GET api/v1/users/user
 @access  Private
*/
const user=async(req, res)=>{
  try {
    const userData = req.user;
    console.log(userData);
    return res.status(200).json({userData });
  } catch (error) {
    console.log(` error from user route ${error}`);
  }
}


export const usersController = { register, login, user };
