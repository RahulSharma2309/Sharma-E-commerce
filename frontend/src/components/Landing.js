import React from "react";
import { Link } from "react-router-dom";
import "../theme.css";

export default function Landing() {
  return (
    <div className="landing-page">
      <h1 className="landing-title">Welcome to MVP E-Commerce</h1>
      <p className="landing-sub">Shop the best products, fast and easy.</p>
      <div className="landing-actions">
        <Link to="/login" className="button">
          Login
        </Link>
        <Link to="/register" className="button">
          Register
        </Link>
      </div>
    </div>
  );
}
