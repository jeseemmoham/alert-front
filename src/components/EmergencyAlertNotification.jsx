import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import EmergencyActionBar from './EmergencyActionBar';


const severityLevels = {
  critical: { level: 4, color: '#ef4444', bg: '#fecaca' },
  high: { level: 3, color: '#f97316', bg: '#fed7aa' },
  medium: { level: 2, color: '#f59e0b', bg: '#fef3c7' },
  low: { level: 1, color: '#22c55e', bg: '#dcfce7' },
};

export default function EmergencyAlertNotification({ alert, onClose }) {
  const [isVisible, setIsVisible] = useState(!!alert);

  useEffect(() => {
    setIsVisible(!!alert);
    
    // Auto-hide after 15 seconds if not critical
    if (alert && alert.severity !== 'critical') {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [alert, onClose]);

  if (!isVisible || !alert) return null;

  const severity = severityLevels[alert.severity] || severityLevels.medium;
  const timestamp = new Date(alert.createdAt).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
      animation: 'slideIn 0.3s ease-out',
    }}>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(-30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      <div style={{
        background: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      }}>
        {/* Red Header */}
        <div style={{
          background: severity.color,
          color: 'white',
          padding: '24px',
          textAlign: 'center',
          position: 'relative',
        }}>
          <button
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            style={{
              position: 'absolute',
              right: '16px',
              top: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '4px',
              padding: '8px',
              cursor: 'pointer',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
          
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            margin: '0',
            letterSpacing: '2px',
          }}>
            EMERGENCY ALERT
          </h1>
          <p style={{
            fontSize: '0.95rem',
            margin: '8px 0 0',
            opacity: 0.95,
          }}>
            National Disaster Management Authority (NDMA) - Regional Hub
          </p>
        </div>

        {/* Alert Details */}
        <div style={{
          padding: '32px',
          background: '#f8fafc',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '24px',
          }}>
            {/* Disaster Type */}
            <div>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}>
                DISASTER TYPE
              </div>
              <div style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#1e293b',
              }}>
                {alert.title}
              </div>
            </div>

            {/* Severity */}
            <div>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}>
                SEVERITY
              </div>
              <div style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: severity.color,
              }}>
                {alert.severity.toUpperCase()} (Level {severity.level})
              </div>
            </div>

            {/* Location */}
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}>
                LOCATION
              </div>
              <div style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#1e293b',
              }}>
                {alert.location?.city || 'Unknown Location'} 
                {alert.zipCode && ` (ZIP: ${alert.zipCode})`}
              </div>
            </div>

            {/* Timestamp */}
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}>
                TIMESTAMP
              </div>
              <div style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#1e293b',
              }}>
                {timestamp} IST
              </div>
            </div>
          </div>

          {/* Alert Message */}
          <div style={{
            borderLeft: `4px solid ${severity.color}`,
            background: 'white',
            padding: '16px',
            borderRadius: '4px',
            marginBottom: '16px',
          }}>
            <p style={{
              margin: 0,
              fontSize: '0.95rem',
              lineHeight: 1.6,
              color: '#334155',
              fontStyle: 'italic',
            }}>
              "{alert.description}"
            </p>
          </div>

          {/* Emergency Actions */}
          <EmergencyActionBar alert={alert} />

          {/* Action Button */}
          <button
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}

            style={{
              width: '100%',
              padding: '12px 16px',
              background: severity.color,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.9'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            ACKNOWLEDGE ALERT
          </button>
        </div>
      </div>
    </div>
  );
}
