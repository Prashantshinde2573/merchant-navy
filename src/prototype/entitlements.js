export const TIERS=['Silver','Gold','Platinum','Premium'];
export const DEMO_ENTITLEMENTS={voice:{tier:'Gold',benefit:'Describe a request naturally and review the populated form.'},attachments:{tier:'Gold',benefit:'Include more supporting files with each request.'},posts:{tier:'Gold',benefit:'Create more requests each month.'},ports:{tier:'Platinum',benefit:'Reach merchants at multiple ports.'},translation:{tier:'Gold',benefit:'Read requirements in your preferred language.'}};
export function demoEntitlement(tier,key,{trial=false,override=false}={}) {
 const feature=DEMO_ENTITLEMENTS[key];
 if(!feature)return {unlocked:false,requiredTier:null,benefit:''};
 return {requiredTier:feature.tier,benefit:feature.benefit,unlocked:override||trial||TIERS.indexOf(tier)>=TIERS.indexOf(feature.tier)};
}
