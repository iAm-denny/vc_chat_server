const { Op } = require("sequelize");
const { decodedToken } = require("../../middlewares/decodedToken");
const { Messages } = require("../../models");

const messageResolver = {
  Query: {
    getMessages: async (parent, args, context) => {
      const { receiver_id, room_id } = args.input;

      const auth_user = decodedToken(context.headers.authorization);
      try {
        if (auth_user) {
          const messages = await Messages.findAll({
            where: {
              room_id: room_id,
            },
            order: [["createdAt", "ASC"]],
          });

          return { message: "success", messages };
        } else {
          return { message: "unauthorizated" };
        }
      } catch (err) {
        console.log("err", err);
        return { message: "unsuccess" };
      }
    },
  },
  Mutation: {
    sendMessage: async (parent, args, context) => {
      const { receiver_id, message: reqMessage, room_id } = args.input;

      try {
        const auth_user = decodedToken(context.headers.authorization);
        if (auth_user) {
          const message = await Messages.create({
            sender_id: auth_user.id,
            receiver_id,
            message: reqMessage,
            room_id,
          });

          return {
            message: "success",
            messages: {
              sender_id: auth_user.id,
              receiver_id,
              message: reqMessage,
              createdAt: new Date(),
            },
          };
        } else {
          return { message: "unauthorizated" };
        }
      } catch (err) {
        console.log("err", err);
        return { message: "unsuccess" };
      }
    },
  },
};

module.exports = { messageResolver };
