import React, { useEffect, useRef, useState } from "react";
import { db, auth } from "../firebase-config";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  where,
  query,
} from "firebase/firestore";

function Chat({ room, setRoom, signUserOut }) {
  const [newMessage, setNewMessage] = useState("");
  const [message, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const messagesRef = collection(db, "messages");

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.docs.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
    return () => unsubscribe();
  }, [room]);

  // 👇 scroll to bottom every time messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      room,
    });

    setNewMessage("");
  };

  return (
    <div className="chat-container max-w-xxl mx-auto bg-amber-600 py-0 px-4 shadow-md text-white h-screen overflow-y-scroll">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-amber-600 py-4">
        <h2 className="text-2xl font-semibold mb-4">Welcome to {room}</h2>
        <div className="flex">
          <button
            onClick={() => setRoom(null)}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md cursor-pointer transition duration-300"
          >
            Change Room
          </button>
          <button
            onClick={signUserOut}
            className="bg-yellow-500 hover:bg-yellow-400 text-white font-semibold py-2 px-4 rounded-md ml-2 cursor-pointer transition duration-300"
          >
            Sign Out
          </button>
        </div>
      </div>

      {message?.map((msg) => (
        <div
          key={msg?.id}
          className="mb-2 p-2 bg-yellow-300 rounded-lg text-black flex flex-wrap justify-between"
        >
          <div className="font-bold">{msg?.user}</div>
          <div className="text-right">
            <div className="mx-4 font-semibold">{msg?.text}</div>
            <div className="text-xs">
              {msg?.createdAt?.toDate
                ? msg.createdAt.toDate().toLocaleString()
                : "Sending..."}
            </div>
          </div>
        </div>
      ))}

      {/* dummy div for auto-scroll */}
      <div ref={messagesEndRef} />
      <form
        onSubmit={handleSubmit}
        className="chat-form mt-4 flex gap-2 sticky bottom-0 bg-amber-600 py-4"
      >
        <input
          type="text"
          placeholder="Type a message..."
          className="bg-white text-black p-2 rounded-lg flex-grow focus:outline-none focus:border-amber-800"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-yellow-300 p-2 rounded-lg hover:bg-yellow-400 transition duration-300 cursor-pointer text-black font-semibold"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
