import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../services/api';
import { useAlerts } from '../context/AlertContext';
import SeverityBadge from '../components/SeverityBadge';
import AlertMap from '../components/AlertMap';
import {
  ShieldAlert, Plus, Trash2, Users, AlertTriangle, Send, Loader,
  CloudLightning, Waves, Mountain, MapPin, X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const { fetchAlerts, fetchAllAlerts, allAlerts } = useAlerts();
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    type: 'weather',
    severity: 'medium',
    title: '',
    description: '',
    zipCode: '',
  });

  // Fetch users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await adminAPI.getUsers();
        setUsers(res.data.data.users);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    loadUsers();
  }, []);

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'zipCode') value = value.replace(/\D/g, '').slice(0, 6);
    setForm(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.zipCode) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await adminAPI.createAlert(form);
      toast.success('🚨 Alert pushed successfully!');
      setForm({ type: 'weather', severity: 'medium', title: '', description: '', zipCode: '' });
      setShowForm(false);
      fetchAlerts();
      fetchAllAlerts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create alert');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await adminAPI.deleteAlert(id);
      toast.success('Alert deleted');
      fetchAlerts();
      fetchAllAlerts();
    } catch (err) {
      toast.error('Failed to delete alert');
    } finally {
      setDeleting(null);
    }
  };

  const typeIcons = {
    weather: <CloudLightning size={15} />,
    flood: <Waves size={15} />,
    earthquake: <Mountain size={15} />,
    emergency: <AlertTriangle size={15} />,
  };

  return (
    <div className="page-wrapper" style={{ paddingBottom: '60px' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ paddingTop: '24px' }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '32px', flexWrap: 'wrap', gap: '16px',
          }}>
            <div>
              <h1 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 700, marginBottom: '6px',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <ShieldAlert size={28} color="#f59e0b" />
                Admin Panel
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Manage alerts and push notifications to users
              </p>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="btn btn-primary"
            >
              {showForm ? <X size={18} /> : <Plus size={18} />}
              {showForm ? 'Cancel' : 'Push New Alert'}
            </button>
          </div>

          {/* Create Alert Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                borderRadius: '20px',
                padding: '32px',
                marginBottom: '28px',
              }}
            >
              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.1rem', fontWeight: 600, marginBottom: '24px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <Send size={18} color="#3b82f6" />
                Push New Alert
              </h3>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }} className="grid-3">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Alert Type</label>
                    <select name="type" value={form.type} onChange={handleChange} className="form-input">
                      <option value="weather">⛈️ Weather</option>
                      <option value="flood">🌊 Flood</option>
                      <option value="earthquake">🌍 Earthquake</option>
                      <option value="emergency">🚨 Emergency</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Severity</label>
                    <select name="severity" value={form.severity} onChange={handleChange} className="form-input">
                      <option value="low">🟢 Low</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="high">🟠 High</option>
                      <option value="critical">🔴 Critical</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Target ZIP Code</label>
                    <input
                      type="text" name="zipCode" value={form.zipCode}
                      onChange={handleChange} placeholder="10001"
                      className="form-input" maxLength={6}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Alert Title</label>
                  <input
                    type="text" name="title" value={form.title}
                    onChange={handleChange} placeholder="e.g., Severe Thunderstorm Warning"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description" value={form.description}
                    onChange={handleChange}
                    placeholder="Detailed alert description for affected residents..."
                    className="form-input"
                    rows={4}
                    style={{ resize: 'vertical', minHeight: '100px' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ padding: '12px 28px' }}
                >
                  {submitting ? (
                    <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <>
                      <Send size={18} />
                      Push Alert Now
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* Main Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '24px',
            alignItems: 'start',
          }} className="dashboard-grid">
            {/* Active Alerts Table */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: '20px',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <h3 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1rem', fontWeight: 600,
                }}>
                  Active Alerts ({allAlerts.length})
                </h3>
              </div>

              <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                {allAlerts.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    No active alerts
                  </div>
                ) : (
                  allAlerts.map((alert) => (
                    <div
                      key={alert._id}
                      style={{
                        padding: '16px 24px',
                        borderBottom: '1px solid rgba(148, 163, 184, 0.05)',
                        display: 'flex', alignItems: 'center', gap: '14px',
                        transition: 'background 200ms ease',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          marginBottom: '6px',
                        }}>
                          <span style={{ color: '#64748b' }}>{typeIcons[alert.type]}</span>
                          <span style={{
                            fontSize: '0.9rem', fontWeight: 500,
                            color: '#f1f5f9', overflow: 'hidden',
                            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {alert.title}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <SeverityBadge severity={alert.severity} size="sm" />
                          <span style={{
                            fontSize: '0.75rem', color: '#475569',
                            display: 'flex', alignItems: 'center', gap: '4px',
                          }}>
                            <MapPin size={11} /> {alert.zipCode}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(alert._id)}
                        disabled={deleting === alert._id}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '6px 12px', flexShrink: 0 }}
                      >
                        {deleting === alert._id ? (
                          <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Users Card */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                borderRadius: '20px',
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '18px 22px',
                  borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <Users size={18} color="#8b5cf6" />
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.95rem', fontWeight: 600 }}>
                    Registered Users ({users.length})
                  </h3>
                </div>
                <div style={{ maxHeight: '280px', overflow: 'auto' }}>
                  {users.map((u) => (
                    <div key={u._id} style={{
                      padding: '12px 22px',
                      borderBottom: '1px solid rgba(148, 163, 184, 0.04)',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#f1f5f9' }}>
                          {u.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.email}</div>
                      </div>
                      <span style={{
                        fontSize: '0.72rem', padding: '3px 10px', borderRadius: '8px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#38bdf8',
                      }}>
                        {u.zipCode}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div>
                <h3 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.95rem', fontWeight: 600,
                  marginBottom: '10px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <MapPin size={16} color="#8b5cf6" />
                  Alert Distribution
                </h3>
                <AlertMap alerts={allAlerts} height="280px" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
