import React from 'react';
import { FileText } from 'lucide-react';

export function PostAttachments({ attachments = [] }) {
  if (!attachments.length) return <p className="text-sm leading-5 text-zinc-500">No attachments available</p>;
  return <ul className="flex flex-col gap-2" aria-label="Post attachments">{attachments.map((file, index) => {
    const name = typeof file === 'string' ? file : file.name || file.fileName || file.filename || 'Attachment';
    return <li key={`${name}-${index}`} className="flex items-center gap-2 text-sm text-zinc-600"><FileText size={16} aria-hidden="true" /><span className="break-words min-w-0">{name}</span></li>;
  })}</ul>;
}
