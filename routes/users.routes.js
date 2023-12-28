import express from 'express'
import { usersController } from '../controllers/users.controller.js';
import zodValidateMiddleware from '../middlewares/zodValidate.middleware.js';
import { zodAuthValidationSchema } from '../validator/zodAuth.validator.js';

const router= express.Router();

router.route('/register').post(zodValidateMiddleware(zodAuthValidationSchema.signupValidationSchema), usersController.register)
router.route('/login').post(zodValidateMiddleware(zodAuthValidationSchema.loginValidationSchema),usersController.login)
export default router;