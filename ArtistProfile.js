import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function ArtistProfile() {
  const { id } = useParams();
  const history = useHistory();
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    const fetchArtist = async () => {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setArtist(docSnap.data());
      }
    };

    fetchArtist();
  }, [id]);

  if (!artist) {
    return <div>Loading...</div>;
  }

  const handleArtworkClick = (artId) => {
    history.push(`/art/${artId}`);
  };

  return (
    <div className="page user-profile-page">
      <div className="profile-header">
        <img
          src={artist.photoURL || 'https://via.placeholder.com/150'}
          alt={artist.displayName}
        />
        <div className="profile-info">
          <h1>{artist.displayName}</h1>
          <p>{artist.bio || 'No bio available.'}</p>
          <button onClick={() => window.location = `mailto:${artist.email}`}>Contact</button>
        </div>
      </div>
      <div className="grid-section">
        <h2>Art Listings</h2>
        <div className="grid artworks">
          {artist.artworks && artist.artworks.map((art, index) => (
            <div key={index} className="grid-item" onClick={() => handleArtworkClick(art.id)}>
              <img src={art.imageUrl} alt={art.title} />
              <h3>{art.title}</h3>
              <p>{art.price}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid-section">
        <h2>Posts</h2>
        <div className="grid posts">
          {artist.posts && artist.posts.map((post, index) => (
            <div key={index} className="grid-item">
              <img src={post.imageUrl} alt={post.title} />
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ArtistProfile;
