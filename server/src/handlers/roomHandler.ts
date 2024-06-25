import { Socket } from "socket.io";
import { v4 as UUIDv4 } from "uuid";
import IroomParams from "../interfaces/IroomParams";

/**
 * the below map stores for a room what all peers have joined
 * {1: [u1, u2, u3], 2: [u4,u5,u6]}
 */
const rooms: Record<string, string[]> = {};
const roomHandler = (socket: Socket) => {
  const createRoom = () => {
    const roomId = UUIDv4(); // * this'll be our unique room id in which multiple connections can exchange data

    socket.join(roomId); // * we will make the socket connection enter a new room

    rooms[roomId] = [];

    socket.emit("room-created", { roomId }); // * an event will be emitted from server side that socket connection has been added to a room
    console.log("room created with id", roomId); // * create a new entry for a new room
  };

  const joinedRoom = ({ roomId, peerId }: IroomParams) => {
    console.log("joined a new room", roomId, "with peer id as", peerId);

    if (rooms[roomId]) {
      // if given roomId already exist
      rooms[roomId].push(peerId);
      console.log("added peer to room", rooms);

      // make the user join the socket room
      socket.join(roomId);

      socket.on("ready", () => {
        // from the frontend once someone joins the room we will emit a ready event
        // then from our server we will emit an event to all the clients conn that a new peer has added
        socket.to(roomId).emit("user-joined", { peerId });
      });

      // below event is only for logging purpose
      socket.emit("get-users", {
        roomId,
        participants: rooms[roomId],
      });
    }
  };

  socket.on("create-room", createRoom); // * event emitted from client side to create a new room
  socket.on("joined-room", joinedRoom); // * event from client to join room
};

export default roomHandler;
