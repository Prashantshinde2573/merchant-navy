import React from 'react';
import './PortServiceIcon.css';

// The exact Material Symbols glyphs/font used by merchant.navy's desktop Home feed.
export function PortServiceIcon({ name, className = '' }) {
  if (!['anchor', 'settings'].includes(name)) return null;
  return <span className={`port-service-icon ${className}`} aria-hidden="true" data-port-service-icon={name}>{name}</span>;
}
