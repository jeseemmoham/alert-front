import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Mountain, Flame, Wind, ShieldAlert } from 'lucide-react';

const tipsData = [
  {
    key: 'Flood',
    icon: <Droplets size={18} color="#06b6d4" />,
    color: '#06b6d4',
    description:
      'Move to higher ground immediately. Avoid walking or driving through floodwater. Turn off electricity if water reaches electrical outlets.',
    steps: [
      'If advised, evacuate early—don’t wait for severe flooding.',
      'Stay away from moving water and flooded areas.',
      'Keep a small emergency kit (water, flashlight, batteries).',
    ],
  },
  {
    key: 'Earthquake',
    icon: <Mountain size={18} color="#a78bfa" />,
    color: '#a78bfa',
    description:
      'Drop, Cover, and Hold On. Stay indoors away from windows and heavy objects. Be prepared for aftershocks.',
    steps: [
      'If you are outside, move to an open area away from buildings.',
      'Check for injuries and hazards after the shaking stops.',
      'Keep shoes and a flashlight nearby for protection.',
    ],
  },
  {
    key: 'Fire',
    icon: <Flame size={18} color="#fb7185" />,
    color: '#fb7185',
    description:
      'Get out fast. Close doors behind you if it is safe to do so. Use a fire extinguisher only if trained and the fire is small.',
    steps: [
      'Install smoke detectors and test them monthly.',
      'Plan two escape routes from every room.',
      'If smoke is present, stay low and crawl to safety.',
    ],
  },
  {
    key: 'Cyclone',
    icon: <Wind size={18} color="#38bdf8" />,
    color: '#38bdf8',
    description:
      'Follow official evacuation orders and shelter indoors. Secure loose objects and prepare for power and communication outages.',
    steps: [
      'Gather essential supplies (water, meds, battery power).',
      'Stay away from windows during high winds.',
      'Charge devices early before outages.',
    ],
  },
];

export default function SafetyTips() {
  const [openKey, setOpenKey] = useState('Flood');

  const summary = useMemo(() => {
    const keys = tipsData.map((t) => t.key);
    return keys;
  }, []);

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
      <h3 style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: '0.95rem',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
      }}>
        <ShieldAlert size={16} color="#38bdf8" />
        Emergency Safety Tips
      </h3>

      <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 14 }}>
        Categories: {summary.join(', ')}
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {tipsData.map((t) => {
          const isOpen = openKey === t.key;
          return (
            <div
              key={t.key}
              style={{
                borderRadius: 14,
                border: `1px solid rgba(148, 163, 184, 0.14)`,
                background: 'rgba(30, 41, 59, 0.45)',
                overflow: 'hidden',
              }}
            >
              <button
                type="button"
                onClick={() => setOpenKey(isOpen ? '' : t.key)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'transparent',
                  border: 'none',
                  color: '#e2e8f0',
                  padding: '12px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  cursor: 'pointer',
                }}
                aria-expanded={isOpen}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
                  {t.icon}
                  {t.key}
                </span>
                <span style={{ color: '#94a3b8', fontWeight: 800 }}>{isOpen ? '−' : '+'}</span>
              </button>

              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.25 }}
                  style={{ padding: '0 12px 12px 12px' }}
                >
                  <div style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    {t.description}
                  </div>
                  <ul style={{ marginTop: 10, marginBottom: 0, paddingLeft: 18, color: '#e2e8f0', fontSize: '0.85rem', lineHeight: 1.6 }}>
                    {t.steps.map((s) => (
                      <li key={s} style={{ marginBottom: 6 }}>
                        {s}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}

