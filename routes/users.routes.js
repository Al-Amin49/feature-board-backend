import express from "express";
import { usersController } from "../controllers/users.controller.js";
import zodValidateMiddleware from "../middlewares/zodValidate.middleware.js";
import { zodAuthValidationSchema } from "../validator/zodAuth.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middlware.js";

const router = express.Router();

router
  .route("/register")
  .post(
    zodValidateMiddleware(zodAuthValidationSchema.signupValidationSchema),
    usersController.register
  );
router
  .route("/login")
  .post(
    zodValidateMiddleware(zodAuthValidationSchema.loginValidationSchema),
    usersController.login
  );

  router.route('/user').get(authMiddleware, usersController.userDetails)
  router.route('/allusers').get(authMiddleware, adminMiddleware, usersController.getAllUsers)
  router.delete("/:id", authMiddleware, adminMiddleware, usersController.deleteUser )
  //makeadmin
  router.put("/makeAdmin/:id", authMiddleware, adminMiddleware, usersController.makeAdmin );
  //change password
  router.put("/change-password", authMiddleware,  usersController.changePassword );
  //update-profile
  router.put("/update-profile", authMiddleware,  usersController.updateProfile );


export default router;
