import { PortServiceIcon } from '../PortServiceIcon/PortServiceIcon';
import React from 'react';
import { FileText, Paperclip } from 'lucide-react';

const icons = { description: FileText, attach_file: Paperclip };

// A fixed icon column keeps headings and their supporting content aligned.
export function ContentIcon({ name, className = '' }) {
  if (name === 'anchor' || name === 'settings') return <PortServiceIcon name={name} className={className} />;
  const Icon = icons[name];
  return Icon ? <Icon size={24} className={`ui-content-icon ${className}`} aria-hidden="true" /> : null;
}
