import { isValidUser } from "../middleware/user_validator.js";
import { UserModel } from "../models/UserModels.js";
import logger from "../utilities/logger.js";

// Map to store online users
export const onlineUsers = new Map();
export const onlineUsersSocket = new Map();

let socketAsServer = "";
export const setIoObject = async (socketIo) => {
  console.log("Socket connection start");
  socketAsServer = socketIo;
  if (socketAsServer) await setSocket(socketAsServer); // Listen ws
};

export const setSocket = async (socketAsServer) => {
  try {
    socketAsServer.use(isValidUser).on("connection", async (socket) => {
      const userDetails = await UserModel.findOne({
        _id: socket.userId,
      }).select({
        _id: 1,
      });
      console.log(userDetails);
      onlineUsers.set(userDetails.id, socket.id);
      onlineUsersSocket.set(socket.id, userDetails.id);
      // When a client joins the 'fastParity' room
      socket.on("joinRoom", async (room) => {
        await socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
      });
      // Leave a room
      socket.on("leaveRoom", (room) => {
        socket.leave(room);
        console.log(`User ${socket.id} left room: ${room}`);
      });
    });
  } catch (e) {
    logger.log("Error in set socket");
    logger.log(e);
  }
};

export const sendDataToAgent = (room, name, data) => {
  if (socketAsServer) {
    socketAsServer.to(room).emit(name, data);
  }
};

export const sendDataToGameRoom = (name, data) => {
  if (socketAsServer) {
    socketAsServer.emit(name, data);
  }
};

export const sendDataToRoom = (name, data) => {
  if (socketAsServer) {
    socketAsServer.emit(name, data);
  }
};
