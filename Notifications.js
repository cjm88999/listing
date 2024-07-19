import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const querySnapshot = await getDocs(collection(db, 'notifications'));
      const notificationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(notificationsData);
    };

    fetchNotifications();
  }, []);

  return (
    <div className="popup notifications-popup">
      <h2>Notifications</h2>
      <div className="notifications">
        {notifications.map(notification => (
          <div className="notification" key={notification.id}>
            <h3>{notification.title}</h3>
            <p>{notification.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
