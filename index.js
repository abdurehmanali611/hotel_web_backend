const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const cors = require("cors");
const { PrismaClient } = require("./generated/prisma");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const typeDefs = gql`
  type User {
    id: Int!
    username: String!
    hotelName: String!
    password: String!
    role: String!
  }

  type Query {
    admin: [User!]!
  }

  type Mutation {
    CreateAdmin(username: String!, password: String!, role: String!, hotelName: String!): User!
  }
`;

const resolvers = {
  Query: {
    admin: async () => {
      return await prisma.user.findMany();
    },
  },
  Mutation: {
    CreateAdmin: async (_, { username, password, role, hotelName }) => {
      const hashedPassword = await bcrypt.hash(password, 12);
      return await prisma.user.create({
        data: { username, password: hashedPassword, role, hotelName },
      });
    },
  },
};

async function startServer() {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  const port = 4000;
  app.listen(port, () => {
    console.log(`server ready at http://localhost:${port}/graphql`);
  });
}

startServer();
