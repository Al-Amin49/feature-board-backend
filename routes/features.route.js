import express from "express";
const router = express.Router();
import { featuresController } from "../controllers/features.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";
router
  .route("/")
  .get(featuresController.getAllFeatures)
  .post(authMiddleware, featuresController.createFeature);

//update feature
router.patch('/:id',authMiddleware, featuresController.editFeature);

router.get('/search', featuresController.searchFeatures)

export default router;