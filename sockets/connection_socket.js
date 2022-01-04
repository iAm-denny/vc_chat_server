module.exports = function (socket, io, connections) {
  socket.on("storeClientInfo", (data) => {
    let connInfos = new Object();
    connInfos.userid = data.userid;
    connInfos.socketId = socket.id;
    connections.push(connInfos);
  });
  socket.on("disconnect", function (data) {
    for (var i = 0, len = connections.length; i < len; ++i) {
      var c = connections[i];

      if (c.socketId == socket.id) {
        connections.splice(i, 1);
        break;
      }
    }
  });
};
