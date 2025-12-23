import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await api.post("/api/auth/login", {
        Email: email,
        Password: password,
      });
      const token = res.data.token || res.data.Token || res.data.Token;
      const userId =
        res.data.userId ||
        res.data.UserId ||
        res.data.userId ||
        res.data.UserId;
      // normalize key names
      const uid = userId || res.data.userId || res.data.UserId || null;
      if (token) onLogin(token, uid);
      else setMessage("Login succeeded but token missing");
    } catch (err) {
      const errorData = err.response?.data;
      const errorCode = errorData?.code;
      const errorMessage = errorData?.error || "Login failed";
      
      // If user not found, redirect to register page with message
      if (err.response?.status === 404 && errorCode === "USER_NOT_FOUND") {
        navigate("/register", { state: { message: errorMessage, email } });
      } else {
        setMessage(errorMessage);
      }
    }
  };

  return (
    <div>
      <form onSubmit={submit} style={{ display: "inline-block" }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="button" type="submit">
          Login
        </button>
        {message && <div>{message}</div>}
      </form>
    </div>
  );
}
