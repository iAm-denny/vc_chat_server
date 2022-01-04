const { gql } = require("apollo-server-express");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

const resolverMap = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value); // ast value is always in string format
      }
      return null;
    },
  }),
};

const messageTypeDefs = gql`
  scalar Date

  type Message {
    sender_id: ID!
    receiver_id: ID!
    message: String!
    createdAt: Date!
  }

  type responsesMessage {
    message: String!
    messages: [Message]!
  }

  type oneMessage {
    message: String!
    messages: Message!
  }

  type Query {
    getMessages(input: InputMessage): responsesMessage
  }

  type Mutation {
    sendMessage(input: SendMessage): oneMessage
  }

  input InputMessage {
    receiver_id: ID!
    room_id: ID!
  }

  input SendMessage {
    receiver_id: ID!
    message: String!
    room_id: ID!
  }
`;
module.exports = { messageTypeDefs };
