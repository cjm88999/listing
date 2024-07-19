import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function Navbar() {
  const [profileImage, setProfileImage] = useState('/icons/profile-icon.png'); // Use default profile icon initially
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.photoURL) {
            setProfileImage(userData.photoURL);
          }
        }
      }
    };

    fetchProfileImage();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="navbar">
      <Link to="/">Home</Link>
      <Link to="/search">Cohort</Link>
      <Link to="/art-listing">Shop</Link>
      <Link to="/upload">+</Link>
      <div className="profile-container" onClick={() => setDropdownOpen(!dropdownOpen)}>
        <img src={profileImage} alt="Profile" className="profile-image" />
        {dropdownOpen && (
          <div className="dropdown-menu" ref={dropdownRef}>
            <Link to="/user-profile">Profile</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/logout">Logout</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
