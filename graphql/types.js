import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

const CustomResponseType = new GraphQLObjectType({
  name: "Delete",
  fields: {
    success: { type: GraphQLBoolean },
    message: { type: GraphQLString },
  },
});

const UserType = new GraphQLObjectType({
  name: "Client",
  fields: {
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

const LoginType = new GraphQLObjectType({
  name: "LoginType",
  fields: {
    userId: { type: GraphQLString },
  },
});

const LogoutType = new GraphQLObjectType({
  name: "LogoutType",
  fields: {
    success: { type: GraphQLString },
    message: { type: GraphQLString },
  },
});

const CommentType = new GraphQLObjectType({
  name: "Comment",
  fields: {
    _id: { type: GraphQLID },
    body: { type: GraphQLString },
    username: { type: GraphQLString },
  },
});

const LikeType = new GraphQLObjectType({
  name: "Like",
  fields: {
    username: { type: GraphQLString },
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

export {
  CustomResponseType,
  UserType,
  LoginType,
  LogoutType,
  CommentType,
  LikeType,
  PostType,
};
