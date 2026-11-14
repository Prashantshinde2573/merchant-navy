import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Anchor, ArrowLeft, ChevronDown, MessageCircle, Settings } from 'lucide-react';
import { DEMO_OTP, useAuth } from '../../context/AuthContext';
import { PORT_GROUPS, SERVICE_GROUPS } from '../../data/selectionOptions';
import { TreeSelectionModal } from '../../components/TreeSelectionModal/TreeSelectionModal';
import { WorkflowDialog } from '../../components/Workflow/WorkflowDialog';
import { readRegistration, saveRegistration } from '../../utils/demoRegistration';
import './Signup.css';

export const signupSteps = [
  { path: '/business-info', label: 'Business Info & Phone', hint: 'Enter business name and verify phone', title: 'Business Information', description: "Enter your business name and phone number to get started. We'll send you an OTP for verification." },
  { path: '/business-details', label: 'Business Details', hint: 'Add business registration details', title: 'Business Details', description: 'Provide additional information about your business and contact person.' },
  { path: '/ports-and-services', label: 'Ports & Services', hint: 'Select ports and services', title: 'Ports & Services', description: 'Select at least one port and one service that your business operates in.' },
  { path: '/certificates-and-consent', label: 'Certificates & Consent', hint: 'Review certificates and consent', title: 'Certificates & Consent', description: 'Select any certificates your business holds and agree to our terms.' },
];

const countries = PORT_GROUPS.map(group => group.name).sort();
const certificates = [
  'Company Registration Document',
  'Insurance Certificate',
  'Safety / Compliance Certificates',
  'Tax / VAT Registration',
  'Service-Specific Certifications',
];
const phoneCodes = [['+91', 'IN'], ['+1', 'US/CA'], ['+44', 'UK'], ['+971', 'AE'], ['+65', 'SG']];
const pickers = {
  ports: { title: 'Select Ports', subtitle: 'Where can you deploy your services?', searchPlaceholder: 'Search by country, region, port name, UN/LOCODE, or keywords...', groups: PORT_GROUPS },
  services: { title: 'Select Services', subtitle: 'What expertise do you provide?', searchPlaceholder: 'Search categories or services...', groups: SERVICE_GROUPS },
};

