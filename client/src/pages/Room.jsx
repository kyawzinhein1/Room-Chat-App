import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  ArrowRightEndOnRectangleIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

const Room = ({ username, room, socket }) => {
  const navigate = useNavigate();
  const [roomUsers, setRoomUsers] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [message, setMessage] = useState("");

  const boxDivRef = useRef(null);

  const getOldMessage = async () => {
    const response = await fetch(`${import.meta.env.VITE_SERVER}/chat/${room}`);
    if (response.status === 403) {
      return navigate("/");
    }
    const data = await response.json();
    setReceivedMessages((prev) => [...prev, ...data]);
  };

  useEffect((_) => {
    getOldMessage();
  }, []);

  useEffect(
    (_) => {
      // send join user info to server
      socket.emit("joined-room", { username, room });

      // get message from server
      socket.on("message", (data) => {
        setReceivedMessages((prev) => [...prev, data]);
      });

      // get room users from server
      socket.on("room_users", (data) => {
        let prevRoomUsers = [...roomUsers];
        data.forEach((user) => {
          const index = prevRoomUsers.findIndex(
            (prevUser) => prevUser.id === user.id
          );

          if (index !== -1) {
            prevRoomUsers[index] = { ...prevRoomUsers, ...data };
          } else {
            prevRoomUsers.push(user);
          }

          setRoomUsers(prevRoomUsers);
        });
      });

      return () => socket.disconnect();
    },
    [socket]
  );

  const sendMessage = () => {
    if (message.trim().length > 0) {
      socket.emit("message_send", message);
      setMessage("");
    }
  };

  const leaveRoom = () => {
    navigate("/");
  };

  useEffect(
    (_) => {
      if (boxDivRef.current) {
        boxDivRef.current.scrollTop = boxDivRef.current.scrollHeight;
      }
    },
    [receivedMessages]
  );

  return (
    <section className="flex gap-3 h-screen">
      {/* left side */}
      <div className="w-1/3 bg-blue-600 text-white font-medium relative">
        <p className="text-xl font-bold text-center mt-5">Room.io</p>
        <div className="mt-8 ps-2">
          <p className="text-lg flex items-end gap-1">
            <ChatBubbleLeftRightIcon width={30} />
            Room Name
          </p>
          <p className="bg-white text-blue-500 ps-5 py-2 rounded-tl-full rounded-bl-full my-2">
            {room}
          </p>
        </div>
        <div className="mt-4 ps-2">
          <p className="flex items-center gap-1 text-lg mb-3">
            <UserGroupIcon width={30} />
            Users
          </p>
          {roomUsers.map((user, i) => (
            <p key={i} className="flex items-end gap-1 text-sm my-2">
              <UserIcon width={23} />
              {user.username === username ? "You" : user.username}
            </p>
          ))}
        </div>
        <button
          type="button"
          className="absolute bottom-0 p-2.5 flex gap-1 w-full items-enter mx-2 mb-2 text-lg"
          onClick={leaveRoom}
        >
          <ArrowRightEndOnRectangleIcon width={30} />
          Leave Room
        </button>
      </div>

      {/* right side */}
      <div className="w-full pt-5 relative">
        <div className="h-[33rem] overflow-y-auto" ref={boxDivRef}>
          {receivedMessages.map((msg, i) => (
            <div
              key={i}
              className={`text-white bg-blue-500 px-3 
              py-2 mb-3 w-3/5 ${
                msg.username === username
                  ? "bg-green-500 ml-auto mx-3 rounded-l-xl rounded-tr-xl"
                  : "bg-blue-500 rounded-r-xl rounded-tl-xl"
              }`}
            >
              <p className="text-sm font-medium font-mono">
                from {msg.username === username ? "me" : msg.username}
              </p>
              <p className="text-lg font-medium">{msg.message}</p>
              <p className="text-sm font-mono font-medium text-right">
                {formatDistanceToNow(new Date(msg.sent_at))}
              </p>
            </div>
          ))}
        </div>
        <div className="my-2 py-2.5 flex items-end px-2 w-full absolute bottom-0">
          <input
            type="text"
            placeholder="message ..."
            className="w-full outline-none border-b text-lg me-2"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <button type="button" onClick={sendMessage}>
            <PaperAirplaneIcon
              width={30}
              className="hover:text-blue-500 hover:-rotate-45 duration-200"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Room;
