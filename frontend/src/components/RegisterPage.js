import React, { useEffect } from "react";
import Register from "./Register";
import { Link, useLocation } from "react-router-dom";

export default function RegisterPage({ onLogin }) {
  const location = useLocation();
  const message = location.state?.message;
  const email = location.state?.email;

  return (
    <div className="auth-page">
      <h2>Register</h2>
      {message && (
        <div style={{ marginBottom: 16, padding: 12, backgroundColor: "#fff3cd", border: "1px solid #ffc107", borderRadius: 4, color: "#856404" }}>
          {message}
        </div>
      )}
      <Register onLogin={onLogin} initialEmail={email} />
      <div style={{ marginTop: 16 }}>
        <span>Already have an account? </span>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
