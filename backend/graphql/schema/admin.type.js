const adminTypeDefs = `#graphql

type DashboardStats {
  totalUsers: Int!
    totalPosts: Int!
    todayUsers: Int!
    todayPosts: Int!
}

type User {
    id:ID!,
    name:String!
    email:String!
    role:String!
    isActive:Boolean!
    role:String!
    isVerified:Boolean!
    createdAt:String!
}

type AdminPermission {
   activeUser: Boolean!
    deleteUser: Boolean!
    activeAdmin: Boolean!
    deleteAdmin: Boolean! 
}

    type AdminCharts {
        date: String!
        users: Int!
    }

    type UsersResponse {
        success: Boolean!
        message: String!
    data: [User!]!
    length: Int!
    }

    type AdminUserChartsData {
        totalUsers: Int!
        activeUsers: Int!
        inactiveUsers: Int!
        verifiedUsers: Int!
        unverifiedUsers: Int!
    }

    type AdminUserChartsResponse {
        success: Boolean!
        message: String!
    data: AdminUserChartsData
    }

type Query {
    getDashboardStats: DashboardStats!
    getAdmin(query: String): [User]
    getUsers(page: Int, limit: Int, query: String): UsersResponse!

    getAdminPermissions(userId: ID!): AdminPermission!

    getAdminCharts(timeRange: String): [AdminCharts!]!
    
    getAdminUserStatusCharts: AdminUserChartsResponse!
}

type AdminResponse{
    success:Boolean!,
    message:String!
    data: User
}

type Mutation {
    changeAccountStatus(
        userId: String!
        ): AdminResponse

    deleteUser(
        userId: String!
        ):AdminResponse

    addUser(
        name: String!, 
        email: String!,
        password: String! ,
        isActive: Boolean!, 
        isVerified: Boolean!
        ): AdminResponse
   
    addAdmin(
        name: String!,
         email: String!,
         isActive: Boolean!, 
         isVerified: Boolean!
         role: String!,
         ):AdminResponse

    setNewPassword(
        token: String!, 
        password: String!
    ): AdminResponse

    updateAdminPermissions(
        userId: ID!,
        activeUser: Boolean!
    deleteUser: Boolean!
    activeAdmin: Boolean!
    deleteAdmin: Boolean! 
    ): AdminResponse
}

`;

module.exports = adminTypeDefs;
