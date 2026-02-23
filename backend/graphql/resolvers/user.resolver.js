const { getUserProfile } = require("../../services/user.service");

const userResolvers = {
  Query: {
    me: async (_, args, { user }) => await getUserProfile(user),
  },
};

module.exports = userResolvers;
