import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CartContext } from '../context/CartContext';

function ArtDetails() {
  const { id } = useParams();
  const { dispatch } = useContext(CartContext);
  const [art, setArt] = useState(null);

  useEffect(() => {
    const fetchArt = async () => {
      const docRef = doc(db, 'artworks', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setArt(docSnap.data());
      }
    };

    fetchArt();
  }, [id]);

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: art });
  };

  if (!art) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page art-details-page">
      <h1>{art.title}</h1>
      <img src={art.imageUrl} alt={art.title} className="art-image" />
      <p>{art.description}</p>
      <p>{art.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}

export default ArtDetails;
