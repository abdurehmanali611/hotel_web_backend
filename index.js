import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import 'dotenv/config';

const prisma = new PrismaClient();

const typeDefs = gql`
  type User {
    id: Int!
    UserName: String!
    HotelName: String!
    Password: String!
    Role: String!
    LogoUrl: String!
  }

  type Query {
    admin: [User!]!
  }

  type Mutation {
    CreateAdmin(UserName: String!, Password: String!, Role: String!, HotelName: String!, LogoUrl: String!): User!
  }
`;

const resolvers = {
  Query: {
    admin: async () => {
      return await prisma.user.findMany();
    },
  },
  Mutation: {
    CreateAdmin: async (_, { UserName, Password, Role, HotelName, LogoUrl }) => {
      const hashedPassword = await bcrypt.hash(Password, 12);
      return await prisma.user.create({
        data: { UserName, Password: hashedPassword, Role, HotelName, LogoUrl },
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
    console.log(`Server ready at http://localhost:${port}/graphql`);
  });
}

startServer().catch((error) => {
  console.error("Server startup error:", error);
});