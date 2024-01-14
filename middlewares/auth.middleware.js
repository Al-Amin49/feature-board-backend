import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'

const authMiddleware = async (req, res, next) => {
  try {
    const tokenHeader = req.header("Authorization");

    if (!tokenHeader) {
      throw new Error("Authorization header is missing");
    }

    const token = tokenHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
console.log('decoded',decoded);

    const user = await User.findOne({
      _id: decoded.userId,
    });
    console.log('user from authmiddlew', user)

    if (!user) {
      throw new Error("Unable to login, invalid credentials");
    }

    req.user = user;
    console.log('from authmiddleware',req.user)
    req.token = token;
    next();
  } catch (error) {
    next(error); // Call next with the error to propagate it to the error-handling middleware
  }
};
export default authMiddleware;
// const authMiddleware = async (req, res, next) => {
//     const token = req.header("Authorization");
  
//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "Unauthorized http: token not provided" });
//     }
  
//     // Assuming token is in the format "Bearer <jwtToken>"
//     const jwtToken = token.replace("Bearer", "").trim();
  
//     try {
//       const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
//       const userData = await User.findOne({ email: isVerified.email }).select({
//        password:0,
      
//       });
  
//       if (!userData) {
//         return res.status(401).json({ message: "Unauthorized. User not found." });
//       }
  
//       req.token = token;
//       req.user = userData;
//       req.userId = userData._id;
  
//       // Move on to the next middleware or route handler
//       next();
//     } catch (error) {
//       return res.status(401).json({ message: "Unauthorized. Invalid token." });
//     }
//   };

//   export default authMiddleware;