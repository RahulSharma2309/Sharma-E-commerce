import React from "react";
import Login from "./Login";
import { Link } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  return (
    <div className="auth-page">
      <h2>Login</h2>
      <Login onLogin={onLogin} />
      <div style={{ marginTop: 16 }}>
        <span>Don't have an account? </span>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
