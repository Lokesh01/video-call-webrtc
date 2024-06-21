import { Socket } from "socket.io";
import { v4 as UUIDv4 } from "uuid";

const roomHandler = (socket: Socket) => {
  const createRoom = () => {
    const roomId = UUIDv4(); // * this'll be our unique room id in which multiple connections can exchange data

    socket.join(roomId); // * we will make the socket connection enter a new room

    socket.emit("room-created", { roomId }); // * an event will be emitted from server side that socket connection has been added to a room
    console.log("room created with id", roomId);
  };

  const joinedRoom = ({ roomId }: { roomId: string }) => {
    console.log("joined a new room", roomId);
  };

  socket.on("create-room", createRoom); // * event emitted from client side to create a new room
  socket.on("joined-room", joinedRoom); // * event from client to join room
};

export default roomHandler;
