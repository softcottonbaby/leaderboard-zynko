// /pages/picker.js
import { useEffect, useState, useRef } from 'react';

export default function Picker() {
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef();

  useEffect(() => {
    const es = new EventSource('/api/kick/events');

    es.onopen = () => console.log('Connected to Kick chat stream');
    es.onerror = (err) => console.error('SSE error:', err);

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.user && data.text) {
          setMessages((prev) => [...prev.slice(-49), data]);
        }
      } catch (err) {
        console.error('Failed to parse SSE message:', err);
      }
    };

    return () => es.close();
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div ref={messagesRef} className="messages">
        {messages.length === 0 ? (
          <p>Waiting for chat messages...</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="message">
              <strong>{msg.user}:</strong> {msg.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
