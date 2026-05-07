import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';
import AlertList from '../components/AlertList';
import AlertMap from '../components/AlertMap';
import ZipCodeForm from '../components/ZipCodeForm';
import EmergencyAlertNotification from '../components/EmergencyAlertNotification';
import { AlertTriangle, CloudLightning, Waves, Mountain, Radio, TrendingUp, MapPin, RefreshCw, Download } from 'lucide-react';
import EmergencyContacts from '../components/EmergencyContacts';
import SafetyTips from '../components/SafetyTips';
import { contactsAPI } from '../services/api';
import { jsPDF } from 'jspdf';
import { useCallback } from 'react';

// eslint-disable-next-line no-unused-vars
// `contacts` and `contactsLoading` are currently used to power EmergencyContacts UI.

import toast from 'react-hot-toast';


const statCards = [


  { key: 'total', label: 'Total Alerts', icon: <AlertTriangle size={20} />, color: '#3b82f6', gradient: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.03))' },
  { key: 'critical', label: 'Critical', icon: <AlertTriangle size={20} />, color: '#ef4444', gradient: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.03))' },
  { key: 'high', label: 'High', icon: <TrendingUp size={20} />, color: '#f97316', gradient: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(249,115,22,0.03))' },
  { key: 'medium', label: 'Medium', icon: <CloudLightning size={20} />, color: '#f59e0b', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.03))' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { alerts, allAlerts, loading, connected, stats, fetchAlerts } = useAlerts();
  const [emergencyAlert, setEmergencyAlert] = useState(null);
  const [shownAlertIds, setShownAlertIds] = useState(new Set());

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


  // Show emergency notification for new critical/high alerts
  useEffect(() => {
    if (!alerts || alerts.length === 0) return;

    // Always prefer the most recently created critical/high alert.
    const topEmergency = alerts.find(
      (a) => (a.severity === 'critical' || a.severity === 'high') && a?._id && !shownAlertIds.has(a._id)
    );

    if (topEmergency) {
      setEmergencyAlert(topEmergency);
      setShownAlertIds((prev) => new Set([...prev, topEmergency._id]));
      return;
    }

    // If we already show an emergency alert and the alerts list updates with
    // the same emergency, keep the modal open.
    if (emergencyAlert && (emergencyAlert.severity === 'critical' || emergencyAlert.severity === 'high')) {
      const stillExists = alerts.some((a) => a._id === emergencyAlert._id);
      if (!stillExists) setEmergencyAlert(null);
    }
  }, [alerts, shownAlertIds, emergencyAlert]);


  const handleCloseEmergencyAlert = () => {
    setEmergencyAlert(null);
  };

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
      const margin = 36;
      let y = 54;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Disaster Alert Report', margin, y);

      y += 18;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(80);
      doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);

      y += 18;

      const list = alerts || [];
      if (list.length === 0) {
        doc.text('No active alerts to generate PDF.', margin, y);
      } else {
        doc.setTextColor(0);
        list.slice(0, 20).forEach((a, idx) => {
          if (y > 760) {
            doc.addPage();
            y = 54;
          }

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.text(`${idx + 1}. ${a.title}`, margin, y);

          y += 14;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);

          const loc = a.location?.city
            ? `${a.location.city}${a.location.state ? `, ${a.location.state}` : ''}`
            : a.zipCode
              ? `ZIP ${a.zipCode}`
              : '—';

          const dateTime = a.createdAt ? new Date(a.createdAt).toLocaleString() : '—';

          doc.text(`Location: ${loc}`, margin, y);
          y += 12;
          doc.text(`Severity: ${a.severity}`, margin, y);
          y += 12;
          doc.text(`Date/Time: ${dateTime}`, margin, y);
          y += 12;

          const description = (a.description || '').toString();
          const wrapped = doc.splitTextToSize(description, 520);
          doc.text('Description:', margin, y);
          y += 12;
          wrapped.forEach((line) => {
            if (y > 770) {
              doc.addPage();
              y = 54;
            }
            doc.text(line, margin + 8, y);
            y += 12;
          });

          y += 10;
        });
      }

      doc.save('disaster-alert-report.pdf');
      toast.success('PDF downloaded.');
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error('Failed to generate PDF.');
    }
  };


  return (
    <div className="page-wrapper" style={{ paddingBottom: '60px' }}>
      <div className="container">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '32px', paddingTop: '24px', flexWrap: 'wrap', gap: '16px',
          }}
        >
          <div>
            <h1 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              marginBottom: '6px',
            }}>
              Dashboard
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={15} />
              Alerts for ZIP code <strong style={{ color: '#38bdf8' }}>{user?.zipCode || '—'}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Live indicator */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px', borderRadius: '9999px',
              background: connected ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              border: `1px solid ${connected ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
              fontSize: '0.82rem', fontWeight: 500,
              color: connected ? '#22c55e' : '#ef4444',
            }}>
              <span className="pulse-dot" style={{
                width: '8px', height: '8px',
                background: connected ? '#22c55e' : '#ef4444',
              }} />
              {connected ? 'Live Connected' : 'Reconnecting...'}
            </div>

            {/* Refresh button */}
            <button
              onClick={fetchAlerts}
              className="btn btn-secondary btn-sm"
              style={{ padding: '8px 14px' }}
              title="Refresh alerts"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid-4" style={{ marginBottom: '28px' }}>
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              style={{
                background: stat.gradient,
                border: `1px solid ${stat.color}20`,
                borderRadius: '16px',
                padding: '22px',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: `${stat.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: stat.color, flexShrink: 0,
              }}>
                {stat.icon}
              </div>
              <div>
                <div style={{
                  fontSize: '1.5rem', fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700, color: '#f1f5f9',
                }}>
                  {stats[stat.key]}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '24px',
          alignItems: 'start',
        }} className="dashboard-grid">
          {/* Left Column — Alert List */}
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '16px', gap: 12,
              flexWrap: 'wrap'
            }}>
              <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.2rem',
                fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <Radio size={18} color="#3b82f6" />
                Active Alerts
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}
                  title="Download alert report as PDF"
                  disabled={loading}
                >
                  <Download size={16} />
                  Download PDF
                </button>

                <span style={{
                  fontSize: '0.78rem', color: '#64748b',
                  padding: '4px 12px', borderRadius: '8px',
                  background: 'rgba(100, 116, 139, 0.1)',
                }}>
                  {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <AlertList alerts={alerts} loading={loading} />

          </div>

          {/* Right Column — Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* ZIP Code Widget */}
            <ZipCodeForm />

            {/* Emergency Contacts */}
            <EmergencyContacts contacts={contacts} onRefresh={fetchContacts} loading={contactsLoading} />


            {/* Map */}
            <div>

              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1rem', fontWeight: 600,
                marginBottom: '12px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <MapPin size={16} color="#8b5cf6" />
                Alert Map
              </h3>
              <AlertMap alerts={allAlerts.length > 0 ? allAlerts : alerts} height="320px" />
            </div>

            {/* Emergency Safety Tips */}
            <SafetyTips />

            {/* Alert Type Summary */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: '16px',
              padding: '20px',
            }}>

              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '0.95rem', fontWeight: 600,
                marginBottom: '14px',
              }}>
                Alert Types
              </h3>
              {[
                { type: 'weather', icon: <CloudLightning size={16} />, color: '#38bdf8', label: 'Weather' },
                { type: 'flood', icon: <Waves size={16} />, color: '#06b6d4', label: 'Flood' },
                { type: 'earthquake', icon: <Mountain size={16} />, color: '#a78bfa', label: 'Earthquake' },
                { type: 'emergency', icon: <AlertTriangle size={16} />, color: '#fb7185', label: 'Emergency' },
              ].map((item) => {
                const count = alerts.filter(a => a.type === item.type).length;
                return (
                  <div key={item.type} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: '10px',
                    marginBottom: '4px',
                    background: count > 0 ? `${item.color}08` : 'transparent',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: item.color }}>
                      {item.icon}
                      <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{item.label}</span>
                    </div>
                    <span style={{
                      fontSize: '0.85rem', fontWeight: 600,
                      color: count > 0 ? item.color : '#475569',
                    }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Alert Notification */}
      <EmergencyAlertNotification 
        alert={emergencyAlert} 
        onClose={handleCloseEmergencyAlert}
      />

      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
