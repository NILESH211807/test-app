const {
  createPost,
  getAllPost,
  deletePost,
} = require("../../services/post.service");

const postResolver = {
  Mutation: {
    createPost: (_, args, { user }) => createPost(args, user),
    deletePost: (_, args, { user }) => deletePost(args, user),
  },
  Query: {
    getAllPost: async (_, args, { user }) => getAllPost(user),
  },
};

module.exports = postResolver;
