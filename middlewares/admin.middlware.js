
const adminMiddleware = (req, res, next) => {
    
    if (req.user && req.user.role.includes('admin')) {
      // User has the "admin" role, proceed to the next middleware or route handler
      next();
    } else {
      // User does not have the "admin" role, return unauthorized status
      res.status(403).json({ message: 'Unauthorized access . it is not admin role' });
    }
  };
  
  export default adminMiddleware;
  