const { Users } = require("../models");

module.exports = function (socket, io, connections) {
  socket.on("send_message", async (data) => {
    if (data) {
      const { messageList, newData } = data.data;
      const { receiver_id, sender_id, content } = newData;
      if (receiver_id && sender_id) {
        // const user = await Users.findByPk(id);
        // if (user) {
        const findConnection = connections.filter(
          (c) => c.userid == receiver_id
        );
        if (findConnection && findConnection.length == 1) {
          socket.to(findConnection[0].socketId).emit("send_message", {
            newData,
            messages: [...messageList, newData],
          });
        }
        // }
      }
    }
  });
};
