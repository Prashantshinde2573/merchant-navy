import React,{useState} from 'react';
import {Star} from 'lucide-react';
import {WorkflowDialog} from './WorkflowDialog';
import {usePosts} from '../../context/PostContext';
import {demoCompany,workflowDate} from '../../utils/companyWorkflow';
import './ReviewDialog.css';
export function ReviewDialog({application,onSubmit,onClose}) {
 const {getPost}=usePosts();
 const [scores,setScores]=useState({quality:0,communication:0,timeliness:0}),[feedback,setFeedback]=useState(''),[error,setError]=useState('');
 const company=demoCompany(application.applicantId),post=getPost(application.postId);
 const questions=[['quality','How was the service quality?','Rate the overall quality of work delivered'],['communication','How was the communication?','Rate responsiveness and clarity of communication'],['timeliness','How timely was the delivery?','Rate if the vendor met agreed timelines']];
 return <WorkflowDialog mobileSheet className="review-workflow-dialog" title="Rate Your Experience" onClose={onClose}>
  <div className="review-job-summary"><img src={company.avatar} alt={company.name}/><div><strong>{company.name}</strong><p>{post.title||post.scopeOfWork}</p><p>Completed: {workflowDate(application.completedAt)}</p></div></div>
  {questions.map(([key,label,description])=><fieldset key={key}><legend>{label}</legend><p className="review-help">{description}</p><div role="group" aria-label={label} className="review-stars">{[1,2,3,4,5].map(value=><button key={value} type="button" aria-label={`${label}: ${value} stars`} aria-pressed={scores[key]===value} onClick={()=>setScores(previous=>({...previous,[key]:value}))}><Star size={24} fill={value<=scores[key]?'#f5a623':'none'} color={value<=scores[key]?'#f5a623':'#d4d4d8'}/></button>)}</div></fieldset>)}
  <label><span className="review-feedback-label"><span>Feedback <span className="review-help">(Optional)</span></span><span className="review-help">{feedback.length}/600</span></span><textarea aria-label="Feedback" placeholder="Add a quick message or question..." maxLength={600} value={feedback} onChange={event=>setFeedback(event.target.value)}/></label>
  {error && <p role="alert">{error}</p>}
  <footer><button onClick={onClose}>Cancel</button><button className="primary" disabled={Object.values(scores).some(value=>!value)} onClick={()=>{try{onSubmit({...scores,feedback,id:application.id});onClose();}catch(error){setError(error.message);}}}>Submit Rating</button></footer>
 </WorkflowDialog>;
}
