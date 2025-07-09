import React, { useEffect, useRef, useState, useContext } from 'react';
import './ChatWindow.css';
import EmojiPicker from 'emoji-picker-react';
import CryptoJS from 'crypto-js';
import { AuthContext } from '../context/AuthContext';

const ChatWindow = ({
  selectedUser,
  messages,
  message,
  setMessage,
  handleSendMessage,
  BASE_URL,
}) => {
  const inputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { currentUser } = useContext(AuthContext);

  // const addEmoji = (emoji) => {
  //   setMessage((prev) => prev + emoji.native);
  // };

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

    el.style.height = 'auto';
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
            {messages.map((msg, index) => {
              let decrypted = '';
              try {
                const secretKey = msg.senderId + msg.receiverId;
                decrypted = CryptoJS.AES.decrypt(
                  msg.message,
                  secretKey,
                ).toString(CryptoJS.enc.Utf8);
              } catch (err) {
                decrypted = '[Unable to decrypt]';
              }

              return (
                <div
                  key={index}
                  className={`chat-bubble ${
                    msg.senderId === selectedUser._id ? 'received' : 'sent'
                  }`}
                >
                  {decrypted}
                  <div className="chat-meta">
                    <span className="time">{formatTime(msg.createdAt)}</span>
                  </div>
                </div>
              );
            })}
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
              ref={inputRef}
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              className="chat-textarea"
            />

            {showEmojiPicker && (
              <div className="emoji-picker">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    setMessage((prev) => prev + emojiData.emoji);
                  }}
                  theme="light"
                />
              </div>
            )}

            <button
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