function PhoneVerification({ phone, code, onVerify, onClose }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [resent, setResent] = useState(false);

  function verify(event) {
    event.preventDefault();
    if (otp !== DEMO_OTP) {
      setError('Invalid verification code. Please check the code and try again.');
      return;
    }
    onVerify();
  }

  return (
    <WorkflowDialog title="Verify Your Phone" onClose={onClose} className="signup-otp-dialog">
      <form onSubmit={verify}>
        <p>We've sent a 6-digit verification code to your phone number. Enter it below to verify {code}-{phone.slice(0, 2)}****{phone.slice(-2)}</p>
        <div className="signup-otp-code">
          {[0, 1, 2, 3, 4, 5].map(index => <span key={index} aria-hidden="true">{otp[index]}</span>)}
          <input aria-label="Phone verification code" autoComplete="one-time-code" inputMode="numeric" value={otp} onChange={event => { setOtp(event.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }} />
        </div>
        <button type="button" className="signup-resend" onClick={() => { setOtp(''); setError(''); setResent(true); }}>Didn't get the code? Resend</button>
        {resent && <p role="status">A new verification code has been sent.</p>}
        {error && <p role="alert" className="signup-error">{error}</p>}
        <footer><button type="submit" className="primary" disabled={otp.length !== 6}>Continue</button></footer>
      </form>
    </WorkflowDialog>
  );
}

export function Signup({ step }) {
  const navigate = useNavigate();
  const { completeRegistration } = useAuth();
  const [draft, setDraft] = useState(readRegistration);
  const [picker, setPicker] = useState(null);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [error, setError] = useState('');
  if (!draft?.email) return <Navigate to="/login" replace />;

  const { path, title, description } = signupSteps[step];
  const furthestStep = !draft.phoneVerified ? 0
    : !draft.country || !draft.contactName || !draft.jobTitle ? 1
    : !draft.ports?.length || !draft.services?.length ? 2 : 3;
  if (step > furthestStep) return <Navigate to={signupSteps[furthestStep].path} replace />;

  const code = draft.phoneCode || '+91';
  const update = changes => {
    const next = { ...draft, ...changes };
    saveRegistration(next);
    setDraft(next);
    setError('');
  };
  const advance = () => navigate(signupSteps[step + 1].path);
  function submit(event) {
    event.preventDefault();
    if (step === 0) {
      if (!draft.name?.trim() || !/^\d{7,15}$/.test(draft.phone || '')) {
        setError('Enter a business name and a valid phone number.');
      } else if (draft.phoneVerified) advance();
      else setVerifyingPhone(true);
    } else if (step === 1) {
      if (!countries.includes(draft.country) || !draft.contactName?.trim() || !draft.jobTitle?.trim()) {
        setError('Select a registration country and enter the contact name and job title.');
      } else advance();
    } else if (step === 2) {
      if (!draft.ports?.length || !draft.services?.length) setError('Select at least one port and one service.');
      else advance();
    } else {
      try {
        completeRegistration();
        navigate('/home', { replace: true });
      } catch (failure) {
        setError(failure.message);
      }
    }
  }

  const progress = (
    <ol>{signupSteps.map(({ label, hint }, index) => (
      <li key={label} aria-current={index === step ? 'step' : undefined} data-completed={index < step}>
        <span aria-hidden="true">{index + 1}</span><div><strong>{label}</strong><p>{hint}</p></div>
      </li>
    ))}</ol>
  );

  return (
    <main className="signup-page" key={path}>
      <aside className="signup-sidebar">
        <picture>
          <source media="(max-width: 1023px)" srcSet="/images/signup-logo-white.webp" />
          <img src="/images/logo.png" alt="Merchant Navy" />
        </picture>
        <nav className="signup-steps" aria-label="Registration progress">
          {progress}
        </nav>
        <p>Need help? <a href="mailto:support@merchant.navy">Contact Support</a></p>
      </aside>
      <section className="signup-content">
        <header>
          <p className="signup-progress">Step {step + 1} of {signupSteps.length}</p>
          <h1 className="page-title">{title}</h1>
          <p>{description}</p>
        </header>
        <form onSubmit={submit}>
          {step === 0 && (
            <div className="ui-card signup-card">
              <label>Name*<input placeholder="Enter business name" value={draft.name || ''} onChange={event => update({ name: event.target.value })} required /></label>
              <label htmlFor="signup-phone">Phone Number*</label>
              <div className="signup-phone">
                <select aria-label="Country Code" value={code} onChange={event => update({ phoneCode: event.target.value, phoneVerified: false })}>
                  {phoneCodes.map(([value, country]) => <option key={value} value={value}>{value} ({country})</option>)}
                </select>
                <input id="signup-phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="234567890" value={draft.phone || ''} onChange={event => update({ phone: event.target.value.replace(/\D/g, '').slice(0, 15), phoneVerified: false })} required />
              </div>
              <label className="signup-whatsapp">
                <MessageCircle size={20} aria-hidden="true" />
                <span>Is this number on WhatsApp?</span>
                <input type="checkbox" role="switch" checked={draft.whatsapp ?? true} onChange={event => update({ whatsapp: event.target.checked })} />
              </label>
            </div>
          )}
          {step === 1 && (
            <div className="ui-card signup-card">
              <label>Registration Country*<input list="signup-countries" value={draft.country || ''} onChange={event => update({ country: event.target.value })} required /></label>
              <datalist id="signup-countries">{countries.map(country => <option key={country} value={country} />)}</datalist>
              <label>Website (Optional)<span className="signup-website"><span aria-hidden="true">https<span className="signup-mobile-url-suffix">://</span></span><input placeholder="Enter Website URL" maxLength={255} value={draft.website || ''} onChange={event => update({ website: event.target.value })} /></span><small>255 characters max</small></label>
              <label>Contact Person Name*<input placeholder="Enter contact person name" maxLength={150} value={draft.contactName || ''} onChange={event => update({ contactName: event.target.value })} required /><small>150 characters max</small></label>
              <label>Job Title*<input placeholder="Enter job title" maxLength={100} value={draft.jobTitle || ''} onChange={event => update({ jobTitle: event.target.value })} required /><small>100 characters max</small></label>
            </div>
          )}
          {step === 2 && (
            <div className="signup-picker-cards">
              {Object.entries(pickers).map(([key, options]) => (
                <section className="ui-card signup-card" key={key}>
                  <h2>{key === 'ports' ? <Anchor size={20} /> : <Settings size={20} />}{key === 'ports' ? 'Operational Ports' : 'Offered Services'}</h2>
                  <p>{options.subtitle}</p>
                  <button type="button" className="signup-picker-button" onClick={() => setPicker(key)}>
                    <span>{draft[key]?.length ? draft[key].join(', ') : options.title}</span><ChevronDown size={18} />
                  </button>
                </section>
              ))}
            </div>
          )}
          {step === 3 && (
            <div className="ui-card signup-card signup-consent">
              <h2>Certificates (Optional)</h2>
              {certificates.map(certificate => (
                <label key={certificate}>
                  <input type="checkbox" checked={draft.certificates?.includes(certificate) ?? false}
                    onChange={event => update({ certificates: event.target.checked
                      ? [...(draft.certificates || []), certificate]
                      : draft.certificates.filter(item => item !== certificate) })} />
                  {certificate}
                </label>
              ))}
              <label className="signup-terms">
                <input type="checkbox" checked={draft.consent ?? false} required onChange={event => update({ consent: event.target.checked })} />
                <span>I agree to the <a href="https://www.merchant.navy/terms" target="_blank" rel="noreferrer">Terms &amp; Condition</a> and <a href="https://www.merchant.navy/privacy" target="_blank" rel="noreferrer">Privacy Policy</a></span>
              </label>
            </div>
          )}
          {error && <p role="alert" className="signup-error">{error}</p>}
          <footer className="signup-actions">
            <Link to={step ? signupSteps[step - 1].path : '/login'} onClick={() => setError('')}><ArrowLeft size={16} aria-hidden="true" />{step ? 'Back' : 'Back to Login'}</Link>
            <button type="submit" className="ui-button">{step === 0 && !draft.phoneVerified ? 'Verify & Continue' : 'Continue'}</button>
          </footer>
        </form>
        {verifyingPhone && (
          <PhoneVerification phone={draft.phone} code={code} onClose={() => setVerifyingPhone(false)} onVerify={() => {
            update({ phoneVerified: true });
            setVerifyingPhone(false);
            advance();
          }} />
        )}
        {picker && (
          <TreeSelectionModal isOpen {...pickers[picker]} selected={draft[picker] || []}
            onApply={selection => update({ [picker]: selection })} onClose={() => setPicker(null)} />
        )}
      </section>
    </main>
  );
}
