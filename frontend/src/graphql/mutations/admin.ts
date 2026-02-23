import { gql } from "@apollo/client";

export const CHANGE_ACCOUNT_STATUS = gql`
  mutation changeAccountStatus($userId: String!) {
    changeAccountStatus(userId: $userId) {
        success
      message
      data{
        id,
        isActive
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($userId: String!) {
    deleteUser(userId: $userId) {
        success
      message
      data{
        id,
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($name: String!, $email: String!, $password: String!, $isActive: Boolean!, $isVerified: Boolean!) {
    addUser(name: $name, email: $email, password: $password, isActive: $isActive, isVerified: $isVerified) {
        success
      message
    }
  }

`

export const ADD_NEW_ADMIN = gql`
  mutation addAdmin($name: String!, $email: String!, $isActive: Boolean!, $isVerified: Boolean!, $role: String!) {
    addAdmin(name: $name, email: $email, isActive: $isActive, isVerified: $isVerified, role: $role) {
        success
      message
    }
  }
`

export const SET_NEW_PASSWORD = gql`
  mutation setNewPassword($token: String!, $password: String!) {
    setNewPassword(token: $token, password: $password) {
        success
      message
    }
  }
`;

export const CHANGE_FILE_VISIBILITY = gql`
  mutation changeFileVisibility($fileId: String!, $visibility: String!) {
  changeFileVisibility(fileId: $fileId, visibility: $visibility) {
    success,
    message
  }
}
`