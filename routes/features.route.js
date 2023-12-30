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
//search based on title and description
router.get('/search', featuresController.searchFeatures)
//Get features with sorting options
router.get("/sort/:option", featuresController.sortFeatures);

export default router;