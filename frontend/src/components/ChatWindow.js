import React, { useEffect, useRef, useState } from 'react';
import './ChatWindow.css';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const ChatWindow = ({
  selectedUser,
  messages,
  message,
  setMessage,
  handleSendMessage,
  BASE_URL,
  // isTyping = { isTyping },
}) => {
  const inputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // const [isTyping, setIsTyping] = useState(false);

  const addEmoji = (emoji) => {
    setMessage((prev) => prev + emoji.native);
  };

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [selectedUser, messages]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && message.trim()) {
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Just now';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    el.style.height = 'auto'; // Reset height
    const scrollHeight = el.scrollHeight;

    const maxHeight = 128;
    el.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    el.style.height = Math.min(scrollHeight, maxHeight) + 'px';
  }, [message]);

  return (
    <div
      className="chat-window"
      style={{ backgroundImage: `url('/ChatBackground.jpg')` }}
    >
      {selectedUser ? (
        <>
          <div className="chat-header">
            <img
              src={
                selectedUser.profilePicture
                  ? `${BASE_URL}${selectedUser.profilePicture.replace(
                      /\\/g,
                      '/',
                    )}`
                  : '/images/default-profile.png'
              }
              alt="User"
            />
            <h3>{selectedUser.fullName}</h3>
          </div>

          <div className="chat-body">
            {/* {console.log('messages:', messages)} */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-bubble ${
                  msg.senderId === selectedUser._id ? 'received' : 'sent'
                }`}
              >
                {msg.message}
                <div className="chat-meta">
                  <span className="time">{formatTime(msg.createdAt)}</span>
                </div>
              </div>
            ))}

            {/* <div className="typing-indicator">
                {selectedUser.fullName} is typing...
              </div> */}
            {/* {isTyping && (
              <div className="typing-indicator">
                {selectedUser.fullName} is typing...
              </div>
            )} */}
          </div>

          <div className="chat-input">
            <button
              type="button"
              className="emoji-button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            >
              😊
            </button>
            <textarea
              // title="Press Enter to send"
              ref={inputRef}
              // type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                // setIsTyping(true);
              }}
              onKeyDown={handleKeyDown}
              rows={1}
              className="chat-textarea"
            />

            {showEmojiPicker && (
              <div className="emoji-picker">
                <Picker data={data} onEmojiSelect={addEmoji} />
              </div>
            )}

            <button
              // disabled={!message.trim()}
              onClick={() => {
                handleSendMessage();
                if (inputRef.current) inputRef.current.focus();
              }}
              className="send-button"
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="chat-placeholder">
          <div className="chat-placeholder-box">
            <img src="/Fliq.png" alt="Start Chat" />
            <h2>Select a user</h2>
            <p>
              Start a private conversation by selecting a user from the sidebar.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
