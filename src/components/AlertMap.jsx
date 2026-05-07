import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const severityColors = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#22c55e',
};

const severityRadius = {
  critical: 14,
  high: 12,
  medium: 10,
  low: 8,
};

export default function AlertMap({ alerts = [], height = '400px' }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    // Initialize map only once
    if (!mapInstance.current && mapContainer.current) {
      mapInstance.current = L.map(mapContainer.current).setView([20.5937, 78.9629], 4);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(mapInstance.current);
    }

    return () => {
      // Cleanup happens when component unmounts
    };
  }, []);

  // Update markers when alerts change
  useEffect(() => {
    if (!mapInstance.current) return;

    const validAlerts = alerts.filter(a =>
      a.location?.coordinates &&
      a.location.coordinates[0] !== 0 &&
      a.location.coordinates[1] !== 0
    );

    // Clear old markers
    Object.values(markersRef.current).forEach(marker => {
      mapInstance.current.removeLayer(marker);
    });
    markersRef.current = {};

    // Add new markers
    validAlerts.forEach(alert => {
      const lat = alert.location.coordinates[1];
      const lng = alert.location.coordinates[0];
      const color = severityColors[alert.severity] || '#94a3b8';
      const radius = severityRadius[alert.severity] || 10;

      // Create circle marker
      const circle = L.circleMarker([lat, lng], {
        radius: radius,
        color: color,
        fillColor: color,
        fillOpacity: 0.35,
        weight: 2,
      }).addTo(mapInstance.current);

      // Add popup
      circle.bindPopup(
        `<div style="font-size:12px; font-family: system-ui">
          <strong style="color: ${color}">${alert.title}</strong><br/>
          <span style="color: #999">Severity: ${alert.severity.toUpperCase()}</span><br/>
          ${alert.description?.slice(0, 60)}...<br/>
          📍 ZIP: ${alert.zipCode}
        </div>`,
        { maxWidth: 250 }
      );

      markersRef.current[alert._id] = circle;
    });

    // Auto-center if alerts exist
    if (validAlerts.length > 0) {
      const first = validAlerts[0];
      const targetZoom = validAlerts.length === 1 ? 10 : 5;
      mapInstance.current.setView(
        [first.location.coordinates[1], first.location.coordinates[0]],
        targetZoom,
        { animate: true }
      );
    }
  }, [alerts]);

  return (
    <div
      ref={mapContainer}
      style={{
        height,
        width: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(148, 163, 184, 0.1)',
      }}
    />
  );
}
