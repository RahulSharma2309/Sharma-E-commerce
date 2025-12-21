import React, { useState } from 'react';
import api, { createProfile } from '../api';

export default function Register({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/register', { Email: email, Password: password, FullName: fullName });
      // after register, automatically login to obtain token + userId
      const login = await api.post('/api/auth/login', { Email: email, Password: password });
      const token = login.data.token || login.data.Token;
      const userId = login.data.userId || login.data.UserId || null;
      if (token) {
        // persist and notify parent
        if (onLogin) onLogin(token, userId);

        // create initial profile (use fullName split)
        const names = fullName ? fullName.split(' ') : [];
        const first = names.length ? names[0] : '';
        const last = names.length > 1 ? names.slice(1).join(' ') : '';
        try {
          await createProfile({ UserId: userId, FirstName: first, LastName: last });
        } catch (e) {
          // profile creation is best-effort; log and continue
          console.warn('Profile create failed', e);
        }

        setMessage('Registered and logged in');
        setEmail(''); setPassword(''); setFullName('');
      } else {
        setMessage('Registered but login failed to return token');
      }
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
