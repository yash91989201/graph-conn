import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema({
  username: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  body: String,
  comments: [
    {
      username: String,
      body: String,
    },
  ],
  likes: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

export default mongoose.models.PostSchema || mongoose.model("Post", PostSchema);
