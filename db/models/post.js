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
      userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      username: String,
      body: String,
    },
  ],
  likes: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      username: String,
      isLiked: Boolean,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

export default mongoose.models.PostSchema || mongoose.model("Post", PostSchema);
