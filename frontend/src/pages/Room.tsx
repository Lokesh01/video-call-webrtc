import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";

const Room: React.FC = () => {
  const { id } = useParams();
  const { socket, user } = useContext(SocketContext);

  useEffect(() => {
    // emitting this event so that either creator of room or joinee in the room
    // anyone is added the server knows that new people have been added\
    // to this room
    if (user) socket.emit("joined-room", { roomId: id, peerId: user._id });
  }, [id, user, socket]);

  return <div>room</div>;
};

export default Room;
