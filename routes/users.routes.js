import express from 'express'
import { usersController } from '../controllers/users.controller.js';

const router= express.Router();

router.route('/').post(usersController.register).post(usersController.login)
export default router;