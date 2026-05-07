import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Shield, User, Mail, Lock, MapPin, Eye, EyeOff, ArrowRight, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', zipCode: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'zipCode') {
      value = value.replace(/\D/g, '').slice(0, 6);
    }
    setForm(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.zipCode) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (!form.zipCode.match(/^\d{5,6}$/)) {
      toast.error('Please enter a valid 5-6 digit ZIP code');
      return;
    }

    setLoading(true);
    const result = await register(form.name, form.email, form.password, form.zipCode);
    setLoading(false);

    if (result.success) {
      toast.success('Account created! Welcome to DisasterGuard.');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', icon: <User size={18} />, placeholder: 'John Doe', autoComplete: 'name' },
    { name: 'email', label: 'Email Address', type: 'email', icon: <Mail size={18} />, placeholder: 'you@example.com', autoComplete: 'email' },
    { name: 'password', label: 'Password', type: showPassword ? 'text' : 'password', icon: <Lock size={18} />, placeholder: '••••••••', autoComplete: 'new-password' },
    { name: 'zipCode', label: 'ZIP Code', type: 'text', icon: <MapPin size={18} />, placeholder: '10001', autoComplete: 'postal-code' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Background effects */}
      <div style={{
        position: 'fixed', top: '15%', left: '15%',
        width: '320px', height: '320px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '15%', right: '15%',
        width: '280px', height: '280px',
        background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: '24px',
          padding: '44px 40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Shield size={26} color="#fff" />
          </div>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.75rem',
            fontWeight: 700,
            marginBottom: '8px',
          }}>
            Create Account
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Join DisasterGuard for real-time safety alerts
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div className="form-group" key={field.name}>
              <label className="form-label">{field.label}</label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: '#64748b', pointerEvents: 'none',
                }}>
                  {field.icon}
                </div>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="form-input"
                  style={{ paddingLeft: '42px', paddingRight: field.name === 'password' ? '42px' : '16px' }}
                  autoComplete={field.autoComplete}
                  id={`signup-${field.name}`}
                />
                {field.name === 'password' && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px',
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
              </div>
              {field.name === 'zipCode' && (
                <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '6px' }}>
                  Enter your US ZIP code (5 digits) or Indian PIN code (6 digits)
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '0.95rem', marginTop: '8px' }}
            id="signup-submit"
          >
            {loading ? (
              <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{
          marginTop: '28px',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#64748b',
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#3b82f6', fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
