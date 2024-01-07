import { Feature } from "../models/feature.model.js";
import asyncWrapper from "../utils/asyncWrapper.js";

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
  const feature = await Feature.findById(req.params.id);

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
  const { query } = req.query;
  console.log("search result query", query);
  const searchResults = await Feature.find({
    $or: [
      {
        title: {
          $regex: new RegExp(query, "i"),
        },
      },
      {
        description: {
          $regex: new RegExp(query, "i"),
        },
      },
    ],
  });
  console.log("sea", searchResults);
  res.status(200).json(searchResults);
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

export const featuresController = {
  createFeature,
  getAllFeatures,
  editFeature,
  getFeatureById,
  deleteFeature,
  searchFeatures,
  sortFeatures,
};
