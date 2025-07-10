// src/components/ChatWindow.js
import React, { useEffect, useRef, useState } from 'react';
import './ChatWindow.css';
import EmojiPicker from 'emoji-picker-react';
import CryptoJS from 'crypto-js';
// import { AuthContext } from '../context/AuthContext';

const isMobile = window.innerWidth <= 768;

const ChatWindow = ({
  selectedUser,
  messages,
  message,
  setMessage,
  handleSendMessage,
  BASE_URL,
  handleBack,
}) => {
  const inputRef = useRef(null);
  const chatBodyRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // const { currentUser } = useContext(AuthContext);

  // focus input when user or messages change
  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedUser, messages]);

  // auto‐scroll to bottom on new messages
  useEffect(() => {
    const el = chatBodyRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages]);

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

  // auto‐grow textarea
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
      {isMobile && selectedUser && (
        <button className="back-button" onClick={handleBack} aria-label="Back">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="#00bf63"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-arrow-left"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
      )}

      {selectedUser ? (
        <>
          <div className="chat-header">
            <img
              src={
                selectedUser.profilePicture
                  ? `${BASE_URL}${selectedUser.profilePicture.replace(/\\/g, '/')}
                  `
                  : '/images/default-profile.png'
              }
              alt="User"
            />
            <h3>{selectedUser.fullName}</h3>
          </div>

          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((msg, i) => {
              let decrypted = '';
              try {
                const secretKey = msg.senderId + msg.receiverId;
                decrypted = CryptoJS.AES.decrypt(msg.message, secretKey).toString(
                  CryptoJS.enc.Utf8
                );
              } catch {
                decrypted = '[Unable to decrypt]';
              }

              const isSent = msg.senderId !== selectedUser._id;
              return (
                <div
                  key={i}
                  className={`chat-bubble ${isSent ? 'sent' : 'received'}`}
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
              onClick={() => setShowEmojiPicker((v) => !v)}
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
                  onEmojiClick={({ emoji }) => setMessage((m) => m + emoji)}
                  theme="light"
                />
              </div>
            )}
            <button
              onClick={() => {
                handleSendMessage();
                inputRef.current?.focus();
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
            <p>Start a private conversation by selecting a user from the sidebar.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
