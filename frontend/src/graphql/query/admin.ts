import { gql } from "@apollo/client";

export const GET_DASH_STATS = gql`
    query getDashboardStats{
        getDashboardStats{
            totalPosts,
    totalUsers,
    todayPosts,
    todayUsers
        }
    }
`;

export const GET_ADMINS = gql`
    query getAdmin($query: String){
        getAdmin(query: $query){
              id,
    name,
    email,
    isActive,
    isVerified,
    role,
    createdAt
        }
    }
`;

export const GET_USERS = gql`
    query getUsers($page: Int, $limit: Int, $query: String){
        getUsers(page: $page, limit: $limit, query: $query){
              success,
    message,
    data {
     id,
    name,
    email,
    isActive,
    isVerified,
    role,
    createdAt
    },
    length
  }
        }
    
`;

export const GET_ADMIN_PERMISSIONS = gql`
    query getAdminPermissions ($userId:ID!){
        getAdminPermissions(userId:$userId){
            activeAdmin,
    activeUser,
    deleteAdmin,
    deleteUser
        }
    }
`;

export const UPDATE_ADMIN_PERMISSIONS = gql`
    mutation updateAdminPermissions($userId: ID!, $activeUser: Boolean!, $deleteUser: Boolean!, $activeAdmin: Boolean!, $deleteAdmin: Boolean!){
        updateAdminPermissions(userId: $userId, activeUser: $activeUser, deleteUser: $deleteUser, activeAdmin: $activeAdmin, deleteAdmin: $deleteAdmin){
            success,
            message
        }
    }

`;

export const GET_ADMIN_CHARTS = gql`
    query getAdminCharts($timeRange: String){
        getAdminCharts(timeRange: $timeRange){
            date,
    users
        }
    }
`;

export const GET_ADMIN_USER_STATUS_CHARTS = gql`
    query getAdminUserStatusCharts{
        getAdminUserStatusCharts{
            success,
    message,
    data {
      activeUsers,
      inactiveUsers,
      totalUsers,
      unverifiedUsers,
      verifiedUsers
    }
        }
    }
`;

export const GET_EXCEL_FILES = gql`
    query getExcelFiles($fileId: ID!, $page: Int, $limit: Int){
        getExcelFiles(fileId: $fileId, page: $page, limit: $limit){
            success,
  message,
  rows,
  length,
        }
    }
`;


export const GET_ALL_EXCEL_FILES = gql`
    query getAllExcelFile($isPublic: Boolean,$page: Int, $limit: Int){
        getAllExcelFile(isPublic: $isPublic, page: $page, limit: $limit){
            success,
            message,
            data
        }
    }
`;

export const DELETE_FILE = gql`
    mutation deleteFile($fileId: String!){
        deleteFile(fileId: $fileId){
            success,
            message
        }
    }
`;