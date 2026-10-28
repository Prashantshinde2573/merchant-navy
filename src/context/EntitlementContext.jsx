import React,{createContext,useContext,useState} from 'react';
// Illustrative preview matrix. The client's commercial tier matrix is still TBD.
import {TIERS,DEMO_ENTITLEMENTS,demoEntitlement} from '../prototype/entitlements';
export {TIERS,DEMO_ENTITLEMENTS};
const Context=createContext(null);
export function EntitlementProvider({children}){
 const [tier,setTier]=useState('Premium'),[trial,setTrial]=useState(false),[override,setOverride]=useState(false),[upgrading,setUpgrading]=useState(false);
 const [events,setEvents]=useState([]);
 const track=(type,feature)=>setEvents(values=>[...values.slice(-49),{type,feature,time:new Date().toISOString()}]);
 return <Context.Provider value={{tier,setTier,trial,setTrial,override,setOverride,upgrading,setUpgrading,events,track}}>{children}</Context.Provider>;
}
export function useEntitlement(featureKey){
 const context=useContext(Context);
 return {...context,...demoEntitlement(context.tier,featureKey,context)};
}
