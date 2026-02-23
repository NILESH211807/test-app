import { gql } from "@apollo/client";

export const GET_ME = gql`
  query getMe {
    me {
      id
      name
      email
      profile
      isActive
      role
      isVerified
      createdAt
      permission {
        activeAdmin,
        activeUser,
        deleteAdmin,
        deleteUser
      } 
    }
  }
`;