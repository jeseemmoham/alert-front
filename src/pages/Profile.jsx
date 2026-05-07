import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ZipCodeForm from '../components/ZipCodeForm';
import { User, Mail, MapPin, Shield, Bell, BellOff, CloudLightning, Waves, Mountain, AlertTriangle, Save, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [emailNotif, setEmailNotif] = useState(user?.emailNotifications ?? true);
  const [preferences, setPreferences] = useState(user?.alertPreferences || {
    weather: true, flood: true, earthquake: true, emergency: true,
  });
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    const result = await updateProfile({
      name,
      emailNotifications: emailNotif,
      alertPreferences: preferences,
    });
    setSaving(false);

    if (result.success) {
      toast.success('Profile updated successfully!');
    } else {
      toast.error(result.message);
    }
  };

  const togglePref = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const alertTypes = [
    { key: 'weather', label: 'Weather', icon: <CloudLightning size={18} />, color: '#38bdf8' },
    { key: 'flood', label: 'Flood', icon: <Waves size={18} />, color: '#06b6d4' },
    { key: 'earthquake', label: 'Earthquake', icon: <Mountain size={18} />, color: '#a78bfa' },
    { key: 'emergency', label: 'Emergency', icon: <AlertTriangle size={18} />, color: '#fb7185' },
  ];

  return (
    <div className="page-wrapper" style={{ paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ paddingTop: '24px' }}
        >
          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.8rem',
            fontWeight: 700,
            marginBottom: '8px',
          }}>
            Profile Settings
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '32px' }}>
            Manage your account and notification preferences
          </p>

          {/* User Info Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem', fontWeight: 700, color: '#fff',
              }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{user?.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Mail size={13} /> {user?.email}
                  </span>
                  <span style={{
                    fontSize: '0.72rem', padding: '2px 10px', borderRadius: '9999px',
                    background: user?.role === 'admin' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(59, 130, 246, 0.12)',
                    color: user?.role === 'admin' ? '#f59e0b' : '#3b82f6',
                    border: `1px solid ${user?.role === 'admin' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(59, 130, 246, 0.25)'}`,
                    textTransform: 'capitalize', fontWeight: 600,
                  }}>
                    {user?.role || 'user'}
                  </span>
                </div>
              </div>
            </div>

            {/* Name Edit */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder="Your name"
                id="profile-name"
              />
            </div>
          </div>

          {/* ZIP Code Card */}
          <div style={{ marginBottom: '24px' }}>
            <ZipCodeForm />
          </div>

          {/* Notification Preferences */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '24px',
          }}>
            <h3 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <Bell size={20} color="#3b82f6" />
              Notification Preferences
            </h3>

            {/* Email Notifications Toggle */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px', borderRadius: '14px',
              background: 'rgba(30, 41, 59, 0.5)',
              marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {emailNotif ? <Bell size={18} color="#22c55e" /> : <BellOff size={18} color="#64748b" />}
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Email Notifications</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Receive alerts via email</div>
                </div>
              </div>
              <button
                onClick={() => setEmailNotif(!emailNotif)}
                style={{
                  width: '48px', height: '26px', borderRadius: '13px',
                  background: emailNotif ? '#3b82f6' : '#334155',
                  border: 'none', cursor: 'pointer',
                  position: 'relative', transition: 'background 200ms ease',
                }}
              >
                <span style={{
                  position: 'absolute', top: '3px',
                  left: emailNotif ? '25px' : '3px',
                  width: '20px', height: '20px',
                  borderRadius: '50%', background: '#fff',
                  transition: 'left 200ms ease',
                }} />
              </button>
            </div>

            {/* Alert Type Preferences */}
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '12px' }}>
              Select which alert types you want to receive:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {alertTypes.map((type) => (
                <button
                  key={type.key}
                  onClick={() => togglePref(type.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '14px 16px', borderRadius: '12px',
                    background: preferences[type.key] ? `${type.color}10` : 'rgba(30, 41, 59, 0.3)',
                    border: `1px solid ${preferences[type.key] ? `${type.color}30` : 'rgba(148, 163, 184, 0.08)'}`,
                    color: preferences[type.key] ? type.color : '#64748b',
                    cursor: 'pointer', transition: 'all 200ms ease',
                    fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: 500,
                  }}
                >
                  {type.icon}
                  {type.label}
                  <span style={{
                    marginLeft: 'auto', fontSize: '0.72rem',
                    opacity: preferences[type.key] ? 1 : 0.5,
                  }}>
                    {preferences[type.key] ? '✓' : '○'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveProfile}
            disabled={saving}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
          >
            {saving ? (
              <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
