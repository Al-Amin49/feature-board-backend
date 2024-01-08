import { Feature } from "../models/feature.model.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import mongoose from 'mongoose'
/*-------------------
 @desc    Create a new feature
 @route   POST api/v1/features
 @access  Private
*/
const createFeature = asyncWrapper(async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user._id;
  const newFeature = new Feature({
    title,
    description,
    user: userId,
  });
  const savedFeature = await newFeature.save();
  res.status(201).json(savedFeature);
});

/*-------------------
 @desc    Get a single feature by ID
 @route   GET api/v1/features/:id
 @access  Public
*/
const getFeatureById = asyncWrapper(async (req, res) => {
  const feature = await Feature.findById(req.params.id)
    

  if (!feature) {
    return res.status(404).json({ message: "Feature not found" });
  }

  res.status(200).json(feature);
});

/*-------------------
 @desc    Get all features
 @route   GET api/v1/features
 @access  Public
*/

const getAllFeatures = asyncWrapper(async (req, res) => {
  const features = await Feature.find();
  res.status(200).json(features);
});

/*-------------------
 @desc    Edit a feature by ID (Authenticated Users Only)
 @route   Patch api/v1/features/:id
 @access  Private
*/
const editFeature = asyncWrapper(async (req, res) => {
  const { title, description } = req.body;

  const updatedFeature = await Feature.findByIdAndUpdate(
    req.params.id,
    { $set: { title, description } },
    { new: true }
  );

  if (!updatedFeature) {
    return res.status(404).json({ message: "Feature not found" });
  }

  res.status(200).json(updatedFeature);
});

/*-------------------
 @desc    Delete a feature by ID (Authenticated Users Only)
 @route   DELETE api/v1/features/:id
 @access  Private
*/
const deleteFeature = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const deletedFeature = await Feature.findByIdAndDelete(id);

  if (!deletedFeature) {
    return res.status(404).json({ message: "Feature not found" });
  }

  res.status(200).json({ message: "Feature successfully deleted" });
});

/*-------------------
 @desc    Search for features based on title and description
 @route   GET api/v1/features/search?query=search
 @access  Public
*/

const searchFeatures = asyncWrapper(async (req, res) => {
  console.log('Received request:', req.url);
  const { query } = req.query;
  // Validate that the 'query' parameter is present
  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }
  console.log("search result query", query);
  try {
    const searchResults = await Feature.find({
      $or: [
        { title: { $regex: new RegExp(query, 'i') } },
        { description: { $regex: new RegExp(query, 'i') } },
      ],
    });
    console.log('search', searchResults);
    res.status(200).json(searchResults);
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*-------------------
 @desc    Get features with sorting options
@route   GET api/v1/features/sort/:option
 @access  Public
*/
const sortFeatures = asyncWrapper(async (req, res) => {
  const { option } = req.params;
  let sortQuery = {};
  switch (option) {
    case "votes":
      sortQuery = { votes: -1 }; // Sort by number of votes in descending order
      break;

    case "comments":
      sortQuery = { "comments.length": -1 };
      break;
    case "new":
      sortQuery = { createdAt: -1 };
      break;
    case "top":
      // Combine votes and comments for top sorting
      sortQuery = { votes: -1, "comments.length": -1 };
      break;
    default:
      break;
  }
  const sortedFeatures = await Feature.find().sort(sortQuery);

  res.status(200).json(sortedFeatures);
});

/*-------------------
 @desc    Vote/Unvote a feature by ID (Authenticated Users Only)
 @route   POST api/v1/features/:id/vote
 @access  Private
*/
const voteFeature = asyncWrapper(async (req, res) => {
  const feature = await Feature.findById(req.params.id);

  // Check if the user has already voted
  const hasVotedIndex = feature.votes.findIndex((vote) => vote.equals(req.user._id));

  if (hasVotedIndex !== -1) {
    // User has voted, so unvote
    feature.votes.splice(hasVotedIndex, 1);
  } else {
    // User has not voted, so vote
    feature.votes.push(req.user._id);
  }

  await feature.save();

  // Fetch the updated feature after voting
  const updatedFeature = await Feature.findById(req.params.id);

  res.status(200).json({ message: "Vote updated successfully", feature: updatedFeature });
});

/*-------------------
 @desc    Get all voters for a feature by ID with usernames
 @route   GET api/v1/features/:id/voters
 @access  Public
*/
const getAllVoters = asyncWrapper(async (req, res) => {
  const feature = await Feature.findById(req.params.id)
    .populate('votes', 'username'); 

  // Check if the feature exists
  if (!feature) {
    return res.status(404).json({ message: 'Feature not found' });
  }

  const voters = feature.votes.map((user) => ({
    _id: user._id,
    username: user.username,
  }));

  res.status(200).json(voters);
});



/*-------------------
 @desc    Add a comment to a feature by ID (Authenticated Users Only)
 @route   POST api/v1/features/:id/comments
 @access  Private
*/
const addComment = asyncWrapper(async (req, res) => {
  const { text } = req.body;
  const feature = await Feature.findById(req.params.id);

  const newComment = {
    user: req.user._id,
    text,
    reactions: [],
  };

  feature.comments.push(newComment);
  await feature.save();

  res.status(201).json(newComment);
});

/*-------------------
 @desc    Get all comments for a feature by ID
 @route   GET api/v1/features/:id/comments
 @access  Public
*/
const getAllComments = asyncWrapper(async (req, res) => {
  const feature = await Feature.findById(req.params.id);

  // Check if the feature exists
  if (!feature) {
    return res.status(404).json({ message: 'Feature not found' });
  }

  const comments = feature.comments;

  res.status(200).json(comments);
});

/*-------------------
 @desc    Edit a comment on a feature by Feature ID and Comment ID (Authenticated Users Only)
 @route   PUT api/v1/features/:featureId/comments/:commentId
 @access  Private
*/
// Edit a comment
const editComment = asyncWrapper(async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;

  try {
    const updatedFeature = await Feature.findOneAndUpdate(
      { 'comments._id': new mongoose.Types.ObjectId(id) }, // Add 'new' here
      { $set: { 'comments.$.text': text } },
      { new: true }
    );

    // Check if the feature was found and updated
    if (!updatedFeature) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Find the updated comment by ID
    const updatedComment = updatedFeature.comments.find(comment => comment._id.toString() === id.toString());

    // Respond with the updated comment
    res.status(200).json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




export const featuresController = {
  createFeature,
  getAllFeatures,
  editFeature,
  getFeatureById,
  deleteFeature,
  searchFeatures,
  sortFeatures,
  voteFeature,
  addComment,
  getAllComments,
  editComment,
  getAllVoters
};
