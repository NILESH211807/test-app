const authDefs = `#graphql

    type User {
        id: ID!,
        name: String,
        email: String,
        password:String,
        role: String
    }

    type AuthResponse {
      success: Boolean!
      message: String!
      isPermissionAllowed: Boolean
    }

    type Mutation {
        signup(name: String!,email: String!, password: String!,role:String):AuthResponse
        login(email: String!, password: String!, role: String): AuthResponse
        logout(email: String):AuthResponse
    } 
`;

module.exports = authDefs;
