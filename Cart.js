import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function Cart() {
  const { cart, dispatch } = useContext(CartContext);

  const handleRemoveFromCart = (item) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: item });
  };

  if (cart.length === 0) {
    return <div className="popup cart-popup"><h2>Cart</h2><p>Your cart is empty.</p></div>;
  }

  return (
    <div className="popup cart-popup">
      <h2>Cart</h2>
      <div className="cart-items">
        {cart.map(item => (
          <div className="cart-item" key={item.id}>
            <img src={item.imageUrl} alt={item.title} />
            <h3>{item.title}</h3>
            <p>${item.price}</p>
            <button onClick={() => handleRemoveFromCart(item)}>Remove</button>
          </div>
        ))}
      </div>
      <button onClick={() => window.location.href = '/checkout'}>Proceed to Checkout</button>
    </div>
  );
}

export default Cart;
