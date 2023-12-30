import { Feature } from "../models/feature.model.js";
import asyncWrapper from "../utils/asyncWrapper.js";

/*-------------------
 @desc    Create a new feature
 @route   POST api/v1/features
 @access  Private
*/
const createFeature=asyncWrapper(async(req, res)=>{
    const {title, description, imageUrl}=req.body;
    const userId= req.user._id;
    const newFeature= new Feature({
        title,
        description,
        user:userId,
        imageUrl
    })
    const savedFeature= await newFeature.save();
    res.status(201).json(savedFeature)

})
/*-------------------
 @desc    Get all features
 @route   GET api/v1/features
 @access  Public
*/
const getAllFeatures=asyncWrapper(async(req, res)=>{
   const features= await Feature.find();
   res.status(200).json(features)
})

const editFeature = asyncWrapper(async (req, res) => {
    const { title, description, imageUrl } = req.body;
  
    const updatedFeature = await Feature.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, imageUrl } },
      { new: true }
    );
  
    if (!updatedFeature) {
      return res.status(404).json({ message: "Feature not found" });
    }
  
    res.status(200).json(updatedFeature);
  });

/*-------------------
 @desc    Search for features based on title and description
 @route   GET api/v1/features/search?query=search
 @access  Public
*/

const searchFeatures=asyncWrapper(async(req, res)=>{
    const { query } = req.query;
    console.log('search result query',query); 
    const searchResults= await Feature.find({
        $or:[
        {
            title:{
                $regex: new RegExp(query, 'i')
            }
        },
        {
            description:{
                $regex: new RegExp(query, 'i')
            }
        },
        ]
    }).exec();
    console.log('sea',searchResults); 
    res.status(200).json(searchResults);
})
  
export const featuresController= {createFeature, getAllFeatures, editFeature, searchFeatures}