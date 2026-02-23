const userTypeDefs = `#graphql

    type Permission {
        activeUser: Boolean
        deleteUser: Boolean
        activeAdmin: Boolean
        deleteAdmin: Boolean
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        profile: String,
        isActive:Boolean,
        role:String!
        isVerified:Boolean
        createdAt: String
        permission:Permission
    }

    
    type Query {
        me: User!
    }
`;

module.exports = userTypeDefs;
