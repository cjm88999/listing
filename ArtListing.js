import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function ArtListing() {
  const [artworks, setArtworks] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchArtworks = async () => {
      const querySnapshot = await getDocs(collection(db, 'artworks'));
      const artworksList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setArtworks(artworksList);
    };

    fetchArtworks();
  }, []);

  const handleArtworkClick = (artId) => {
    history.push(`/art/${artId}`);
  };

  return (
    <div className="page">
      <h1></h1>
      <div className="grid artworks">
        {artworks.map((art, index) => (
          <div key={index} className="grid-item" onClick={() => handleArtworkClick(art.id)}>
            <img src={art.imageUrl} alt={art.title} />
            <h3>{art.title}</h3>
            <p>{art.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArtListing;
