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
  CustomResponseType,
  UserType,
  LoginType,
  LogoutType,
  PostType,
  CommentType,
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
    postComments: {
      type: new GraphQLList(CommentType),
      args: {
        postId: { type: GraphQLString },
      },
      async resolve(_, args, context) {
        const { isAuth } = context;
        const { postId } = args;
        if (!isAuth) throw new Error("not authorized");
        const { comments } = await Post.findOne(
          { _id: postId },
          { comments: true }
        );
        return comments;
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "mutations",
  fields: {
    // user mutations
    signup: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        confirmPassword: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args) {
        const { username, email, password, confirmPassword } = args;
        try {
          const userExists = await User.findOne({ username });
          if (userExists) {
            throw new Error("User already exists.");
          }
          const newUser = new User({
            username,
            password,
            confirmPassword,
            email,
            createdAt,
          });
          return newUser.save();
        } catch (error) {
          console.error(error);
          return error;
        }
      },
    },
    login: {
      type: LoginType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args, context) {
        const { res } = context;
        const { username, password } = args;
        try {
          const userExists = await User.findOne({ username });
          if (!userExists) throw new Error("Invalid Credentials");
          const isPasswordMatching = await bcrypt.compare(
            password,
            userExists.password
          );
          if (!isPasswordMatching) throw new Error("Invalid Credentials");
          let token = await userExists.generateAuthToken();
          res.setHeader(
            "Set-Cookie",
            cookie.serialize("jwtToken", token, {
              expires: new Date(Date.now() + 360000),
              httpOnly: true,
              path: "/",
            })
          );
          return {
            userId: userExists.id,
          };
        } catch (error) {}
      },
    },
    logout: {
      type: LogoutType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args, context) {
        const { res, isAuth } = context;
        const { userId } = args;
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
        if (!isAuth) throw new Error("Not Authorized");
        const newPost = new Post({ username, body, user: userId });
        return newPost.save();
      },
    },
    likeOnPost: {
      type: CustomResponseType,
      args: {
        postId: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args, context) {
        const { isAuth } = context;
        const { postId } = args;
        if (!isAuth) throw new Error("Not Authorized");
        const { acknowledged, modifiedCount, matchedCount } =
          await Post.updateOne({ _id: postId }, { $inc: { likes: 1 } });
        if (acknowledged && modifiedCount == 1 && matchedCount == 1)
          return { success: true, message: "Liked on post" };
        return { success: false, message: "Unable to like post" };
      },
    },
    commentOnPost: {
      type: CustomResponseType,
      args: {
        postId: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        body: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args, context) {
        const { isAuth, userId } = context;
        const { postId, username, body } = args;
        if (!isAuth) throw new Error("Not Authorized");
        const { acknowledged, modifiedCount, matchedCount } =
          await Post.updateOne(
            { _id: postId },
            { $push: { comments: { username, body } } }
          );
        if (acknowledged && modifiedCount == 1 && matchedCount == 1)
          return { success: true, message: "Commented on post" };
        return { success: false, message: "Unable to comment on post" };
      },
    },
    deletePost: {
      type: CustomResponseType,
      args: {
        postId: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args, context) {
        const { postId } = args;
        const { isAuth, userId } = context;
        try {
          if (!isAuth) throw new Error("not authorized");
          const post = await Post.findOne({ _id: postId });
          if (post.user != userId)
            throw new Error("post can be only deleted by its creator");
          const { acknowledged, deletedCount } = await Post.deleteOne({
            _id: postId,
          });
          if (acknowledged && deletedCount == 1)
            return { success: true, message: "Post deleted successfully" };
          return { success: false, message: "Unable to delete post" };
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
