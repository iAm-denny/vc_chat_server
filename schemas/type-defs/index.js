const { userTypeDefs } = require("./user_type");
const { messageTypeDefs } = require("./message_type");

const typeDefs = [userTypeDefs, messageTypeDefs];

module.exports = {
  typeDefs,
};
