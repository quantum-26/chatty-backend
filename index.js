import { typeDefs } from './Schemas/gqlSchema.js';
import resolvers from './Resolver/gqlResolvers.js';
import { GraphQLServer, PubSub } from 'graphql-yoga';
import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import userRouter from './Route/Users.js';

// configuring port and configs
const app = express();
dotenv.config();
const graphqlListening = process.env.graphqlPort || 4000;
const serverPort = process.env.serverPort || 7000;

// express coonection and routes
app.use(express.json());
app.use(cors());
app.listen(serverPort, () => {
  console.log(`The api server has started on port: ${serverPort}`);
})
app.use("/users", userRouter);
// Graphql server connection
const pubsub = new PubSub();

const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });
server.start(() => {
  console.log(`GraphQl Server on http://localhost:${graphqlListening}/`);
});


