import express from "express";
const router = express.Router();
import { featuresController } from "../controllers/features.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";

//search based on title and description
router.get('/search', featuresController.searchFeatures)
//getAllFeatures and createFeature wit route chaining
router
  .route("/")
  .get(featuresController.getAllFeatures)
  .post(authMiddleware, featuresController.createFeature);

//update feature
router.patch('/:id',authMiddleware, featuresController.editFeature);
//getFeatures by id
router.get('/:id',authMiddleware, featuresController.getFeatureById);
//delete feature by id
router.delete('/:id',authMiddleware, featuresController.deleteFeature);

//Get features with sorting options
router.get("/sort/:option", featuresController.sortFeatures);

export default router;