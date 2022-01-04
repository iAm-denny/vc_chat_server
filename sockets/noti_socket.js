const { UsersNoti, Users, sequelize } = require("../models");
const { decodedToken } = require("../middlewares/decodedToken");

module.exports = function (socket, io, connections) {
  socket.on("send_token", async (data) => {
    let { user_id, page, limit } = data.data;

    if (user_id) {
      page = page ? page : 0;
      limit = limit ? limit : 10;
      const offset = page * limit;

      const raw_query =
        "SELECT users.username, users.profile_img, users.id, usersnotis.read, usersnotis.createdAt, usersnotis.receiver_id, usersnotis.user_id FROM usersnotis JOIN users ON  usersnotis.user_id  = users.id  WHERE usersnotis.receiver_id = ? LIMIT ?, ?";

      const notis = await sequelize.query(raw_query, {
        replacements: [user_id, offset, limit],
        type: sequelize.QueryTypes.SELECT,
      });

      io.sockets.emit("user_notis", {
        data: notis,
        message: "success",
      });
    } else {
      io.sockets.emit("user_notis", {
        message: "unsuccess",
      });
    }
  });

  socket.on("send_noti", async (data) => {
    if (data) {
      const { username, tagline } = data.data;
      const user = await Users.findOne({
        where: {
          username,
          tagline,
        },
      });
      if (user) {
        const findConnection = connections.filter((c) => c.userid == user.id);
        if (findConnection && findConnection.length == 1) {
          socket.to(findConnection[0].socketId).emit("send_noti", {
            notification: true,
          });
        }
      }
    }
  });
  socket.on("accpet_fri", async (data) => {
    const { sender_id } = data;

    const user = await Users.findByPk(sender_id);
    if (user) {
      const findConnection = connections.filter((c) => c.userid == user.id);
      if (findConnection && findConnection.length == 1) {
        socket.to(findConnection[0].socketId).emit("accpet_fri", {
          accpet: true,
        });
      }
    }
  });
};
