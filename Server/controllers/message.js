const Message = require("../models/Message");
const OPENED_ROOMS = ["react", "node", "javascript"];

exports.getOldMessage = (req, res, next) => {
  const { roomName } = req.params;
  if (OPENED_ROOMS.includes(roomName)) {
    Message.find({ room: roomName }).select("username message sent_at").then((message) => {
      res.status(200).json(message);
    });
  } else {
    res.status(403).json("room is not open");
  }
};
