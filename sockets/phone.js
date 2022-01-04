module.exports = function (socket, io, connections) {
  socket.on("callUser", ({ userToCall, signalData, from, user }) => {
    const findConnection = connections.filter((c) => c.userid == userToCall);

    if (findConnection && findConnection.length == 1) {
      io.to(findConnection[0].socketId).emit("callUser", {
        signal: signalData,
        from,
        user,
      });
    }
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("leave_call", (data) => {
    const { to_userId } = data;
    const findConnection = connections.filter((c) => c.userid == to_userId);
    console.log("findConnection", findConnection);
    if (findConnection && findConnection.length > 0) {
      findConnection.map((f) => {
        io.to(f.socketId).emit("end_call", {
          message: "success",
        });
      });
    }
  });
};
