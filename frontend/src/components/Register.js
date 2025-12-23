import React, { useState } from "react";
import api from "../api";

function validateEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}
function validatePhone(phone) {
  // Simple validation for 10-15 digits
  return /^\+?\d{10,15}$/.test(phone);
}
function validatePassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(
    password
  );
}

export default function Register({ onLogin, initialEmail = "" }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const validate = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!validateEmail(email)) errs.email = "Invalid email format";
    if (!phone.trim()) errs.phone = "Phone number is required";
    else if (!validatePhone(phone)) errs.phone = "Invalid phone number";
    if (!password) errs.password = "Password is required";
    else if (!validatePassword(password))
      errs.password =
        "Password must be 8+ chars, include upper, lower, number, special";
    if (!confirmPassword) errs.confirmPassword = "Confirm your password";
    else if (password !== confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage(null);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    try {
      // Register creates both auth user and profile atomically
      await api.post("/api/auth/register", {
        Email: email,
        Password: password,
        ConfirmPassword: confirmPassword,
        FullName: fullName,
        PhoneNumber: phone,
        Address: address,
      });
      
      // After successful registration, automatically login to obtain token + userId
      const login = await api.post("/api/auth/login", {
        Email: email,
        Password: password,
      });
      const token = login.data.token || login.data.Token;
      const userId = login.data.userId || login.data.UserId || null;
      if (token) {
        if (onLogin) onLogin(token, userId);
        setMessage("Registered and logged in");
        setEmail("");
        setPassword("");
        setFullName("");
        setPhone("");
        setAddress("");
        setConfirmPassword("");
      } else {
        setMessage("Registered but login failed to return token");
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div style={{ marginTop: 12 }}>
      <h3>Register</h3>
      <form onSubmit={submit}>
        <div>
          <input
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {errors.fullName && (
            <div style={{ color: "red" }}>{errors.fullName}</div>
          )}
        </div>
        <div>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}
        </div>
        <div>
          <input
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && <div style={{ color: "red" }}>{errors.phone}</div>}
        </div>
        <div>
          <input
            placeholder="Address (optional)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <div style={{ color: "red" }}>{errors.password}</div>
          )}
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <div style={{ color: "red" }}>{errors.confirmPassword}</div>
          )}
        </div>
        <div>
          <button className="button" type="submit">
            Register
          </button>
        </div>
      </form>
      {message && <div style={{ marginTop: 8 }}>{message}</div>}
    </div>
  );
}
