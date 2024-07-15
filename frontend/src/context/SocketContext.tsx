import Peer from "peerjs";
import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import SocketIoClient from "socket.io-client";
import { v4 as UUIDv4 } from "uuid";
import { peerReducer } from "../Reducers/PeerReducer";
import { addPeerAction } from "../Actions/PeerAction";

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

  const [user, setUser] = useState<Peer>(); // new peer user
  const [stream, setStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peerReducer, {}); // peer -> state

  const fetchParticipantsList = ({
    roomId,
    participants,
  }: {
    roomId: string;
    participants: string[];
  }) => {
    console.log("Fetched room participants");
    console.log(roomId, participants);
  };

  const fetchUserFeed = async () => {
    const response = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setStream(response);
  };

  useEffect(() => {
    const userId = UUIDv4();
    const newPeer = new Peer(userId, {
      host: "localhost",
      port: 8000,
      path: "/myapp",
    });

    setUser(newPeer);
    fetchUserFeed();

    const enterRoom = ({ roomId }: { roomId: string }) => {
      navigate(`/room/${roomId}`);
    };

    socket.on("room-created", enterRoom); //* will redirect user to the room page once server has create new room

    socket.on("get-users", fetchParticipantsList);
  }, []);

  useEffect(() => {
    if (!user || !stream) return;

    socket.on("user-joined", ({ peerId }) => {
      const call = user.call(peerId, stream);

      console.log("calling the new peer", peerId);

      call.on("stream", () => {
        dispatch(addPeerAction(peerId, stream));
      });
    });

    user.on("call", (call) => {
      // what to do when other peers on the group call you when u joined
      console.log("receiving a call");
      call.answer(stream);
      call.on("stream", () => {
        dispatch(addPeerAction(call.peer, stream));
      });
    });

    socket.emit("ready");
  }, [user, stream]);

  return (
    <SocketContext.Provider value={{ socket, user, stream, peers }}>
      {children}
    </SocketContext.Provider>
  );
};
