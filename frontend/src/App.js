import React, { useState, useEffect } from 'react';
import api from './api';
import Register from './components/Register';
import Login from './components/Login';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Profile from './components/Profile';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products');
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = (tokenValue, userIdValue) => {
    localStorage.setItem('token', tokenValue);
    localStorage.setItem('userId', userIdValue);
    setToken(tokenValue);
    setUserId(userIdValue);
    // show profile automatically after login
    setShowProfile(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
    setUserId(null);
  };

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const ex = prev.find(p => p.productId === product.id);
      if (ex) return prev.map(p => p.productId === product.id ? { ...p, quantity: p.quantity + qty } : p);
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: qty }];
    });
  };

  const removeFromCart = (productId) => setCart(prev => prev.filter(p => p.productId !== productId));

  const clearCart = () => setCart([]);

  return (
    <div className="app">
      <div className="header">
        <h2>MVP E-Commerce</h2>
        <div>
          {token ? (
            <>
              <button className="button" onClick={handleLogout}>Logout</button>
              <button className="button" onClick={() => setShowProfile(s => !s)} style={{ marginLeft: 8 }}>{showProfile ? 'Hide Profile' : 'View Profile'}</button>
            </>
          ) : (
            <div style={{ display: 'inline-block' }}>
              <Login onLogin={handleLogin} />
            </div>
          )}
        </div>
      </div>

      {!token && <div style={{ marginTop: 12 }}><Register onLogin={handleLogin} /></div>}

      {token && showProfile && (
        <div style={{ marginTop: 12 }}>
          <Profile userId={userId} />
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        <div style={{ flex: 1 }}>
          <ProductList products={products} onAdd={addToCart} />
        </div>
        <div style={{ width: 360 }}>
          <Cart items={cart} remove={removeFromCart} clearCart={clearCart} userId={userId} onOrderSuccess={() => { clearCart(); fetchProducts(); }} />
        </div>
      </div>
    </div>
  );
}
