import { Feature } from "../models/feature.model.js";
import asyncWrapper from "./asyncWrapper.js";

const getFeaturesWithVotes = async () => {
  try {
    // Use the aggregate pipeline to get features with votes count
    const featuresWithVotes = await Feature.aggregate([
      {
        $project: {
          title: 1,
          description: 1,
          user: 1,
          votesCount: { $size: '$votes' },
        },
      },
    ]);

    return featuresWithVotes;
  } catch (error) {
    throw error;
  }
};

/*-------------------
 @desc    Get features with their corresponding votes.
 @route   GET api/v1/features/votes
 @access  Public
*/
const featureWithVotes = asyncWrapper(async (req, res) => {
  try {
    // Instead of directly calling getFeaturesWithVotes, use it here
    const featuresWithVotes = await getFeaturesWithVotes();

    // Respond with the features data
    res.status(200).json(featuresWithVotes);
  } catch (error) {
    // Handle errors, log them, and respond with an error status
    console.error('Error fetching features with votes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default featureWithVotes;
