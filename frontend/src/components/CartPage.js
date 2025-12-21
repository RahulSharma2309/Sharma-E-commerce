import React from 'react';
import Cart from './Cart';

export default function CartPage({ items, remove, clearCart, userId, onOrderSuccess, wallet }) {
  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <div style={{ marginBottom: 16 }}>
        <strong>Wallet Balance:</strong> ${wallet ? (wallet/100).toFixed(2) : '...'}
      </div>
      <Cart items={items} remove={remove} clearCart={clearCart} userId={userId} onOrderSuccess={onOrderSuccess} wallet={wallet} />
    </div>
  );
}
