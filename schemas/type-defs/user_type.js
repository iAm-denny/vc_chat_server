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

const userTypeDefs = gql`
  scalar Date

  type User {
    id: ID!
    email: String!
    username: String!
    profile_img: String!
    tagline: String!
    status: String!
    createdAt: String!
    updatedAt: String!
    iat: String!
    room_id: ID
  }

  type UserNotiPagination {
    id: ID!
    username: String!
    profile_img: String!
    read: Boolean!
    createdAt: Date!
    receiver_id: ID!
    user_id: ID!
  }

  type responsesMessage {
    message: String!
    token: String
  }
  type getFriendsOrNot {
    message: String!
    users: [User]
  }

  union getUserOrNot = User | responsesMessage

  type Query {
    user: getUserOrNot!
    # getnotis(input: notisInput): [UserNotiPagination]
    getnotis: [UserNotiPagination]
    FriendList: getFriendsOrNot
  }

  type Mutation {
    createUser(input: CreateUserInput!): responsesMessage
    checkOtp(input: CheckOtpInput!): responsesMessage
    login(input: Login!): responsesMessage
    requestFriend(input: RequestFriend!): responsesMessage
    responseFriend(input: ResFriend!): responsesMessage
    updateNoti: responsesMessage
  }

  input notisInput {
    limit: Int!
    page: Int!
  }

  input RequestFriend {
    username: String!
    tagline: String!
  }

  input ResFriend {
    sender_id: ID!
    status: String!
  }

  input CreateUserInput {
    email: String!
    username: String!
    password: String!
    profile_img: String!
  }

  input CheckOtpInput {
    email: String!
    otp_code: String!
  }

  input Login {
    email: String!
    password: String!
  }
`;

module.exports = { userTypeDefs };
