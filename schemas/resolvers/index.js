const { userResolvers } = require("./user_resolver");
const { messageResolver } = require("./message_resolver");

const resolvers = [userResolvers, messageResolver];

module.exports = {
  resolvers,
};
