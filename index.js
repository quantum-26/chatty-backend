import { typeDefs } from './Schemas/gqlSchema.js';
import resolvers from './Resolver/gqlResolvers.js';
// import { createServer } from 'graphql-yoga';
// import { PubSub } from 'graphql-subscriptions';
import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import userRouter from './Route/Users.js';
// import { makeExecutableSchema } from '@graphql-tools/schema'

import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

// configuring port and configs
const app = express();
dotenv.config();
const PORT = process.env.PORT || 7000;

// express coonection and routes
app.use(express.json());
app.use(cors());
app.use("/users", userRouter);

app.get('/', (req, res) => { // send a get request to root directory ('/' is this file (app.js))
  return res.status(200).json({
    success: false, 
  })
})

// Graphql server connection
// both of the server and graphql are running on port 7000
// http://localhost:7000/graphql to access the query , mutation, subscription
// const pubsub = new PubSub();
// const schema = makeExecutableSchema({
//   resolvers: [resolvers],
//   typeDefs: [typeDefs],
//   // context: { pubsub },
// })
// const server = createServer({ schema })
// app.use('/graphql', server);

//  second approach

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create an Express app and HTTP server; we will attach both the WebSocket
// server and the ApolloServer to this HTTP server.
const httpServer = createServer(app);

// Create our WebSocket server using the HTTP server we just set up.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});
// Save the returned server's info so we can shutdown this server later
const serverCleanup = useServer({ schema }, wsServer);

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  csrfPrevention: true,
  cache: "bounded",
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});
await server.start();
server.applyMiddleware({ app });

// Now that our HTTP server is fully set up, we can listen to it.
httpServer.listen(PORT, () => {
  console.log(
    `Server is now running on http://localhost:${PORT}${server.graphqlPath}`,
  );
});

// app.use(express.static("public"));
// app.listen(PORT, () => {
//   console.log(`The api server has started on port: ${PORT}`);
// })



