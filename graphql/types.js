import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

const UserType = new GraphQLObjectType({
  name: "Client",
  fields: {
    _id: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

const LoginType = new GraphQLObjectType({
  name: "Login",
  fields: {
    _id: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

const LogoutType = new GraphQLObjectType({
  name: "Logout",
  fields: {
    success: { type: GraphQLString },
    message: { type: GraphQLString },
  },
});

const CommentType = new GraphQLObjectType({
  name: "Comment",
  fields: {
    _id: { type: GraphQLID },
    userId: { type: GraphQLID },
    username: { type: GraphQLString },
    body: { type: GraphQLString },
  },
});

const LikeType = new GraphQLObjectType({
  name: "Like",
  fields: {
    _id: { type: GraphQLID },
    userId: { type: GraphQLID },
    username: { type: GraphQLString },
    isLiked: { type: GraphQLBoolean },
  },
});

const PostType = new GraphQLObjectType({
  name: "Post",
  fields: {
    _id: { type: GraphQLID },
    username: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    body: { type: GraphQLString },
    comments: { type: CommentType },
    likes: { type: LikeType },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.id);
      },
    },
  },
});

export { UserType, LoginType, LogoutType, CommentType, LikeType, PostType };
