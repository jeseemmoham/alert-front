import AlertCard from './AlertCard';
import { AlertTriangle } from 'lucide-react';

export default function AlertList({ alerts, loading }) {
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        background: 'rgba(15, 23, 42, 0.5)',
        borderRadius: '16px',
        border: '1px solid rgba(148, 163, 184, 0.08)',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'rgba(34, 197, 94, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <AlertTriangle size={28} color="#22c55e" />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '8px' }}>
          All Clear!
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          No active alerts for your area. Stay safe!
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {alerts.map((alert, index) => (
        <AlertCard key={alert._id} alert={alert} index={index} />
      ))}
    </div>
  );
}
