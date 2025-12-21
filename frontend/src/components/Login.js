import React, { useState } from "react";
import api from "../api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
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
      setMessage(err.response?.data?.error || "Login failed");
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
