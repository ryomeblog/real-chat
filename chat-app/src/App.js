import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const socket = socketIOClient('http://localhost:13001'); // バックエンドのURLを設定する

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    socket.on('new_message', (msgs) => {
      setMessages(msgs);
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      const newMessage = {
        username,
        content: message
      };
      socket.emit('send_message', newMessage);
      setMessage('');
    }
  };

  return (
    <div className="App">
      <h1>Real-time Chat</h1>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        {messages.map((msg, idx) => (
          <p key={idx}>
            <strong>{msg.username}</strong> ({msg.timestamp}): {msg.content}
          </p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;

