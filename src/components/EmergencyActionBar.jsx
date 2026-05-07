import { useEffect, useMemo, useState } from 'react';
import { Phone, Send, MapPin, Share2, ShieldAlert, X, Loader } from 'lucide-react';
import { contactsAPI } from '../services/api';
import toast from 'react-hot-toast';

const DEFAULT_ALERT_TEXT = (alert) => {
  const loc = alert?.location?.city
    ? `${alert.location.city}${alert.location.state ? `, ${alert.location.state}` : ''}`
    : alert?.zipCode
      ? `ZIP ${alert.zipCode}`
      : '';

  const dateTime = alert?.createdAt ? new Date(alert.createdAt).toLocaleString('en-IN') : '';

  return [
    `🚨 ${alert?.title ? alert.title : 'Emergency Alert'}`,
    alert?.severity ? `Severity: ${alert.severity}` : null,
    loc ? `Location: ${loc}` : null,
    dateTime ? `Time: ${dateTime}` : null,
    alert?.description ? `Details: ${alert.description}` : null,
  ]
    .filter(Boolean)
    .join('\n');
};

function getDeviceLocationText(coords) {
  if (!coords) return '';
  const { latitude, longitude } = coords;
  if (typeof latitude !== 'number' || typeof longitude !== 'number') return '';
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

export default function EmergencyActionBar({ alert }) {
  const [speaking, setSpeaking] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [coords, setCoords] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const message = useMemo(() => DEFAULT_ALERT_TEXT(alert), [alert]);

  const fetchContacts = async () => {
    setContactsLoading(true);
    try {
      const res = await contactsAPI.getContacts();
      setContacts(res.data.data?.contacts || []);
    } catch (err) {
      console.error('Failed to fetch contacts for emergency actions:', err);
      toast.error(err?.response?.data?.message || 'Failed to load emergency contacts.');
    } finally {
      setContactsLoading(false);
    }
  };

  useEffect(() => {
    if (alert) fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alert?._id]);

  const canCall = typeof window !== 'undefined' && (window?.tel || true);

  const startVoiceAnnouncement = () => {
    const speech = window?.speechSynthesis;
    if (!speech || !('SpeechSynthesisUtterance' in window)) {
      toast.error('Voice announcement not supported in this browser.');
      return;
    }

    // Stop any current speech.
    speech.cancel();

    const utter = new SpeechSynthesisUtterance(message);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);

    speech.speak(utter);
  };

  const stopVoiceAnnouncement = () => {
    const speech = window?.speechSynthesis;
    if (!speech) return;
    speech.cancel();
    setSpeaking(false);
  };

  const requestLiveLocation = () => {
    if (!navigator?.geolocation) {
      toast.error('Geolocation not supported in this browser.');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setGeoLoading(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setGeoLoading(false);
        toast.error(err?.message || 'Failed to fetch location.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const shareLiveLocation = async () => {
    const mapsUrl = getDeviceLocationText(coords);
    if (!mapsUrl) {
      toast.error('Location not available yet. Click “Share live location” first.');
      return;
    }

    const shareText = `${message}\n\nLive location: ${mapsUrl}`;

    // Prefer Web Share API.
    if (navigator?.share) {
      try {
        await navigator.share({
          text: shareText,
          url: mapsUrl,
          title: 'Emergency Alert',
        });
        toast.success('Shared.');
        return;
      } catch (e) {
        // fall back to sms/mailto
      }
    }

    // Fallback: open SMS/share via mailto. (No API keys / paid services.)
    // Note: Most browsers will open the user’s default handler.
    window.location.href = `mailto:?subject=${encodeURIComponent('Emergency Alert')}&body=${encodeURIComponent(shareText)}`;
  };

  const sendAlertSmsToContacts = () => {
    // SMS via sms: is not consistently supported on desktop.
    // We'll open the device SMS composer if supported; otherwise use a mailto fallback.
    const first = contacts?.[0];
    const recipientList = (contacts || []).map((c) => c.phoneNumber).filter(Boolean);

    const mapsUrl = getDeviceLocationText(coords);
    const fullMessage = mapsUrl ? `${message}\n\nLive location: ${mapsUrl}` : message;

    if (recipientList.length === 0) {
      toast.error('Add emergency contacts first.');
      return;
    }

    const primary = recipientList.join(',');

    // Try sms: composer
    try {
      // eslint-disable-next-line no-restricted-globals
      window.location.href = `sms:${encodeURIComponent(primary)}?&body=${encodeURIComponent(fullMessage)}`;
    } catch (e) {
      // mailto fallback
      window.location.href = `mailto:?subject=${encodeURIComponent('Emergency Alert')}&body=${encodeURIComponent(fullMessage)}`;
    }

    toast.success('Emergency message composer opened.');
  };

  const sosIntegration = () => {
    // True SOS can’t be implemented purely in web; we instead trigger a strong, user-confirmed browser flow.
    // Option: open tel to local emergency number (configurable). Default to 112.
    const emergencyNumber = '112';

    try {
      window.location.href = `tel:${emergencyNumber}`;
    } catch (e) {
      toast.error('Phone call not supported.');
    }
  };

  const emergencyCallPrimary = () => {
    const first = contacts?.[0];
    if (!first?.phoneNumber) {
      toast.error('No emergency contact phone number available.');
      return;
    }

    try {
      window.location.href = `tel:${encodeURIComponent(first.phoneNumber)}`;
    } catch (e) {
      toast.error('Phone call not supported.');
    }
  };

  if (!alert) return null;

  return (
    <div
      style={{
        marginTop: 16,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 12,
      }}
    >
      {/* One-click emergency calling */}
      <button
        type="button"
        onClick={emergencyCallPrimary}
        style={actionButtonStyle}
        title="Call the first saved emergency contact"
      >
        <Phone size={16} />
        One-click calling
      </button>

      {/* Send alert SMS/message */}
      <button
        type="button"
        onClick={sendAlertSmsToContacts}
        style={actionButtonStyle}
        title="Send alert message to all saved emergency contacts (via SMS composer / fallback)"
      >
        <Send size={16} />
        Send alert SMS/message
      </button>

      {/* Share live location */}
      <button
        type="button"
        onClick={() => {
          if (!coords) requestLiveLocation();
          else shareLiveLocation();
        }}
        style={actionButtonStyle}
        title="Fetch and share your live location"
        disabled={geoLoading || contactsLoading}
      >
        {geoLoading ? <Loader size={16} /> : <Share2 size={16} />}
        Share live location
      </button>

      {/* SOS button integration */}
      <button
        type="button"
        onClick={sosIntegration}
        style={{
          ...actionButtonStyle,
          background: 'rgba(239, 68, 68, 0.15)',
          borderColor: 'rgba(239, 68, 68, 0.35)',
          color: '#fecaca',
        }}
        title="Trigger a high-priority SOS flow (calls emergency number 112)"
      >
        <ShieldAlert size={16} />
        SOS
      </button>

      {/* Voice control */}
      <button
        type="button"
        onClick={speaking ? stopVoiceAnnouncement : startVoiceAnnouncement}
        style={actionButtonStyle}
        title="Start/stop voice announcement"
      >
        <MapPin size={16} />
        {speaking ? 'Stop voice' : 'Voice announcement'}
      </button>

      {/* Close helper (optional; keeps bar layout consistent) */}
      <button
        type="button"
        onClick={() => {
          toast('Tip: use your browser’s default call/SMS/share handler.');
        }}
        style={actionButtonStyle}
        title="How it works"
      >
        <X size={16} />
        Quick help
      </button>
    </div>
  );
}

const actionButtonStyle = {
  padding: '12px 12px',
  borderRadius: 12,
  background: 'rgba(30, 41, 59, 0.55)',
  border: '1px solid rgba(148, 163, 184, 0.18)',
  color: '#e2e8f0',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  fontWeight: 700,
};

