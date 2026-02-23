import { gql } from "@apollo/client";

export const SIGNUP_USER_MUTATION = gql`
 mutation Signup($name: String!, $email: String!, $password: String!, $role: String) {
    signup(name: $name, email: $email, password: $password, role: $role) {
      success
      message
    }
 }`;

export const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!,$role:String) {
        login(email: $email, password: $password,role:$role) {
            success
            message,
            isPermissionAllowed
        }
    }
`;

export const LOGOUT_MUTATION = gql`
    mutation Logout {
        logout {
            success
            message
        }
    }
`;
