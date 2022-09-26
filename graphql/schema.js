import cookie from "cookie";
import bcrypt from "bcryptjs";
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLSchema,
} from "graphql";
// import graphql types
import {
  UserType,
  CommentType,
  LikeType,
  PostType,
  CustomResopnseType,
} from "./types.js";
import User from "../db/models/user.js";
import Post from "../db/models/post.js";

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // user queries
    // post queries
    posts: {
      type: new GraphQLList(PostType),
      resolve(_, __, context) {
        const { isAuth } = context;
        if (isAuth) return Post.find();
        throw new Error("not authorized");
      },
    },
    likes: {
      type: new GraphQLList(LikeType),
      args: {
        postId: { type: GraphQLString },
      },
      async resolve(_, args, context) {
        const { isAuth } = context;
        const { postId } = args;
        try {
          if (!isAuth) throw new Error("not authorized");
          const { comments } = await Post.findOne(
            { _id: postId },
            { likes: true }
          );
          return comments;
        } catch (error) {
          return error;
        }
      },
    },
    comments: {
      type: new GraphQLList(CommentType),
      args: {
        postId: { type: GraphQLString },
      },
      async resolve(_, args, context) {
        const { isAuth } = context;
        const { postId } = args;
        try {
          if (!isAuth) throw new Error("not authorized");
          const { comments } = await Post.findOne(
            { _id: postId },
            { comments: true }
          );
          return comments;
        } catch (error) {
          return error;
        }
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "mutations",
  fields: {
    // user mutations
    signup: {
      type: CustomResopnseType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args) {
        const { username, email, password } = args;
        try {
          const userExists = await User.findOne({ username });
          if (userExists) throw new Error("User already exists.");
          const newUser = new User({
            username,
            password,
            email,
          });
          newUser.save();
          return {
            success: true,
            message: "User signup successful",
          };
        } catch (error) {
          console.error(error);
          return error;
        }
      },
    },
    login: {
      type: CustomResopnseType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args, context) {
        const { res } = context;
        const { email, password } = args;
        try {
          const existingUser = await User.findOne({ email });
          if (!existingUser) throw new Error("Invalid Credentials");
          const isPasswordMatching = await bcrypt.compare(
            password,
            existingUser.password
          );
          if (!isPasswordMatching) throw new Error("Invalid Credentials");
          let token = await existingUser.generateAuthToken();
          res.setHeader(
            "Set-Cookie",
            cookie.serialize("jwtToken", token, {
              expires: new Date(Date.now() + 36000000),
              httpOnly: true,
              path: "/",
            })
          );
          return {
            success: true,
            message: "User login successful",
          };
        } catch (error) {}
      },
    },
    logout: {
      type: CustomResopnseType,
      async resolve(_, __, context) {
        const { res, isAuth, userId } = context;
        if (!isAuth) throw new Error("not authorized");
        const queryRes = await User.updateOne(
          { _id: userId },
          { $set: { tokens: [] } }
        );
        if (
          queryRes.acknowledged &&
          queryRes.modifiedCount == 1 &&
          queryRes.matchedCount == 1
        ) {
          res.setHeader(
            "Set-Cookie",
            cookie.serialize("jwtToken", "", {
              expires: new Date(Date.now()),
              httpOnly: true,
              path: "/",
            })
          );
          return { success: true, message: "Logged Out successfully" };
        }

        return { success: false, message: "Unable to logout" };
      },
    },
    // post mutations
    addPost: {
      type: PostType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        body: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(_, args, context) {
        const { isAuth, userId } = context;
        const { username, body } = args;
        try {
          if (!isAuth) throw new Error("Not Authorized");
          const newPost = new Post({ username, body, user: userId });
          return newPost.save();
        } catch (error) {
          return error;
        }
      },
    },
    likePost: {
      type: new GraphQLList(LikeType),
      args: {
        postId: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args, context) {
        const { isAuth, userId } = context;
        const { postId, username } = args;
        try {
          if (!isAuth) throw new Error("Not Authorized");
          const { acknowledged, modifiedCount, matchedCount } =
            await Post.updateOne(
              { _id: postId },
              {
                $push: {
                  likes: {
                    userId,
                    username,
                    isLiked: true,
                  },
                },
              }
            );
          if (acknowledged && modifiedCount == 1 && matchedCount == 1) {
            const queryResult = await Post.findOne(
              { _id: postId },
              { likes: true, _id: false }
            );
            return queryResult.likes;
          }
          throw new Error("Unable to like post");
        } catch (error) {
          console.log(error);
          return error;
        }
      },
    },
    commentOnPost: {
      type: new GraphQLList(CommentType),
      args: {
        postId: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        body: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args, context) {
        const { isAuth, userId } = context;
        const { postId, username, body } = args;
        try {
          if (!isAuth) throw new Error("Not Authorized");
          const { acknowledged, modifiedCount, matchedCount } =
            await Post.updateOne(
              { _id: postId },
              { $push: { comments: { userId, username, body } } }
            );

          if (acknowledged && modifiedCount == 1 && matchedCount == 1) {
            const queryResult = await Post.findOne(
              { _id: postId },
              { comments: true, _id: false }
            );
            return queryResult.comments;
          }
          throw new Error("Unable to comment on post");
        } catch (error) {
          return error;
        }
      },
    },
    deletePost: {
      type: new GraphQLList(PostType),
      args: {
        postId: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args, context) {
        const { postId } = args;
        const { isAuth, userId } = context;
        try {
          if (!isAuth) throw new Error("Not Authorized");
          const post = await Post.findOne({ _id: postId });
          if (post.user != userId)
            throw new Error("post can be only deleted by its creator");
          const { acknowledged, deletedCount } = await Post.deleteOne({
            _id: postId,
          });
          if (acknowledged && deletedCount == 1)
            return await Post.findOne(
              { _id: postId },
              { likes: true, _id: false }
            );
          throw new Error("Unable to delete post");
        } catch (error) {
          console.error(error);
          return error;
        }
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation,
});
