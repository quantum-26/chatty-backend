import { typeDefs } from './Schemas/gqlSchema.js';
import resolvers from './Resolver/gqlResolvers.js';
import { createServer } from 'graphql-yoga';
import { PubSub } from 'graphql-subscriptions';
import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import userRouter from './Route/Users.js';
import { makeExecutableSchema } from '@graphql-tools/schema'

// configuring port and configs
const app = express();
dotenv.config();
const serverPort = process.env.SERVER_PORT || 7000;

// express coonection and routes
app.use(express.json());
app.use(cors());
app.use("/users", userRouter);

// Graphql server connection
// both of the server and graphql are running on port 7000
// http://localhost:7000/graphql to access the query , mutation, subscription
const pubsub = new PubSub();
const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefs],
  context: { pubsub },
})
const server = createServer({ schema })
app.use('/graphql', server);

app.listen(serverPort, () => {
  console.log(`The api server has started on port: ${serverPort}`);
})




