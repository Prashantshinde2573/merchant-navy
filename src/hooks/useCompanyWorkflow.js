import { useSyncExternalStore } from 'react';
import { transitionApplications } from '../utils/companyWorkflow';
const KEY='merchant_navy_applications';
const listeners=new Set();
let snapshot;
function read(){if(!snapshot){try{const value=JSON.parse(localStorage.getItem(KEY)||'[]');snapshot=Array.isArray(value)?value:[];}catch{snapshot=[];}}return snapshot;}
function emit(){for(const listener of listeners)listener();}
function subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener);}
if(typeof window!=='undefined')window.addEventListener('storage',event=>{if(event.key===KEY||event.key===null){snapshot=undefined;read();emit();}});
export function useCompanyWorkflow(actor){
  const applications=useSyncExternalStore(subscribe,read,()=>[]);
  const dispatch=(action,payload)=>{const previous=read(),next=transitionApplications(previous,action,actor,payload);if(next===previous)return;localStorage.setItem(KEY,JSON.stringify(next));snapshot=next;emit();};
  const markRead=(ids)=>{const next=read().map(app=>({...app,events:(app.events||[]).map(event=>event.recipient===actor&&(!ids||ids.includes(event.id))?{...event,read:true}:event)}));localStorage.setItem(KEY,JSON.stringify(next));snapshot=next;emit();};
  return {applications,dispatch,markRead};
}
