import React, { useState } from 'react';
import api from '../api';

export default function Cart({ items, remove, clearCart, userId, onOrderSuccess }) {
  const [message, setMessage] = useState(null);
  const total = items.reduce((s, i) => s + (i.price * i.quantity), 0);

  const checkout = async () => {
    if (!userId) { setMessage('Please login to place an order'); return; }
    try {
      const body = { UserId: userId, Items: items.map(i => ({ ProductId: i.productId, Quantity: i.quantity })) };
      const res = await api.post('/api/orders/create', body);
      setMessage('Order created');
      onOrderSuccess();
      clearCart();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Order failed');
    }
  };

  return (
    <div className="cart">
      <h3>Cart</h3>
      {items.length === 0 && <div>No items</div>}
      {items.map(i => (
        <div key={i.productId} style={{ marginBottom: 8 }}>
          <div>{i.name} x {i.quantity} = ${(i.price * i.quantity/100).toFixed(2)}</div>
          <button className="button" onClick={() => remove(i.productId)}>Remove</button>
        </div>
      ))}
      <div style={{ marginTop: 8 }}><strong>Total: ${(total/100).toFixed(2)}</strong></div>
      <div style={{ marginTop: 8 }}>
        <button className="button" onClick={checkout} disabled={items.length===0}>Checkout</button>
      </div>
      {message && <div style={{ marginTop: 8 }}>{JSON.stringify(message)}</div>}
    </div>
  );
}
