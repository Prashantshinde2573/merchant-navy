import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IdCard, MoreVertical } from 'lucide-react';
import { VendorProfileModal } from '../VendorProfileModal/VendorProfileModal';
export function MerchantRowActions({ companyName, children }) {
  const [open, setOpen] = useState(false), [menu, setMenu] = useState(false);
  const root = useRef(null), menuRef = useRef(null);
  const [anchor, setAnchor] = useState({});
  useEffect(() => {
    if (!menu) return;
    const close = e => { if ((!root.current?.contains(e.target) && !menuRef.current?.contains(e.target)) || e.key === 'Escape') setMenu(false); };
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', close);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close); };
  }, [menu]);
  return <><div className="post-actions merchant-row-actions" ref={root}><button type="button" className="post-overflow-trigger merchant-card-trigger" aria-label={`View merchant card for ${companyName}`} onClick={() => setOpen(true)}><IdCard size={18} /></button>{children}<button type="button" className="post-overflow-trigger" aria-label={`More actions for ${companyName}`} aria-haspopup="menu" aria-expanded={menu} onClick={event => { const box = event.currentTarget.getBoundingClientRect(); setAnchor({ position: 'fixed', top: box.bottom + 60 > window.innerHeight ? box.top - 54 : box.bottom + 4, left: Math.max(8, box.right - 160), right: 'auto', width: 160, zIndex: 1200 }); setMenu(!menu); }}><MoreVertical size={18} /></button>{menu && createPortal(<div ref={menuRef} role="menu" style={anchor} className="post-overflow-menu"><button role="menuitem" autoFocus onClick={() => { setMenu(false); setOpen(true); }}>View Profile</button></div>, document.body)}</div><VendorProfileModal companyName={open ? companyName : null} onClose={() => setOpen(false)} /></>;
}
