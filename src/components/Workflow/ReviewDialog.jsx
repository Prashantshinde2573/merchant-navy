import React,{useState} from 'react';
import {Star} from 'lucide-react';
import {WorkflowDialog} from './WorkflowDialog';
export function ReviewDialog({application,onSubmit,onClose}) {
 const [scores,setScores]=useState({quality:0,communication:0,timeliness:0}),[feedback,setFeedback]=useState(''),[error,setError]=useState('');
 const labels={quality:'Service Quality',communication:'Communication',timeliness:'Timeliness'};
 return <WorkflowDialog title="Rate Your Experience" onClose={onClose}>{Object.entries(labels).map(([key,label])=><fieldset key={key} className="mb-4"><legend className="text-sm text-zinc-500 mb-2">{label}</legend><div role="group" aria-label={label} className="flex gap-2">{[1,2,3,4,5].map(value=><button key={value} type="button" className="h-10 w-10 inline-flex items-center justify-center" aria-label={`${label}: ${value} stars`} aria-pressed={scores[key]===value} onClick={()=>setScores(previous=>({...previous,[key]:value}))}><Star size={20} className={value<=scores[key]?'fill-amber-400 text-amber-400':'text-zinc-300'}/></button>)}</div></fieldset>)}<label>Feedback (Optional)<textarea aria-label="Feedback" maxLength={600} value={feedback} onChange={event=>setFeedback(event.target.value)}/></label>{error && <p role="alert">{error}</p>}<footer><button onClick={onClose}>Cancel</button><button className="primary" disabled={Object.values(scores).some(value=>!value)} onClick={()=>{try{onSubmit({...scores,feedback,id:application.id});onClose();}catch(error){setError(error.message);}}}>Submit Rating</button></footer></WorkflowDialog>;
}
