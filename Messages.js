import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function Messages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const querySnapshot = await getDocs(collection(db, 'messages'));
      const messagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesData);
    };

    fetchMessages();
  }, []);

  return (
    <div className="popup messages-popup">
      <h2>Messages</h2>
      <div className="messages">
        {messages.map(message => (
          <div className="message" key={message.id}>
            <h3>{message.title}</h3>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;
