import { gql } from "@apollo/client";

const GET_POSTS = gql`
    query getPosts{
        posts{
            _id
            username
            createdAt
            body
            comments{
                _id
                userId
                username
                body
            }
            likes{
                _id
                userId
                username
                isLiked
            }
            user
        }
    }
`

const GET_LIKES = gql`

    query getLikes($postId:ID!){
        likes(postId:$postId){
            _id
            userId
            username
            isLiked
        }
    }

`

const GET_COMMENTS = gql`
    query getComments($postId:ID!){
            comments(postId:$postId){
                _id
                userId
                username
                body
            }
        }
`

export { GET_POSTS, GET_LIKES, GET_COMMENTS }