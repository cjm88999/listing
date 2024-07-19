import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

function Search() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  return (
    <div className="page search-page">
      <h1>Cohort</h1>
      <div className="user-grid">
        {users.map(user => (
          <Link to={`/profile/${user.id}`} key={user.id} className="user-link">
            <div className="user-profile">
              <img src={user.photoURL || '/icons/profile-icon.png'} alt={user.displayName} className="user-image" />
              <h2>{user.displayName}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Search;
