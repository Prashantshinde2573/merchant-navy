import React, { useRef, useState } from 'react';
import { MessageCircle, Mail, Linkedin, Twitter, Facebook } from 'lucide-react';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import './ShareModal.css';

export function ShareModal({ post, onClose }) {
  const dialog = useRef(null);
  const [feedback, setFeedback] = useState('');
  React.useEffect(() => { setFeedback(''); }, [post]);
  useDialogFocus(Boolean(post), onClose, dialog);
  if (!post) return null;
  const description = post.description.slice(0, 280);
  const message = `${description}\n\n${post.url}`;
  const copy = async (value, label) => {
    try { await navigator.clipboard.writeText(value); setFeedback(`${label} copied`); }
    catch { setFeedback('Copy is unavailable. Select the link above to copy it.'); }
  };
  const openPlatform = url => window.open(url, '_blank', 'noopener,noreferrer');
  const platforms = [
    ['WhatsApp', MessageCircle, `https://wa.me/?text=${encodeURIComponent(message)}`],
    ['Email', Mail, `mailto:?subject=${encodeURIComponent(description.slice(0, 80))}&body=${encodeURIComponent(message)}`],
    ['LinkedIn', Linkedin, `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(post.url)}`],
    ['X (Twitter)', Twitter, `https://twitter.com/intent/tweet?text=${encodeURIComponent(description)}&url=${encodeURIComponent(post.url)}`],
    ['Facebook', Facebook, `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(post.url)}`],
  ];
  return <div className="share-modal-backdrop" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="share-title" aria-describedby="share-subtitle" className="share-modal">
      <button type="button" className="share-close" aria-label="Close" onClick={onClose}><span className="material-symbols-outlined" aria-hidden="true">close</span></button>
      <h2 id="share-title">Share</h2><p id="share-subtitle">Pick a platform or copy the message below</p>
      <div className="share-preview"><strong>{description.slice(0, 80)}{description.length > 80 ? '…' : ''}</strong><p>{description.slice(80)}{post.description.length > 280 ? '…' : ''}</p><a href={post.url}>{post.url}</a></div>
      <div className="share-platforms">{platforms.map(([label, Icon, url]) => <button type="button" key={label} onClick={() => openPlatform(url)}><Icon size={20} aria-hidden="true" />{label}</button>)}</div>
      <div className="share-copy-actions"><button type="button" onClick={() => copy(post.url, 'Link')}><span className="material-symbols-outlined" aria-hidden="true">content_copy</span>Copy link</button><button type="button" onClick={() => copy(message, 'Message')}><span className="material-symbols-outlined" aria-hidden="true">content_copy</span>Copy message</button></div>
      <button type="button" className="share-more" onClick={async () => {
        if (!navigator.share) { await copy(message, 'Message'); return; }
        try { await navigator.share({ title: description.slice(0, 80), text: description, url: post.url }); }
        catch (error) { if (error.name !== 'AbortError') setFeedback('Sharing is unavailable. Use Copy link or Copy message.'); }
      }}><span className="material-symbols-outlined" aria-hidden="true">share</span>More apps…</button>
      {feedback && <p className="share-feedback" role="status">{feedback}</p>}
    </section>
  </div>;
}
