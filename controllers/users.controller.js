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

  if (passwordMatch) {
    res.status(201).json({
      success: true,
      message: "Login successfully",
      token: await userExist.generateToken(),
      data: userExist,
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

/*-------------------
@desc    get all users
@route    POST api/v1/users/allusers
@access  private
*/

const getAllUsers = asyncWrapper(async (req, res) => {
  const allusers = await User.find();
  res.status(201).json({
    success: true,
    message: "all users fetch  successfully",
    data: allusers,
  });
});

/*-------------------
 @desc    Get user data based on the provided JWT token
 @route   GET api/v1/users/user
 @access  Private
*/
const userDetails=asyncWrapper(async(req, res)=>{
  const user = req.user;
  console.log('Authenticated User:', user)
  // If no user is found
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userDetails = {
    _id: user._id,
    username: user.username,
    email: user.email,
    role:user.role
  };

  // Sending the response with user details
  res.status(200).json({ user: userDetails });
})

const deleteUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ message: "user successfully deleted" });
});

const makeAdmin = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  // Update the user's role to "admin" using $set
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: { role: "admin" } },
    { new: true } // Return the updated document
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  // Return the updated user
  res.status(200).json({ message: "User role updated to admin", user: updatedUser });
});


export const usersController = {
  register,
  login,
  userDetails,
  getAllUsers,
  deleteUser,
  makeAdmin
};
