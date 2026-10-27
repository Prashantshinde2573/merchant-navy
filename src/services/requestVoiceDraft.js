import {extractRequirement,extractBudget,parseAnswer} from './requirementAI.js';
import {requirementCurrencyHint,normalizeRequirementNumbers} from './requirementLanguages.js';
import {translateRequirementText} from './requirementTranslation.js';

const UNCLEAR=/^(?:i (?:don['’]?t know|am not sure)|not sure|unsure|maybe|maybe later|unknown|skip|later|yes|no|ok|okay|don['’]?t know)[.!?]*$/i;
const CLEAR_OPEN=/\b(?:skip|no fixed budget|no budget|open (?:to|for) (?:quotes|quotations)|flexible|no deadline)\b/i;
function targetedAnswer(field,text,data,identified) {
  if(!field || identified.includes(field) || UNCLEAR.test(text.trim()))return data;
  if(field==='budget'){
    const budget=extractBudget(text,data.currency,false);
    if(budget && Number(budget.minBudget)<=Number(budget.maxBudget))return {...data,...budget};
  }
  if((field==='services'||field==='ports') && identified.filter(value=>value!=='scopeOfWork').length===0 && text.length<160 && /[a-z]{2}/i.test(text) && !/\b(?:budget|deadline|tomorrow|tonnes?|tons?|\d+\s*MT)\b/i.test(text)) {
    return parseAnswer(field,text,data);
  }
  if(CLEAR_OPEN.test(text) && field==='budget')return {...data,minBudget:'',maxBudget:''};
  if(CLEAR_OPEN.test(text) && field==='timeline')return {...data,isAsap:false,serviceDates:''};
  return data;
}
/** Replay answers in order so later corrections replace only the fields they update. */
export async function buildRequestVoiceDraft(transcript,language,initialData,{signal,translate=translateRequirementText,turns}={}) {
  if(!transcript.trim())return {...initialData};
  let draft={...initialData};
  const scope=[initialData.scopeOfWork?.trim()].filter(Boolean);
  const answered=new Set(initialData.aiAnswered||[]);
  const answers=turns?.length ? turns : transcript.split(/\n+/).filter(value=>value.trim()).map(text=>({text,field:null}));
  for(const turn of answers){
    if(signal?.aborted)throw new DOMException('Aborted','AbortError');
    const raw=turn.text.trim();if(!raw)continue;
    const normalized=normalizeRequirementNumbers(raw,language);
    const english=language==='en'?normalized:await translate(normalized,language,'en',{signal});
    if(signal?.aborted)throw new DOMException('Aborted','AbortError');
    // Free voice responses may include explicit corrections in the same recording.
    const clauses=english.split(/\b(?:actually|correction|instead use|change (?:it|that) to)\b|(?<=[.!?])\s+(?=[a-z])/i).filter(value=>value.trim());
    const seenSelections=new Set();
    const correction=/\b(?:actually|correction|instead|change (?:it|that) to)\b/i.test(english);
    for(const [clauseIndex,clause] of clauses.entries()){
      const before=draft;
      const extracted=extractRequirement(clause,before);
      extracted.identified.filter(id=>id!=='scopeOfWork').forEach(id=>answered.add(id));
      draft={...extracted.data,scopeOfWork:before.scopeOfWork};
      if(!extracted.identified.includes('budget')){draft.minBudget=before.minBudget;draft.maxBudget=before.maxBudget;draft.currency=before.currency;}
      for(const [field,pattern] of [
        ['services',/\bservices?(?: required)?\s*(?:is|are|:)\s*([^.;\n]+?)(?=\s+(?:at|in|budget|deadline)\b|[.;\n]|$)/i],
        ['ports',/\b(?:port|location|anchorage)\s*(?:is|:)\s*([^.;\n]+?)(?=\s+(?:and )?(?:budget|service|deadline)\b|[.;\n]|$)/i]
      ]){
        const custom=pattern.exec(clause)?.[1]?.replace(/[, ]+$/,'').trim();
        if(!extracted.identified.includes(field)&&custom&&!UNCLEAR.test(custom)&&/[a-z]{2}/i.test(custom))draft=parseAnswer(field,custom,draft);
      }
      if(clauseIndex===0)draft=targetedAnswer(turn.field,clause,draft,extracted.identified);
      for(const [id,key]of[['services','selectedServices'],['ports','selectedPorts']]){
        if(extracted.identified.includes(id)){
          if((seenSelections.has(id)&&!correction)||/\b(?:also|add|in addition)\b/i.test(clause))draft[key]=[...new Set([...(before[key]||[]),...(draft[key]||[])])];
          seenSelections.add(id);
        }
      }
    }
    const currency=requirementCurrencyHint(raw);
    if(currency && (draft.minBudget!==initialData.minBudget || draft.maxBudget!==initialData.maxBudget))draft.currency=currency;
    if(turn.field && /^(?:skip|open to quotations|no deadline|dates are flexible)$/i.test(english.trim()))answered.add(turn.field);
    if((!turn.field||turn.field==='scopeOfWork')&&!UNCLEAR.test(english.trim()))scope.push(raw);
  }
  draft.scopeOfWork=[...new Set(scope)].join('\n\n');
  draft.aiAssisted=Boolean(initialData.aiAssisted)||['scopeOfWork','selectedServices','selectedPorts','currency','minBudget','maxBudget','isAsap','serviceDates'].some(key=>JSON.stringify(draft[key])!==JSON.stringify(initialData[key]));
  draft.aiAnswered=[...answered];
  return draft;
}
