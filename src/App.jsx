import React, { useRef, useState } from "react";
import "./App.css";
import Auth from "./components/Auth";
import Cookies from "universal-cookie";
import Chat from "./components/Chat";
import { signOut } from "firebase/auth";
import { auth } from "./firebase-config";

const cookies = new Cookies();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    cookies.get("auth-token")
  );
  const [room, setRoom] = useState(null);

  const roomInputRef = useRef(null);

  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuthenticated(false);
    setRoom(null);
  };

  const setValidRoom = () => {
    const roomName = roomInputRef.current.value;
    if (roomName.trim() !== "") {
      setRoom(roomName);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-b from-yellow-100 to-yellow-400 min-h-screen flex items-center justify-center">
        <Auth setIsAuthenticated={setIsAuthenticated} />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-b from-yellow-100 to-yellow-400 text-center ">
      {room ? (
        <Chat room={room} setRoom={setRoom} signUserOut={signUserOut} />
      ) : (
        <>
          <h1 className="text-3xl font-bold py-2 mb-1">
            Welcome to the Chat App!
          </h1>
          <div className="w-xs mt-4 flex items-center flex-col bg-amber-600 p-4 rounded-lg shadow-md max-w-sm mx-auto text-white">
            <label htmlFor="room-name" className="mb-3 font-semibold text-lg">
              Enter Room Name
            </label>
            <input
              type="text"
              placeholder="TechTalk"
              id="room-name"
              ref={roomInputRef}
              className="border text-black border-gray-300 bg-white rounded-md p-2 ml-2 w-full mb-3"
            />
            <div className="flex w-full">
              <button
                onClick={signUserOut}
                className="bg-yellow-500 hover:bg-yellow-400 text-white font-semibold py-2 px-4 rounded-md ml-2 w-[50%] cursor-pointer transition duration-300"
              >
                Sign Out
              </button>
              <button
                onClick={() => setValidRoom()}
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md ml-2 w-[50%] cursor-pointer transition duration-300"
              >
                Enter Chat
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
