import React,{useEffect,useRef} from 'react';
import {Link,useSearchParams} from 'react-router-dom';
import {TIERS,DEMO_ENTITLEMENTS,useEntitlement} from '../../context/EntitlementContext';
import '../Prototype/Prototype.css';
export function Plans(){
 const [params]=useSearchParams(),selected=params.get('feature'),plan=useEntitlement(selected||'voice'),timer=useRef(null);
 useEffect(()=>()=>{clearTimeout(timer.current);plan.setUpgrading(false);},[]);
 return <div className="prototype-page"><div className="prototype-page-title"><div><h1>Find your next level</h1><p>Choose the tools and reach that fit your business.</p></div><Link to="/home">Back to feed</Link></div>
  {plan.upgrading&&<p role="status" className="prototype-notice">Updating your plan…</p>}
  <div className="prototype-plan-grid">{TIERS.map((tier,index)=><section className={`prototype-panel ${plan.tier===tier?'is-selected':''}`} key={tier}>
   <small>{plan.tier===tier?'CURRENT PLAN':'MEMBERSHIP'}</small><h2>{tier}</h2><p>{['Essential merchant tools','More room to connect','Broader port coverage','Complete merchant tools'][index]}</p>
   <ul>{Object.entries(DEMO_ENTITLEMENTS).map(([key,value])=><li key={key} className={selected===key?'highlight-feature':''}>{TIERS.indexOf(tier)>=TIERS.indexOf(value.tier)?'✓':'○'} {key==='voice'?'Voice assistant':key[0].toUpperCase()+key.slice(1)}{selected===key?' · highlighted':''}</li>)}</ul>
   <button className="prototype-primary" disabled={plan.upgrading||plan.tier===tier} onClick={()=>{plan.setUpgrading(true);timer.current=setTimeout(()=>{plan.setTier(tier);plan.setTrial(false);plan.setUpgrading(false);plan.track('plan-changed',selected||'all');},650);}}>{plan.upgrading?'Updating…':plan.tier===tier?'Selected':`Choose ${tier}`}</button>
  </section>)}</div>
  <p className="prototype-notice">Pricing and billing details will be confirmed separately.</p>
 </div>;
}
