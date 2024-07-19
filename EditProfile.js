import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

function EditProfile() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [profile, setProfile] = useState({
    displayName: '',
    bio: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          // If the user profile does not exist, create one
          await setDoc(docRef, profile);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, profile);
      alert('Profile updated successfully!');
    }
  };

  return (
    <div className="page edit-profile-page">
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="displayName"
          placeholder="Display Name"
          value={profile.displayName}
          onChange={handleChange}
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={profile.bio}
          onChange={handleChange}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default EditProfile;
