import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

const CreateRoom: React.FC = () => {
  const { socket } = useContext(SocketContext);

  const initRoom = () => {
    console.log("Initializing a req to create a room");
    socket.emit("create-room");
  };
  return (
    <button onClick={initRoom} className="btn btn-secondary">
      create a new room
    </button>
  );
};

export default CreateRoom;
