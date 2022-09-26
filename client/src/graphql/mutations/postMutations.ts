import { gql } from "@apollo/client";

const ADD_POST = gql`
  mutation ($username: String!, $body: String!) {
    addPost(username: $username, body: $body) {
      _id
      username
      createdAt
      body
      comments {
        _id
        userId
        username
        body
      }
      likes {
        _id
        userId
        username
        isLiked
      }
      user
    }
  }
`;

const LIKE_POST = gql`
  mutation ($postId: ID!, $username: String!) {
    likePost(postId: $postId, username: $username) {
      _id
      userId
      username
      isLiked
    }
  }
`;

const COMMENT_ON_POST = gql`
  mutation ($postId: String!, $username: String!, $body: String!) {
    commentOnPost(postId: $postId, username: $username, body: $body) {
      _id
      userId
      username
      body
    }
  }
`;

const DELETE_POST = gql`
  mutation ($postId: String!) {
    deletePost(postId: $postId) {
      _id
      userId
      username
      body
    }
  }
`;

export { ADD_POST, LIKE_POST, COMMENT_ON_POST, DELETE_POST };
