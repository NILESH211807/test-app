const {
  signupUser,
  loginUser,
  logoutUser,
} = require("../../services/auth.service");

const authResolvers = {
  Mutation: {
    signup: (_, args, { res }) => signupUser(args, res),
    login: (_, args, { res }) => loginUser(args, res),
    logout: (_, args, { res }) => logoutUser(res),
  },
};

module.exports = authResolvers;
