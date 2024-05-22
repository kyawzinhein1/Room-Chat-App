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
    <section className="w-full h-screen flex items-center justify-center">
      <div className="w-50 bg-gray-200 p-10 rounded-lg">
        <h2 className="text-4xl font-bold text-center text-blue-500 mb-6">
          Room
        </h2>
        <form onSubmit={joinRoom}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="username ..."
              id="username"
              className="border-2 border-blue-500 rounded-lg outline-none p-2.5 w-full text-base font-medium"
              onChange={(e) => {
                setUsername(e.target.value);
                // username = e.target.value;
                // setUsername = username;
              }}
            />
          </div>
          <div className="mb-3">
            <select
              name="room"
              id="room"
              className="border-2 border-blue-500 text-base font-medium rounded-lg w-full focus:ring-blue-500 block p-2.5 text-center"
              onChange={(e) => {
                setRoom(e.target.value);
                // room = e.target.value;
                // setRoom = room;
              }}
            >
              <option value="select-room">-- Select Room --</option>
              <option value="javascript">Javascript</option>
              <option value="node">Node</option>
              <option value="React">React</option>
            </select>
          </div>
          <button className="text-center text-base text-white bg-blue-500 py-2.5 rounded-lg font-medium w-full">
            Join Room
          </button>
        </form>
      </div>
    </section>
  );
};

export default Welcome;
