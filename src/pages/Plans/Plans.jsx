import React,{useEffect,useRef,useState} from 'react';
import {Link,useSearchParams} from 'react-router-dom';
import {TIERS,DEMO_ENTITLEMENTS,useEntitlement} from '../../context/EntitlementContext';
import './Plans.css';

const FEATURE_LABELS={voice:'Voice assistant',attachments:'Attachments',posts:'Requirement posts',ports:'Multiple ports',translation:'Post translation'};
const DESCRIPTIONS=['Essential tools for your maritime business.','More ways to connect and share requirements.','Expand your reach across multiple ports.','The full set of tools for your business.'];
export function Plans(){
 const [params]=useSearchParams(),selected=params.get('feature'),plan=useEntitlement(selected||'voice'),timer=useRef(null);
 const [pendingTier,setPendingTier]=useState(null);
 useEffect(()=>()=>{clearTimeout(timer.current);plan.setUpgrading(false);},[]);
 const choose=tier=>{
  setPendingTier(tier);plan.setUpgrading(true);
  timer.current=setTimeout(()=>{plan.setTier(tier);plan.setTrial(false);plan.setUpgrading(false);setPendingTier(null);plan.track('plan-changed',selected||'all');},650);
 };
 return <div className="plans-page">
  <header className="plans-page-heading">
   <div><h1>Membership plans</h1><p>Choose the tools and reach that fit your business.</p></div>
   <Link className="plans-back-link" to="/home"><span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>Back to feed</Link>
  </header>
  <div className="plans-current-summary"><span className="material-symbols-outlined" aria-hidden="true">workspace_premium</span><p>Your current plan <strong>{plan.tier}</strong></p><span className="plans-update-status" role="status" aria-live="polite">{plan.upgrading?'Updating your plan…':''}</span></div>
  <div className="plans-grid">{TIERS.map((tier,index)=>{
   const current=plan.tier===tier;
   return <section className={`plans-card ${current?'is-current':''}`} key={tier} aria-labelledby={`plan-${tier}`}>
    <div className="plans-card-topline"><span className="plans-tier-icon" aria-hidden="true"><span className="material-symbols-outlined">{['sailing','workspace_premium','verified','diamond'][index]}</span></span>{current&&<span className="plans-current-badge">Current plan</span>}</div>
    <h2 id={`plan-${tier}`}>{tier}</h2><p className="plans-card-description">{DESCRIPTIONS[index]}</p>
    <ul className="plans-feature-list">{Object.entries(DEMO_ENTITLEMENTS).map(([key,value])=>{
     const included=TIERS.indexOf(tier)>=TIERS.indexOf(value.tier);
     return <li key={key} className={`${included?'is-included':'is-unavailable'} ${selected===key?'is-requested':''}`}>
      <span className="material-symbols-outlined" aria-hidden="true">{included?'check_circle':'remove_circle_outline'}</span><span><span className="sr-only">{included?'Included: ':'Not included: '}</span>{FEATURE_LABELS[key]}</span>{selected===key&&<span className="plans-feature-marker" aria-label="Requested feature"/>}
     </li>;
    })}</ul>
    <button type="button" className={`plans-select ${current?'is-current':''}`} disabled={plan.upgrading||current} onClick={()=>choose(tier)}>{pendingTier===tier?'Updating…':current?'Current plan':`Choose ${tier}`}</button>
   </section>;
  })}</div>
  <p className="plans-billing-note"><span className="material-symbols-outlined" aria-hidden="true">info</span>Pricing and billing details will be confirmed separately.</p>
 </div>;
}
