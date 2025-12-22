import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import api from "./api";
import Landing from "./components/Landing";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProductSearchPage from "./components/ProductSearchPage";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import Profile from "./components/Profile";
import { Link } from "react-router-dom";
import "./theme.css";
export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(null);

  useEffect(() => {
    fetchProducts();
    if (userId) fetchWallet();
  }, [userId]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products");
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    }
  };
  const fetchWallet = async () => {
    try {
      const res = await api.get(`/api/users/by-userid/${userId}`);
      setWallet(res.data && res.data.wallet ? res.data.wallet : 0);
    } catch (e) {
      setWallet(0);
    }
  };

  const handleLogin = (tokenValue, userIdValue) => {
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("userId", userIdValue);
    setToken(tokenValue);
    setUserId(userIdValue);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
    setUserId(null);
    setCart([]);
    setWallet(0);
  };
  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const ex = prev.find((p) => p.productId === product.id);
      if (ex)
        return prev.map((p) =>
          p.productId === product.id
            ? {
                ...p,
                quantity: Math.min(
                  (p.quantity || 0) + (qty || 1),
                  product.stock
                ),
              }
            : p
        );
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: Math.min(qty || 1, product.stock),
        },
      ];
    });
  };
  const removeFromCart = (productId) =>
    setCart((prev) => prev.filter((p) => p.productId !== productId));
  const clearCart = () => setCart([]);

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleCheckout = async () => {
    setLoading(true);
    setCheckoutError(null);
    setCheckoutSuccess(null);
    try {
      const body = {
        UserId: userId,
        Items: cart.map((i) => ({
          ProductId: i.productId,
          Quantity: i.quantity,
        })),
      };
      const res = await api.post("/api/orders/create", body);
      setCheckoutSuccess("Order placed successfully!");
      clearCart();
      fetchProducts();
      fetchWallet();
    } catch (err) {
      setCheckoutError(err.response?.data?.error || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="app">
        <div className="header">
          <h2>MVP E-Commerce</h2>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {token && (
              <>
                <span
                  style={{
                    fontWeight: 500,
                    color: "#333",
                    background: "#f5f5f5",
                    padding: "4px 10px",
                    borderRadius: 6,
                  }}
                >
                  Wallet: ${wallet ? (wallet / 100).toFixed(2) : "0.00"}
                </span>
                <Link
                  to="/cart"
                  className="button"
                  style={{ background: "#eee", color: "#333" }}
                >
                  Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
                </Link>
                <Link
                  to="/profile"
                  className="button"
                  style={{ background: "#eee", color: "#333" }}
                >
                  Profile
                </Link>
                <button className="button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
        <Routes>
          <Route
            path="/"
            element={token ? <Navigate to="/products" /> : <Landing />}
          />
          <Route
            path="/login"
            element={
              token ? (
                <Navigate to="/products" />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={
              token ? (
                <Navigate to="/products" />
              ) : (
                <RegisterPage onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/products"
            element={
              token ? (
                <ProductSearchPage products={products} onAdd={addToCart} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/cart"
            element={
              token ? (
                <CartPage
                  items={cart}
                  remove={removeFromCart}
                  clearCart={clearCart}
                  userId={userId}
                  onOrderSuccess={() => {
                    clearCart();
                    fetchProducts();
                  }}
                  wallet={wallet}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/checkout"
            element={
              token ? (
                <CheckoutPage
                  total={total}
                  wallet={wallet}
                  onCheckout={handleCheckout}
                  loading={loading}
                  error={checkoutError}
                  success={checkoutSuccess}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/profile"
            element={
              token ? <Profile userId={userId} /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
