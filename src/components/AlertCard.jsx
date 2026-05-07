import { useState } from 'react';
import { motion } from 'framer-motion';
import SeverityBadge from './SeverityBadge';
import { CloudLightning, Waves, Mountain, AlertTriangle, Clock, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

const typeIcons = {
  weather: <CloudLightning size={22} />,
  flood: <Waves size={22} />,
  earthquake: <Mountain size={22} />,
  emergency: <AlertTriangle size={22} />,
};

const typeColors = {
  weather: '#38bdf8',
  flood: '#06b6d4',
  earthquake: '#a78bfa',
  emergency: '#fb7185',
};

const severityBorders = {
  critical: 'rgba(239, 68, 68, 0.6)',
  high: 'rgba(249, 115, 22, 0.5)',
  medium: 'rgba(245, 158, 11, 0.4)',
  low: 'rgba(34, 197, 94, 0.3)',
};

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AlertCard({ alert, index = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const [speaking, setSpeaking] = useState(false);


  const borderColor = severityBorders[alert.severity] || severityBorders.low;
  const typeColor = typeColors[alert.type] || '#94a3b8';

  return (
      <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      style={{
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: '14px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 250ms ease',
      }}
      onClick={() => setExpanded(!expanded)}
      whileHover={{
        borderColor: 'rgba(59, 130, 246, 0.32)',
        boxShadow: '0 10px 32px rgba(0,0,0,0.35)',
        transform: 'translateY(-2px)',
      }}
    >
      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
          {/* Type Icon */}
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: `${typeColor}15`,
            border: `1px solid ${typeColor}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: typeColor,
            flexShrink: 0,
          }}>
            {typeIcons[alert.type] || <AlertTriangle size={22} />}
          </div>

          {/* Title & Meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#f1f5f9',
              marginBottom: '6px',
              lineHeight: 1.3,
            }}>
              {alert.title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <SeverityBadge severity={alert.severity} size="sm" />
              <span style={{
                fontSize: '0.78rem',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <Clock size={13} />
                {timeAgo(alert.createdAt)}
              </span>
              {alert.zipCode && (
                <span style={{
                  fontSize: '0.78rem',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <MapPin size={13} />
                  {alert.zipCode}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Expand Toggle */}
        <div style={{ color: '#64748b', flexShrink: 0, marginTop: '4px' }}>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {/* Description (expandable) */}
      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.28 }}
        style={{ overflow: 'hidden' }}
      >
        <p style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(148, 163, 184, 0.08)',
          color: '#cbd5e1',
          fontSize: '0.9rem',
          lineHeight: 1.7,
        }}>
          {alert.description}
        </p>

        {/* Location info */}
        {alert.location?.city && (
          <div style={{
            marginTop: '12px',
            padding: '10px 14px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '10px',
            fontSize: '0.82rem',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <MapPin size={14} />
            {alert.location.city}{alert.location.state ? `, ${alert.location.state}` : ''}
          </div>
        )}

        {/* Source badge */}
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.72rem',
            color: '#475569',
            padding: '3px 10px',
            background: 'rgba(71, 85, 105, 0.15)',
            borderRadius: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Source: {alert.source || 'system'}
          </span>
          <span style={{
            fontSize: '0.72rem',
            color: typeColor,
            padding: '3px 10px',
            background: `${typeColor}12`,
            borderRadius: '6px',
            textTransform: 'capitalize',
          }}>
            {alert.type}
          </span>

          {/* Voice controls (Web Speech API) */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const speech = window?.speechSynthesis;
                if (!speech || !('SpeechSynthesisUtterance' in window)) {
                  return;
                }

                speech.cancel();

                const loc = alert.location?.city
                  ? `${alert.location.city}${alert.location.location?.state ? `, ${alert.location.location.state}` : ''}`
                  : alert.zipCode
                    ? `ZIP ${alert.zipCode}`
                    : '';

                const dateTime = alert.createdAt ? new Date(alert.createdAt).toLocaleString() : '';

                const text = [
                  `Disaster alert: ${alert.title}.`,
                  alert.severity ? `Severity: ${alert.severity}.` : '',
                  loc ? `Location: ${loc}.` : '',
                  dateTime ? `Date and time: ${dateTime}.` : '',
                  alert.description ? `Description: ${alert.description}.` : ''
                ].filter(Boolean).join(' ');

                const utter = new SpeechSynthesisUtterance(text);
                utter.onend = () => setSpeaking(false);
                utter.onerror = () => setSpeaking(false);

                setSpeaking(true);
                speech.speak(utter);
              }}
              style={{
                border: '1px solid rgba(148,163,184,0.18)',
                background: speaking ? `${typeColor}14` : 'rgba(71,85,105,0.12)',
                color: speaking ? typeColor : '#cbd5e1',
                borderRadius: 12,
                padding: '6px 10px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.78rem',
              }}
              title="Start voice announcement"
              aria-label="Start voice announcement"
            >
              {speaking ? 'Speaking…' : 'Start speaking'}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const speech = window?.speechSynthesis;
                if (!speech) return;
                speech.cancel();
                setSpeaking(false);
              }}
              style={{
                border: '1px solid rgba(148,163,184,0.18)',
                background: 'rgba(15,23,42,0.2)',
                color: '#e2e8f0',
                borderRadius: 12,
                padding: '6px 10px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.78rem',
              }}
              title="Stop voice announcement"
              aria-label="Stop voice announcement"
            >
              Stop
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
