const {
  getDashboardStats,
  getAdmins,
  getAllUsers,
  changeAccountStatus,
  deleteUser,
  addUser,
  addAdmin,
  setNewPassword,
  getAdminPermissions,
  updateAdminPermissions,
  getAdminCharts,
  getAdminUserStatusCharts,
  getAllExcelFile,
  changeFileVisibility,
  deleteFile,
  downloadExcelFile,
} = require("../../services/admin.service");

const adminResolvers = {
  Query: {
    getDashboardStats: async (_, __, { user }) => getDashboardStats(user),
    getAdmin: async (_, args, { user }) => getAdmins(args, user),
    getUsers: async (_, args, { user }) => getAllUsers(args, user),

    getAdminPermissions: async (_, args, { user }) =>
      getAdminPermissions(args, user),

    getAdminCharts: async (_, args, { user }) => getAdminCharts(args, user),

    getAdminUserStatusCharts: async (_, __, { user }) =>
      getAdminUserStatusCharts(user),

    getAllExcelFile: async (_, args, { user }) => getAllExcelFile(args, user),
  },
  Mutation: {
    changeAccountStatus: async (_, args, { user }) =>
      changeAccountStatus(args, user),
    deleteUser: async (_, args, { user }) => deleteUser(args, user),
    addUser: async (_, args, { user }) => addUser(args, user),
    addAdmin: async (_, args, { user }) => addAdmin(args, user),
    setNewPassword: async (_, args, { user }) => setNewPassword(args, user),

    updateAdminPermissions: async (_, args, { user }) =>
      updateAdminPermissions(args, user),

    changeFileVisibility: async (_, args, { user }) =>
      changeFileVisibility(args, user),

    deleteFile: async (_, args, { user }) => deleteFile(args, user),

    // downloadExcelFile: async (_, args, { user }) =>
    //   downloadExcelFile(args, user),
  },
};

module.exports = adminResolvers;
