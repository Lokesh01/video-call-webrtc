import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SocketIoClient from "socket.io-client";

const WS_Server = "http://localhost:8000";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SocketContext = createContext<any | null>(null);

const socket = SocketIoClient(WS_Server, {
  withCredentials: false,
  transports: ["polling", "websocket"],
});

interface Props {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const enterRoom = ({ roomId }: { roomId: string }) => {
      navigate(`/room/${roomId}`);
    };

    socket.on("room-created", enterRoom); //* will redirect user to the room page once server has create new room
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
