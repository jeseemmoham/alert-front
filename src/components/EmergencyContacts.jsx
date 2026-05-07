import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, User, HeartHandshake, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactsAPI } from '../services/api';



// NOTE: We intentionally keep this component self-contained.
// The backend enforces validation; we also add client-side validation for a better UX.

const phoneRegex = /^\+?[0-9\s().-]{7,20}$/;

function isValidPhone(phone) {
  return phoneRegex.test(phone.trim());
}

export default function EmergencyContacts({ contacts = [], onRefresh }) {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [relationship, setRelationship] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const hasContacts = contacts.length > 0;

  const errors = useMemo(() => {
    const e = [];
    if (name.trim().length === 0) e.push('Name is required.');
    if (relationship.trim().length === 0) e.push('Relationship is required.');
    if (phoneNumber.trim().length === 0) e.push('Phone number is required.');
    if (phoneNumber.trim().length > 0 && !isValidPhone(phoneNumber)) e.push('Please enter a valid phone number.');
    return e;
  }, [name, phoneNumber, relationship]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    try {
      setSubmitting(true);
      await contactsAPI.add({ name: name.trim(), phoneNumber: phoneNumber.trim(), relationship: relationship.trim() });
      toast.success('Emergency contact added.');

      setName('');
      setPhoneNumber('');
      setRelationship('');
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error('Add contact error:', err);
      toast.error(err?.response?.data?.message || 'Failed to add contact.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (contactId) => {
    try {
      await contactsAPI.delete(contactId);
      toast.success('Emergency contact deleted.');

      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error('Delete contact error:', err);
      toast.error(err?.response?.data?.message || 'Failed to delete contact.');
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        borderRadius: '16px',
        padding: '18px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: 12 }}>
        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <HeartHandshake size={16} color="#fb7185" />
          Emergency Contacts
        </h3>
        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
          {contacts.length} saved
        </span>
      </div>

      <form onSubmit={handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ color: '#cbd5e1', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={14} /> Name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., John Doe"
              style={inputStyle}
              autoComplete="name"
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ color: '#cbd5e1', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Phone size={14} /> Phone Number
            </span>
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g., +1 555 123 4567"
              style={inputStyle}
              autoComplete="tel"
              inputMode="tel"
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ color: '#cbd5e1', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <HeartHandshake size={14} /> Relationship
            </span>
            <input
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="e.g., Parent / Spouse / Friend"
              style={inputStyle}
              autoComplete="off"
            />
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
          style={{
            padding: '10px 14px',
            borderRadius: 12,
            border: '1px solid rgba(251, 113, 133, 0.35)',
            background: 'rgba(251, 113, 133, 0.15)',
            color: '#fecdd3',
            fontWeight: 700,
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}
          title="Save emergency contact"
        >
          {submitting ? 'Saving...' : 'Save Contact'}
        </button>

        {errors.length > 0 && (
          <div style={{ color: '#fda4af', fontSize: '0.8rem' }}>{errors[0]}</div>
        )}
      </form>

      <div style={{ marginTop: 10 }}>
        {!hasContacts ? (
          <div style={{ textAlign: 'center', padding: '14px 10px', color: '#94a3b8', fontSize: '0.9rem' }}>
            No emergency contacts yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {contacts.map((c) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  background: 'rgba(30, 41, 59, 0.55)',
                  border: '1px solid rgba(148, 163, 184, 0.12)',
                  borderRadius: 14,
                  padding: '12px 12px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 10,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: 4 }}>
                    <span style={{ color: '#fb7185', fontWeight: 700 }}>Phone:</span> {c.phoneNumber}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                    <span style={{ color: '#a78bfa', fontWeight: 700 }}>Relationship:</span> {c.relationship}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(c._id)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(148, 163, 184, 0.18)',
                    color: '#fca5a5',
                    borderRadius: 12,
                    padding: '8px 10px',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                  title="Delete contact"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 12,
  outline: 'none',
  background: 'rgba(2, 6, 23, 0.35)',
  border: '1px solid rgba(148, 163, 184, 0.16)',
  color: '#e2e8f0',
};

