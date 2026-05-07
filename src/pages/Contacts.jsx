import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import EmergencyContacts from '../components/EmergencyContacts';
import { contactsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Contacts() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);

  const fetchContacts = async () => {
    if (!user) return;
    try {
      setContactsLoading(true);
      const res = await contactsAPI.getContacts();
      setContacts(res.data.data?.contacts || []);
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
      toast.error(err?.response?.data?.message || 'Failed to load emergency contacts.');
    } finally {
      setContactsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <div className="page-wrapper" style={{ paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ paddingTop: '24px' }}
        >
          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.8rem',
              fontWeight: 700,
              marginBottom: '6px',
            }}
          >
            Emergency Contacts
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '28px' }}>
            Save trusted people to contact during disasters.
          </p>

          <EmergencyContacts contacts={contacts} onRefresh={fetchContacts} loading={contactsLoading} />
        </motion.div>
      </div>
    </div>
  );
}

