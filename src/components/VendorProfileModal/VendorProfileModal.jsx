import { PortServiceIcon } from '../PortServiceIcon/PortServiceIcon';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FileText, Star, Users, X } from 'lucide-react';
import { COMPANY_PROFILES } from '../../data/companyProfiles';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import './VendorProfileModal.css';

const TABS = ['Company', 'Certificates', 'Insurance', 'Team', 'Gallery', 'Reviews'];
function Avatar({ name, image, initials, className = '' }) {
  return <span className={`vendor-profile-avatar ${className}`}>
    {image ? <img src={image} alt={name} /> : <span role="img" aria-label={name}>{initials || name.split(' ').slice(0, 2).map(word => word[0]).join('')}</span>}
  </span>;
}

export function VendorProfileModal({ companyName, onClose }) {
  const [activeTab, setActiveTab] = useState('Company');
  const dialogRef = useRef(null);
  const dragStart = useRef(null);
  const tabRefs = useRef([]);
  const bodyRef = useRef(null);
  const profile = COMPANY_PROFILES[companyName] || (companyName ? { name: companyName, fields: [], ports: [], services: [], certificates: [], insurance: [], team: [], gallery: [], reviews: [] } : null);
  useDialogFocus(Boolean(profile), onClose, dialogRef);
  useEffect(() => { setActiveTab('Company'); }, [companyName]);
  if (!profile) return null;
  const endDrag = (event) => {
    const start = dragStart.current;
    dragStart.current = null;
    dialogRef.current?.style.removeProperty('--vendor-profile-drag');
    if (start !== null && event.type === 'pointerup' && event.clientY - start > 64) onClose();
  };
  const selectTab = tab => { setActiveTab(tab); if (bodyRef.current) bodyRef.current.scrollTop = 0; };
  const handleTabKeys = event => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault(); event.stopPropagation();
    const current = TABS.indexOf(activeTab);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? TABS.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length;
    selectTab(TABS[next]); tabRefs.current[next]?.focus();
  };
  return createPortal(<div className="vendor-profile-backdrop" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="vendor-profile-name" className="vendor-profile-dialog">
      <div
        className="vendor-profile-drag-handle"
        aria-hidden="true"
        onPointerDown={event => {
          if (!event.isPrimary || event.button !== 0) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          dragStart.current = event.clientY;
        }}
        onPointerMove={event => {
          if (dragStart.current === null || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
          dialogRef.current.style.setProperty('--vendor-profile-drag', `${Math.max(0, event.clientY - dragStart.current)}px`);
        }}
        onPointerUp={endDrag}
        onLostPointerCapture={endDrag}
      />
      <header className="vendor-profile-header">
        <Avatar name={profile.name} image={profile.avatar} initials={profile.initials} />
        <div className="vendor-profile-identity"><h2 id="vendor-profile-name" title={profile.name}>{profile.name}</h2>
          {profile.rating ? <p><Star size={14} fill="currentColor" className="vendor-profile-star" aria-hidden="true" /><span><strong>{profile.rating}</strong> ({profile.reviews.length} reviews)</span></p> : <p>No reviews</p>}
        </div>
        <button type="button" className="vendor-profile-close" aria-label="Close company profile" onClick={onClose}><X size={20} /></button>
      </header>
      <div className="vendor-profile-scroll" ref={bodyRef}>
        <div role="tablist" aria-label="Vendor profile tabs" className="vendor-profile-tabs" onKeyDown={handleTabKeys}>
          {TABS.map((tab, index) => <button key={tab} ref={element => { tabRefs.current[index] = element; }} id={`vendor-tab-${tab}`} type="button" role="tab" aria-selected={activeTab === tab} aria-controls="vendor-profile-panel" tabIndex={activeTab === tab ? 0 : -1} onClick={() => selectTab(tab)}>{tab}</button>)}
        </div>
        <div id="vendor-profile-panel" role="tabpanel" aria-labelledby={`vendor-tab-${activeTab}`} tabIndex={0} className="vendor-profile-panel">
          {activeTab === 'Company' && <>
            {!profile.fields.length && <p className="vendor-profile-empty">No company information available</p>}
            <dl className="vendor-profile-fields">{profile.fields.map(([label, value]) => <div key={label} className={label === 'Address' ? 'vendor-profile-address' : undefined}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
            {profile.ports.length > 0 && <div className="vendor-profile-section"><h3><PortServiceIcon name="anchor" />Operating Ports</h3><div className="vendor-profile-chips">{profile.ports.map(port => <span key={port}>{port}</span>)}</div></div>}
            {profile.services.length > 0 && <div className="vendor-profile-section"><h3><PortServiceIcon name="settings" />Services Offered</h3><div className="vendor-profile-chips">{profile.services.map(service => <span key={service}>{service}</span>)}</div></div>}
          </>}
          {activeTab === 'Certificates' && (profile.certificates.length ? <div className="vendor-profile-documents">{profile.certificates.map(certificate => <article key={certificate.name} className="vendor-profile-certificate"><span className="vendor-profile-file-icon"><FileText size={20} aria-hidden="true" /></span><div><h4>{certificate.name}</h4><p>Valid until: {certificate.validUntil}<span className="vendor-profile-pdf">PDF</span></p></div></article>)}</div> : <p className="vendor-profile-empty">No certificates available</p>)}
          {activeTab === 'Insurance' && (profile.insurance.length ? <div className="vendor-profile-documents">{profile.insurance.map(insurance => <article key={insurance.name}><h4>{insurance.name}</h4><div className="vendor-insurance-metadata"><p>Provider: {insurance.provider}</p><p>Coverage: {insurance.coverage}</p><p>Expires: {insurance.expires}</p></div></article>)}</div> : <p className="vendor-profile-empty">No insurance information available</p>)}
          {activeTab === 'Team' && (profile.team.length ? <div className="vendor-profile-team">{profile.team.map(person => <article key={person.name}><Avatar name={person.name} image={person.image} initials={person.initials} /><div><h4>{person.name}</h4><p>{person.title}</p></div></article>)}</div> : <div className="vendor-profile-team-empty"><Users size={48} aria-hidden="true" /><h3>No team members</h3><p>This business hasn't added any team members yet.</p></div>)}
          {activeTab === 'Gallery' && (profile.gallery.length ? <div className="vendor-profile-gallery">{profile.gallery.map(src => <img key={src} src={src} alt="Gallery" />)}</div> : <p className="vendor-profile-empty">No gallery images available</p>)}
          {activeTab === 'Reviews' && (profile.reviews.length ? <div className="vendor-profile-reviews">{profile.reviews.map((review, index) => <article key={`${review.name}-${index}`}><Avatar name={review.name} image={review.avatar} initials={review.initials} /><div className="vendor-profile-review-content"><h4>{review.name}</h4><span className="vendor-profile-review-rating">{Array.from({length:5}, (_, star) => <Star key={star} size={18} fill="currentColor" className={star < Math.round(Number(review.rating)) ? "is-filled" : ""} aria-hidden="true" />)}{review.rating}</span></div><time>{review.date}</time></article>)}</div> : <p className="vendor-profile-empty">No reviews available</p>)}
        </div>
      </div>
    </section>
  </div>, document.body);
}
