import React, { useState, useEffect, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import { db, storage } from '../firebase';
import { doc, getDoc, updateDoc, setDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

function UserProfile() {
  const auth = getAuth();
  const user = auth.currentUser;
  const defaultImageUrl = 'https://via.placeholder.com/150';
  const [profile, setProfile] = useState({
    displayName: '',
    bio: '',
    photoURL: user?.photoURL || defaultImageUrl
  });
  const [artListings, setArtListings] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [portfolioFile, setPortfolioFile] = useState(null);
  const [portfolioType, setPortfolioType] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          await setDoc(docRef, profile);
        }
      }
    };

    const fetchArtListings = async () => {
      if (user) {
        const q = query(collection(db, 'artworks'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const listings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setArtListings(listings);
      }
    };

    const fetchPortfolio = async () => {
      if (user) {
        const q = query(collection(db, 'portfolios'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const portfolioData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPortfolio(portfolioData);
      }
    };

    fetchProfile();
    fetchArtListings();
    fetchPortfolio();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handlePortfolioChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setPortfolioFile(file);
      setPortfolioType(file.type.startsWith('video') ? 'video' : 'image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      if (imageFile) {
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);
        profile.photoURL = imageUrl;
      }

      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, profile);
      setIsEditing(false);
      alert('Profile updated successfully!');
    }
  };

  const handlePortfolioSubmit = async (e) => {
    e.preventDefault();
    if (user && portfolioFile) {
      const storageRef = ref(storage, `portfolioFiles/${user.uid}/${portfolioFile.name}`);
      await uploadBytes(storageRef, portfolioFile);
      const fileUrl = await getDownloadURL(storageRef);

      const portfolioRef = collection(db, 'portfolios');
      await setDoc(doc(portfolioRef), {
        userId: user.uid,
        fileUrl: fileUrl,
        fileType: portfolioType,
        createdAt: new Date()
      });
      setPortfolio([...portfolio, { fileUrl, fileType: portfolioType, createdAt: new Date() }]);
      setPortfolioFile(null);
      setPortfolioType('');
    }
  };

  const handleDeleteListing = async (id, imageUrl) => {
    if (user) {
      const docRef = doc(db, 'artworks', id);
      await deleteDoc(docRef);
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      setArtListings(artListings.filter(art => art.id !== id));
    }
  };

  const handleDeletePortfolio = async (id, fileUrl) => {
    if (user) {
      const docRef = doc(db, 'portfolios', id);
      await deleteDoc(docRef);
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
      setPortfolio(portfolio.filter(item => item.id !== id));
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const renderDropdown = (id, item, isListing) => (
    <div className="dropdown" onClick={() => toggleDropdown(id)}>
      <button className="dropdown-toggle">Options</button>
      {dropdownOpen[id] && (
        <div className="dropdown-menu">
          <button onClick={() => console.log('Edit', item)}>Edit</button>
          <button onClick={() => isListing ? handleDeleteListing(id, item.imageUrl) : handleDeletePortfolio(id, item.fileUrl)}>Delete</button>
          <button onClick={() => console.log('View', item)}>View</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="user-profile-page">
      <div className="profile-header">
        <img src={profile.photoURL || defaultImageUrl} alt="Profile" className="profile-image" />
        <div className="profile-info">
          <h1>{profile.displayName}</h1>
          <p>{profile.bio}</p>
          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
          {isEditing && (
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
              <label htmlFor="upload" className="upload-label">Choose File</label>
              <input type="file" id="upload" className="upload-input" onChange={handleFileChange} />
              <button type="submit" className="portfolio-button">Save</button>
            </form>
          )}
        </div>
      </div>
      <div className="grid-section">
        <h2>Shop</h2>
        <div className="grid">
          {artListings.map(art => (
            <div className="grid-item" key={art.id}>
              <img src={art.imageUrl} alt={art.title} />
              <h3>{art.title}</h3>
              <p>{art.description}</p>
              <p>${art.price}</p>
              {renderDropdown(art.id, art, true)}
            </div>
          ))}
        </div>
      </div>
      <div className="grid-section">
        <h2>Portfolio</h2>
        <div className="grid">
          {portfolio.map(item => (
            <div className="grid-item" key={item.id}>
              {item.fileType === 'video' ? (
                <video src={item.fileUrl} controls></video>
              ) : (
                <img src={item.fileUrl} alt="Portfolio Item" />
              )}
              {renderDropdown(item.id, item, false)}
            </div>
          ))}
        </div>
        <form onSubmit={handlePortfolioSubmit}>
          <label htmlFor="portfolioUpload" className="upload-label">Choose File</label>
          <input type="file" id="portfolioUpload" className="upload-input" onChange={handlePortfolioChange} />
          <button type="submit" className="portfolio-button">Upload to Portfolio</button>
        </form>
      </div>
    </div>
  );
}

export default UserProfile;
