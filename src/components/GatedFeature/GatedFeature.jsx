import React,{useEffect,useRef,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useEntitlement} from '../../context/EntitlementContext';
import './GatedFeature.css';
const dismissed=new Set();
export function GatedFeature({featureKey,children,showAvailability=false}){
 const entitlement=useEntitlement(featureKey),[open,setOpen]=useState(false),root=useRef(null),navigate=useNavigate();
 useEffect(()=>{if(entitlement.unlocked)setOpen(false);},[entitlement.unlocked]);
 const show=()=>{if(!entitlement.unlocked&&(showAvailability||!dismissed.has(featureKey))){setOpen(true);entitlement.track('impression',featureKey);}};
 useEffect(()=>{if(!open)return;const close=event=>{if(event.key==='Escape'||(event.type==='pointerdown'&&!root.current?.contains(event.target)))setOpen(false);};document.addEventListener('pointerdown',close);document.addEventListener('keydown',close);return()=>{document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',close);};},[open]);
 return <span className="gated-feature" ref={root} onMouseEnter={show} onFocus={show} onMouseLeave={()=>{if(showAvailability)setOpen(false);}} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))setOpen(false);}} onClickCapture={event=>{if(event.target.closest('.feature-gate-popover'))return;if(entitlement.unlocked&&showAvailability)setOpen(false);if(!entitlement.unlocked){event.preventDefault();event.stopPropagation();show();}}}>
  {children}
  {(!entitlement.unlocked||entitlement.trial)&&<button type="button" className={`feature-tier-badge ${entitlement.trial?'is-trial':''}`} aria-label={entitlement.trial?'Trial: 3 days left':`${entitlement.requiredTier} feature`} onClick={show}><span className="material-symbols-outlined" aria-hidden="true">{entitlement.trial?'schedule':'lock'}</span></button>}
  {entitlement.trial&&<small className="feature-trial-text">3 days left</small>}
  {open&&!entitlement.unlocked&&<span className="feature-gate-popover" role="dialog" aria-label={`${entitlement.requiredTier} feature`} onClick={event=>event.stopPropagation()}>
   <small>{entitlement.requiredTier} feature</small><strong>Included in {entitlement.requiredTier} and above</strong><span>{entitlement.benefit}</span>
   {!entitlement.unlocked&&<button type="button" disabled={entitlement.upgrading} onClick={()=>{entitlement.track('upgrade-click',featureKey);navigate(`/plans?feature=${featureKey}`);setOpen(false);}}>Upgrade to {entitlement.requiredTier}</button>}
   <button type="button" className="gate-dismiss" onClick={()=>{dismissed.add(featureKey);setOpen(false);}}>Not now</button>
  </span>}
 </span>;
}
