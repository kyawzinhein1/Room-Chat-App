import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  ArrowRightEndOnRectangleIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const Room = ({ username, room, socket }) => {
  const navigate = useNavigate();
  const [roomUsers, setRoomUsers] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const boxDivRef = useRef(null);

  const getOldMessage = async () => {
    const response = await fetch(`${import.meta.env.VITE_SERVER}/chat/${room}`);
    if (response.status === 403) {
      return navigate("/");
    }
    const data = await response.json();
    setReceivedMessages((prev) => [...prev, ...data]);
  };

  useEffect(() => {
    getOldMessage();
  }, []);

  useEffect(() => {
    socket.emit("joined-room", { username, room });

    socket.on("message", (data) => {
      setReceivedMessages((prev) => [...prev, data]);
    });

    socket.on("room_users", (data) => {
      setRoomUsers(data);
    });

    return () => socket.disconnect();
  }, [socket]);

  const sendMessage = () => {
    if (message.trim().length > 0) {
      socket.emit("message_send", message);
      setMessage("");
    }
  };

  const leaveRoom = () => {
    navigate("/");
  };

  useEffect(() => {
    if (boxDivRef.current) {
      boxDivRef.current.scrollTop = boxDivRef.current.scrollHeight;
    }
  }, [receivedMessages]);

  return (
    <section className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-blue-700 text-white transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:w-1/3 md:block`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 left-4 text-white p-1 rounded-full hover:bg-blue-600 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <XMarkIcon width={24} />
        </button>

        <p className="text-2xl font-extrabold text-center mt-10 md:mt-5">
          Room.io
        </p>
        <div className="mt-8 px-4">
          <div className="text-lg flex items-center gap-2 mb-4">
            <ChatBubbleLeftRightIcon width={28} />
            <span>Room Name</span>
          </div>
          <p className="bg-white text-blue-600 px-4 py-2 rounded-tl-lg rounded-bl-lg mb-6 font-semibold text-lg">
            {room}
          </p>
          <div className="text-lg flex items-center gap-2 mb-3">
            <UserGroupIcon width={28} />
            <span>Users</span>
          </div>
          <div className="space-y-2">
            {roomUsers.map((user, i) => (
              <p
                key={i}
                className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg ${
                  user.username === username ? "bg-blue-500" : "bg-blue-400"
                }`}
              >
                <UserIcon width={20} />
                {user.username === username ? "You" : user.username}
              </p>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="mt-4 md:absolute md:bottom-0 p-3 w-full flex items-center gap-2 justify-center bg-blue-800 hover:bg-blue-900 rounded-lg transition-all duration-200 text-lg"
          onClick={leaveRoom}
        >
          <ArrowRightEndOnRectangleIcon width={24} />
          Leave Room
        </button>
      </div>

      {/* Chat Section */}
      <div className="flex flex-col w-full pt-5 px-3 md:px-5 relative">
        {/* Mobile Toggle Button fixed in chat section */}
        {!isSidebarOpen && (
          <button
            className="absolute top-4 left-4 p-2 bg-blue-600 bg-opacity-80 text-white rounded-full shadow-lg hover:bg-blue-600 md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Bars3Icon width={22} />
          </button>
        )}

        {/* Messages */}
        <div
          className="flex-grow overflow-y-auto p-4 space-y-3 bg-white rounded-lg shadow-lg mb-4"
          ref={boxDivRef}
        >
          {receivedMessages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg w-4/5 md:w-3/5 ${
                msg.username === username
                  ? "bg-green-100 ml-auto text-right"
                  : "bg-blue-100 text-left"
              }`}
            >
              <p className="text-xs font-semibold">
                {msg.username === username ? "You" : msg.username}
              </p>
              <p className="text-sm">{msg.message}</p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(msg.sent_at))} ago
              </p>
            </div>
          ))}
        </div>

        {/* Input and Send Button */}
        <div className="flex items-center px-3 py-3 bg-gray-100 rounded-lg shadow-lg">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="button"
            onClick={sendMessage}
            className="ml-2 p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-transform transform hover:-rotate-45 duration-200"
          >
            <PaperAirplaneIcon width={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Room;
