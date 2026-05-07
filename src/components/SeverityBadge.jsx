export default function SeverityBadge({ severity, size = 'md' }) {
  const config = {
    critical: { label: 'Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
    high: { label: 'High', color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)' },
    medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
    low: { label: 'Low', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)' },
  };

  const c = config[severity] || config.low;
  const isSmall = size === 'sm';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: isSmall ? '3px 10px' : '5px 14px',
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: '9999px',
      fontSize: isSmall ? '0.7rem' : '0.75rem',
      fontWeight: 600,
      color: c.color,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: isSmall ? '6px' : '8px',
        height: isSmall ? '6px' : '8px',
        borderRadius: '50%',
        background: c.color,
        boxShadow: `0 0 8px ${c.color}`,
      }} />
      {c.label}
    </span>
  );
}
