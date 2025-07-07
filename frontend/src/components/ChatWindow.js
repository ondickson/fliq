import React, { useState } from 'react';
import './ChatWindow.css';

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hey, how are you?', sender: 'other' },
    { id: 2, text: 'I’m good! You?', sender: 'me' },
    { id: 3, text: 'All fine here as well.', sender: 'other' },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      id: Date.now(),
      text: newMessage,
      sender: 'me',
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>John Doe</h3>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
