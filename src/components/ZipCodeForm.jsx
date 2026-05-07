import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Check, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ZipCodeForm({ compact = false }) {
  const { user, updateZipCode } = useAuth();
  const [zipCode, setZipCode] = useState(user?.zipCode || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!zipCode.match(/^\d{5,6}$/)) {
      toast.error('Please enter a valid 5-6 digit ZIP code');
      return;
    }
    if (zipCode === user?.zipCode) {
      toast('ZIP code is already set to ' + zipCode, { icon: 'ℹ️' });
      return;
    }

    setSaving(true);
    const result = await updateZipCode(zipCode);
    setSaving(false);

    if (result.success) {
      toast.success('ZIP code updated! Alerts will refresh.');
    } else {
      toast.error(result.message || 'Failed to update ZIP code');
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <MapPin size={16} style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            color: '#64748b',
          }} />
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="ZIP Code"
            maxLength={6}
            className="form-input"
            style={{ paddingLeft: '36px', fontSize: '0.85rem', padding: '10px 12px 10px 36px' }}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary btn-sm"
          style={{ padding: '10px 16px', flexShrink: 0 }}
        >
          {saving ? <Loader size={16} className="spinner-icon" /> : <Check size={16} />}
          Update
        </button>
      </form>
    );
  }

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      borderRadius: '16px',
      padding: '24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MapPin size={18} color="#3b82f6" />
        </div>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f1f5f9' }}>Your Location</h3>
          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
            {user?.zipCode ? `Current: ${user.zipCode}` : 'Set your ZIP code for alerts'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <MapPin size={16} style={{
            position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
            color: '#64748b', pointerEvents: 'none',
          }} />
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter ZIP code"
            maxLength={6}
            className="form-input"
            style={{ paddingLeft: '40px' }}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary"
          style={{ flexShrink: 0 }}
        >
          {saving ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={18} />}
          {saving ? 'Saving...' : 'Update'}
        </button>
      </form>
    </div>
  );
}
