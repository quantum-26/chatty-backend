export const typeDefs = `
  type Message {
    id: ID!
    senderName: String!
    receiverName: String!
    text: String!
  }
  type Query {
    messages: [Message!]
  }
  type Mutation {
    postMessage(senderName: String!, receiverName: String!, text: String!): ID!
  }
  type Subscription {
    messages: [Message!]
  }
`;
