import express from 'express'
import { usersController } from '../controllers/users.controller.js';

const router= express.Router();

router.route('/register').post(usersController.register)
router.route('/login').post(usersController.login)
export default router;