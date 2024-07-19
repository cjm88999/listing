import React from 'react';
import { Link } from 'react-router-dom';

function CartPopup({ cartItems }) {
  return (
    <div className="cart-popup">
    <div className="cart-items">
      {cartItems.map(item => (
        <div className="cart-item" key={item.id}>
          <img src={item.imageUrl} alt={item.title} />
          <h3>{item.title}</h3>
          <p>${item.price}</p>
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
    </div>
    <button className="proceed-to-checkout-button" onClick={handleProceedToCheckout}>
      Proceed to Checkout
    </button>
  </div>
  
  );
}

export default CartPopup;
