import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Bell, MapPin, Zap, CloudLightning, Waves, Mountain, AlertTriangle, ArrowRight, Globe, Users, Radio } from 'lucide-react';

const features = [
  {
    icon: <Bell size={24} />,
    title: 'Real-Time Alerts',
    description: 'Instant notifications via WebSocket when disasters strike your area.',
    color: '#3b82f6',
  },
  {
    icon: <MapPin size={24} />,
    title: 'Location-Based',
    description: 'Alerts filtered by your ZIP code for hyper-local accuracy.',
    color: '#8b5cf6',
  },
  {
    icon: <Zap size={24} />,
    title: 'Multi-Category',
    description: 'Weather, floods, earthquakes, and emergency alerts in one place.',
    color: '#f59e0b',
  },
  {
    icon: <Globe size={24} />,
    title: 'Interactive Map',
    description: 'Visualize active alerts on a live dark-themed map.',
    color: '#06b6d4',
  },
];

const alertTypes = [
  { icon: <CloudLightning size={32} />, label: 'Weather', color: '#38bdf8', desc: 'Storms, heat, cold' },
  { icon: <Waves size={32} />, label: 'Flood', color: '#06b6d4', desc: 'Flash floods, coastal' },
  { icon: <Mountain size={32} />, label: 'Earthquake', color: '#a78bfa', desc: 'Seismic activity' },
  { icon: <AlertTriangle size={32} />, label: 'Emergency', color: '#fb7185', desc: 'Evacuations, hazmat' },
];

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '50+', label: 'Alert Types' },
  { value: '< 3s', label: 'Alert Delivery' },
  { value: '99.9%', label: 'Uptime' },
];

export default function Landing() {
  return (
    <div style={{ overflow: 'hidden' }}>
      {/* ─── Hero Section ─────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '120px 24px 80px',
      }}>
        {/* Animated background orbs */}
        <div style={{
          position: 'absolute', top: '10%', left: '10%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '10%',
          width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)',
          animation: 'float 10s ease-in-out infinite reverse',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)', transform: 'translate(-50%, -50%)',
          animation: 'float 12s ease-in-out infinite',
        }} />

        <div style={{ maxWidth: '900px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '8px 20px', borderRadius: '9999px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              marginBottom: '28px', fontSize: '0.85rem', color: '#38bdf8',
            }}
          >
            <Radio size={16} />
            Real-Time Disaster Monitoring
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '24px',
              letterSpacing: '-0.03em',
            }}
          >
            Stay Protected with{' '}
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              DisasterGuard
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: '#94a3b8',
              lineHeight: 1.7,
              maxWidth: '650px',
              margin: '0 auto 40px',
            }}
          >
            Get instant, location-based alerts for severe weather, earthquakes, floods,
            and emergencies. Powered by real-time data and WebSocket technology.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/signup" className="btn btn-primary btn-lg" style={{ fontSize: '1rem' }}>
              <Shield size={20} />
              Get Protected Now
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg" style={{ fontSize: '1rem' }}>
              Sign In
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats Bar ────────────────────────────── */}
      <section style={{
        padding: '40px 24px',
        borderTop: '1px solid rgba(148, 163, 184, 0.06)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.06)',
        background: 'rgba(15, 23, 42, 0.3)',
      }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px',
        }} className="grid-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Features Section ─────────────────────── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              fontWeight: 700,
              marginBottom: '16px',
            }}>
              Why{' '}
              <span className="text-gradient">DisasterGuard</span>?
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '550px', margin: '0 auto' }}>
              Built with cutting-edge technology to keep you safe and informed.
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
          }}>
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(148, 163, 184, 0.08)',
                  borderRadius: '18px',
                  padding: '32px 28px',
                  transition: 'all 300ms ease',
                  cursor: 'default',
                }}
                whileHover={{
                  borderColor: `${feature.color}40`,
                  boxShadow: `0 0 30px ${feature.color}15`,
                  y: -4,
                }}
              >
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: `${feature.color}15`,
                  border: `1px solid ${feature.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: feature.color, marginBottom: '20px',
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '10px', color: '#f1f5f9' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Alert Types Section ──────────────────── */}
      <section style={{
        padding: '100px 24px',
        background: 'rgba(15, 23, 42, 0.3)',
        borderTop: '1px solid rgba(148, 163, 184, 0.06)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '50px' }}
          >
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              fontWeight: 700,
              marginBottom: '16px',
            }}>
              Alert Categories
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem' }}>
              Comprehensive coverage across all disaster types.
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
          }}>
            {alertTypes.map((type, i) => (
              <motion.div
                key={type.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: `1px solid ${type.color}20`,
                  borderRadius: '18px',
                  padding: '32px 24px',
                  textAlign: 'center',
                  cursor: 'default',
                  transition: 'all 300ms ease',
                }}
              >
                <div style={{
                  color: type.color,
                  marginBottom: '16px',
                  display: 'flex', justifyContent: 'center',
                }}>
                  {type.icon}
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '6px' }}>
                  {type.label}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{type.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ──────────────────────────── */}
      <section style={{ padding: '100px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            maxWidth: '700px', margin: '0 auto', textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))',
            border: '1px solid rgba(59, 130, 246, 0.15)',
            borderRadius: '24px',
            padding: '60px 40px',
          }}
        >
          <div style={{
            width: '64px', height: '64px', borderRadius: '18px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <Shield size={30} color="#fff" />
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700, marginBottom: '16px',
          }}>
            Ready to Stay Safe?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '32px', lineHeight: 1.7 }}>
            Join thousands of users who trust DisasterGuard for real-time
            emergency alerts and disaster preparedness.
          </p>
          <Link to="/signup" className="btn btn-primary btn-lg">
            <Shield size={20} />
            Create Free Account
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* ─── Footer ───────────────────────────────── */}
      <footer style={{
        padding: '30px 24px',
        borderTop: '1px solid rgba(148, 163, 184, 0.06)',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
          <Shield size={18} color="#3b82f6" />
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, color: '#f1f5f9' }}>
            DisasterGuard
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#475569' }}>
          © {new Date().getFullYear()} DisasterGuard. Built with MERN Stack + Socket.io
        </p>
      </footer>
    </div>
  );
}
