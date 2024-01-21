import express from "express";
const router = express.Router();
import { featuresController } from "../controllers/features.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import featureWithVotes from "../utils/getFeatureWIthVotes.js";
import adminMiddleware from "../middlewares/admin.middlware.js";

//search based on title and description
router.get("/search", featuresController.searchFeatures);
//getAllFeatures and createFeature wit route chaining
router
  .route("/")
  .get(featuresController.getAllFeatures)
  .post(authMiddleware, featuresController.createFeature);

//update feature
router.patch("/:id", authMiddleware, featuresController.editFeature);
//getFeatures by id
router.get("/:id", featuresController.getFeatureById);
//delete feature by id
router.delete("/:id", authMiddleware, featuresController.deleteFeature);


// Add a new route for voting and unvoting
router.post("/:id/vote", authMiddleware, featuresController.voteFeature);
router.get("/:id/vote", featuresController.getAllVoters);


// Private Route (require authentication) for comments
router.post(
  "/:id/comments",
  authMiddleware,
  featuresController.addComment
);
//get all comments
router.get(
  "/:id/comments",
  featuresController.getAllComments
);
router.patch(
  "/:id/comments/:commentId",
  authMiddleware,
  featuresController.editComment
);
//getTotalvoteCount
router.get('/votes/count', authMiddleware, featuresController.getTotalVotesCount )
//getTotalCOmments count
router.get('/comments/count', authMiddleware, featuresController.getTotalCommentsCount )
router.get('/votes', featureWithVotes);
//update status
router.put("/:id", authMiddleware, adminMiddleware, featuresController.updateStatus)

export default router;
