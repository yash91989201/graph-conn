import { gql } from "@apollo/client";

const SIGNUP_USER = gql`
  mutation signupUser($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      success
      message
    }
  }
`;

const LOGIN_USER = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      message
    }
  }
`;

const LOGOUT_USER = gql`
  mutation ($userId: ID!) {
    logout(userId: $userId) {
      success
      message
    }
  }
`;

export { SIGNUP_USER, LOGIN_USER, LOGOUT_USER };
