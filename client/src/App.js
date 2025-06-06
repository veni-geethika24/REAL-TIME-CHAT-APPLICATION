import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = () => {
    socket.emit("send_message", { message });
    setChat([...chat, { message, self: true }]);
    setMessage("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prevChat) => [...prevChat, { message: data.message, self: false }]);
    });

    return () => socket.off("receive_message");
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Real-Time Chat App</h1>
      <div>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div style={{ marginTop: 20 }}>
        {chat.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.self ? "right" : "left" }}>
            <b>{msg.self ? "You" : "Other"}:</b> {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
