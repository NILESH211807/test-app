const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const authDefs = require("./schema/auth.type");
const userTypeDefs = require("./schema/user.type");
const authResolvers = require("./resolvers/auth.resolver");
const userResolvers = require("./resolvers/user.resolver");
const postResolver = require("./resolvers/post.resolver");
const postTypeDefs = require("./schema/post.type");
const adminTypeDefs = require("./schema/admin.type");
const adminResolvers = require("./resolvers/admin.resolver");
const excelFileTypeDef = require("./schema/excelFile.type");
const excelFileResolver = require("./resolvers/excelFile.resolver");
// const uploadFileTypeDef = require("./schema/uploadFile.type");
// const uploadResolver = require("./resolvers/uploadfile.resolver");

const typeDefs = mergeTypeDefs([
  authDefs,
  userTypeDefs,
  postTypeDefs,
  adminTypeDefs,
  excelFileTypeDef,
]);

const resolvers = mergeResolvers([
  authResolvers,
  userResolvers,
  postResolver,
  adminResolvers,
  excelFileResolver,
]);

module.exports = { typeDefs, resolvers };
