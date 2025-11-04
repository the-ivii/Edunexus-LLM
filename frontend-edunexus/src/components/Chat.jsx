import { useState, useEffect, useContext, useRef } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import './Chat.css';

const Chat = ({ courseId }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('join-course', courseId);

    newSocket.on('previous-messages', (msgs) => {
      setMessages(msgs);
    });

    newSocket.on('new-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.emit('leave-course', courseId);
      newSocket.close();
    };
  }, [courseId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      socket.emit('send-message', {
        courseId,
        senderId: user._id,
        content: newMessage.trim()
      });
      setNewMessage('');
    }
  };

  return (
    <div className="chat-container card">
      <div className="chat-header">
        <h3>Course Discussion</h3>
        <p>{messages.length} messages</p>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender._id === user._id ? 'own-message' : ''}`}
            >
              <div className="message-header">
                <span className="message-sender">{message.sender.name}</span>
                <span className="message-role">{message.sender.role}</span>
                <span className="message-time">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="message-content">{message.content}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button type="submit" className="btn btn-primary" disabled={!newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;