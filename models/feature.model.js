import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  votes: [
   {
    user: {
       type: mongoose.Schema.Types.ObjectId, 
       ref: 'User'
      }
   }
  ],
 
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      reactions: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          type: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
  status: {
    type: String,
    default: "New",
  },
  imageUrl: {
    type: String,
  },
},
{ timestamps: true }
);
export const Feature = mongoose.model("Feature", featureSchema);
