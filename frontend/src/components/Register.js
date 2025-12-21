import React, { useState } from 'react';
import api from '../api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/register', { Email: email, Password: password, FullName: fullName });
      setMessage('Registered — you can now login');
      setEmail(''); setPassword(''); setFullName('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={{ marginTop: 12 }}>
      <h3>Register</h3>
      <form onSubmit={submit}>
        <div><input placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)} /></div>
        <div><input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div><input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /></div>
        <div><button className="button" type="submit">Register</button></div>
      </form>
      {message && <div style={{ marginTop: 8 }}>{message}</div>}
    </div>
  );
}
