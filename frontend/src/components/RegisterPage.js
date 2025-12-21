import React from "react";
import Register from "./Register";
import { Link } from "react-router-dom";

export default function RegisterPage({ onLogin }) {
  return (
    <div className="auth-page">
      <h2>Register</h2>
      <Register onLogin={onLogin} />
      <div style={{ marginTop: 16 }}>
        <span>Already have an account? </span>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
