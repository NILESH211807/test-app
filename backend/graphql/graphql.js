const { ApolloServer } = require("@apollo/server");
const { typeDefs, resolvers } = require("./index");

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    formatError: (err) => {
      return {
        message: err.message,
        code: err.extensions?.code || "INTERNAL_SERVER_ERROR",
      };
    },
  });

  await server.start();
  return server;
};

module.exports = { startServer };
