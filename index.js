const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { typeDefs } = require("./schemas/type-defs/");
const { resolvers } = require("./schemas/resolvers/");
const { Users } = require("./models");
const db = require("./models");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const port = process.env.PORT || 4000;
const app = express();

let connections = [];
async function startApolloServer(typeDefs, resolvers) {
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    socket.emit("me", socket.id);
    require("./sockets/connection_socket")(socket, io, connections);
    require("./sockets/noti_socket")(socket, io, connections);
    require("./sockets/message_socket")(socket, io, connections);
    require("./sockets/phone")(socket, io, connections);
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => req,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  server.applyMiddleware({ app });

  db.sequelize
    .sync()
    .then(async () => {
      await new Promise((resolve) => httpServer.listen({ port }, resolve));
      console.log(`🚀 Server ready at http://localhost:4000/`);
    })
    .catch((err) => {
      console.log("err", err);
    });
}

startApolloServer(typeDefs, resolvers);
