import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

const CustomResopnseType = new GraphQLObjectType({
  name: "CustomResponse",
  fields: {
    success: { type: GraphQLBoolean },
    message: { type: GraphQLString },
  },
});

const UserType = new GraphQLObjectType({
  name: "Client",
  fields: {
    _id: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
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

const CommentType = new GraphQLObjectType({
  name: "Comment",
  fields: {
    _id: { type: GraphQLID },
    userId: { type: GraphQLID },
    username: { type: GraphQLString },
    body: { type: GraphQLString },
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

export { UserType, CommentType, LikeType, PostType, CustomResopnseType };
