import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const Welcome = ({ username, setUsername, room, setRoom, setSocket }) => {
  const navigate = useNavigate();

  const joinRoom = (e) => {
    e.preventDefault();

    if (
      username.trim().length > 0 &&
      room !== "select-room" &&
      room.trim().length > 0
    ) {
      const socket = io.connect("http://localhost:4000");
      setSocket(socket);

      navigate("/chat", { replace: true });
    } else {
      alert("Fail all user info.");
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="w-[65%] md:w-1/4 bg-white shadow-lg p-8 rounded-lg transform transition-transform">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Join a Chat Room
        </h2>
        <form onSubmit={joinRoom} className="space-y-5">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Enter your username"
              className="border-2 border-gray-300 rounded-lg w-full p-3 text-gray-700 focus:outline-none focus:border-indigo-500 transition"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <select
              className="border-2 border-gray-300 rounded-lg w-full p-3 text-gray-700 focus:outline-none focus:border-indigo-500 transition"
              onChange={(e) => setRoom(e.target.value)}
            >
              <option value="select-room" disabled>
                -- Select Room --
              </option>
              <option value="javascript">Javascript</option>
              <option value="node">Node</option>
              <option value="React">React</option>
            </select>
          </div>
          <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-semibold">
            Join Room
          </button>
        </form>
      </div>
    </section>
  );
};

export default Welcome;
