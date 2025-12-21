import React, { useEffect, useState } from 'react';
import api, { getProfileByUserId, updateProfile, createProfile } from '../api';

export default function Profile({ userId }) {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ FirstName: '', LastName: '', Address: '', PhoneNumber: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!userId) return;
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getProfileByUserId(userId);
      setProfile(res.data);
      if (res.data) setForm({ FirstName: res.data.firstName || '', LastName: res.data.lastName || '', Address: res.data.address || '', PhoneNumber: res.data.phoneNumber || '' });
    } catch (e) {
      // not found or error
      setProfile(null);
    } finally { setLoading(false); }
  };

  const save = async () => {
    setLoading(true);
    try {
      if (profile && profile.id) {
        const res = await updateProfile(profile.id, { UserId: userId, FirstName: form.FirstName, LastName: form.LastName, Address: form.Address, PhoneNumber: form.PhoneNumber });
        setProfile(res.data);
        setMessage('Profile updated');
      } else {
        const res = await createProfile({ UserId: userId, FirstName: form.FirstName, LastName: form.LastName, Address: form.Address, PhoneNumber: form.PhoneNumber });
        setProfile(res.data);
        setMessage('Profile created');
      }
      setEditing(false);
    } catch (e) {
      setMessage('Save failed');
    } finally { setLoading(false); }
  };

  if (!userId) return <div>Please login to see your profile.</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
      <h3>Your Profile</h3>
      {message && <div style={{ marginBottom: 8 }}>{message}</div>}
      {profile ? (
        <div>
          {!editing ? (
            <div>
              <div><strong>Name:</strong> {profile.firstName} {profile.lastName}</div>
              <div><strong>Address:</strong> {profile.address}</div>
              <div><strong>Phone:</strong> {profile.phoneNumber}</div>
              <div style={{ marginTop: 8 }}>
                <button className="button" onClick={() => { setEditing(true); setForm({ FirstName: profile.firstName || '', LastName: profile.lastName || '', Address: profile.address || '', PhoneNumber: profile.phoneNumber || '' }); }}>Edit</button>
              </div>
            </div>
          ) : (
            <div>
              <div><input placeholder="First name" value={form.FirstName} onChange={e => setForm({ ...form, FirstName: e.target.value })} /></div>
              <div><input placeholder="Last name" value={form.LastName} onChange={e => setForm({ ...form, LastName: e.target.value })} /></div>
              <div><input placeholder="Address" value={form.Address} onChange={e => setForm({ ...form, Address: e.target.value })} /></div>
              <div><input placeholder="Phone" value={form.PhoneNumber} onChange={e => setForm({ ...form, PhoneNumber: e.target.value })} /></div>
              <div style={{ marginTop: 8 }}>
                <button className="button" onClick={save}>Save</button>
                <button className="button" onClick={() => setEditing(false)} style={{ marginLeft: 8 }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div>No profile found. Create one:</div>
          <div>
            <div><input placeholder="First name" value={form.FirstName} onChange={e => setForm({ ...form, FirstName: e.target.value })} /></div>
            <div><input placeholder="Last name" value={form.LastName} onChange={e => setForm({ ...form, LastName: e.target.value })} /></div>
            <div><input placeholder="Address" value={form.Address} onChange={e => setForm({ ...form, Address: e.target.value })} /></div>
            <div><input placeholder="Phone" value={form.PhoneNumber} onChange={e => setForm({ ...form, PhoneNumber: e.target.value })} /></div>
            <div style={{ marginTop: 8 }}>
              <button className="button" onClick={save}>Create Profile</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
