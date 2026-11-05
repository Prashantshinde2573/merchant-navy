import React from 'react';
import {demoCompany,compactMoneyText,quotePrice,workflowDate} from '../../utils/companyWorkflow';
export function ChatWorkflowMessage({message,currentUser}) {
 const sender=demoCompany(message.senderId);
 const longBody=(message.body||'').length>130;
 return <article className="chat-workflow-message"><img src={sender.avatar} alt=""/><div className="chat-workflow-message-content"><div className="chat-workflow-message-heading"><span>{message.senderId===currentUser?'You':sender.name}</span><time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'})}</time></div>
 {message.type==='quote'&&message.quote?<section className="chat-quote-message" aria-label="Quotation">
   <div className="chat-quote-message-top">
    <span className="chat-quote-message-label"><span className="material-symbols-outlined" aria-hidden="true">request_quote</span>Quotation</span>
    <strong className="chat-quote-message-amount">{message.quote.currency} {quotePrice(message.quote).replace(/^[^\d]+/,'').replace(/\.00$/,'')}</strong>
    <span className="chat-quote-message-validity"><span className="material-symbols-outlined" aria-hidden="true">event</span>Valid until {workflowDate(message.quote.validUntil)}</span>
   </div>
   {message.quote.details&&<p className="chat-quote-message-details">{message.quote.details}</p>}
  </section>
 :message.type==='quote_requested'?<div className="chat-quote-request-message">
   <span className="chat-quote-request-label"><span className="material-symbols-outlined" aria-hidden="true">request_quote</span>Quotation requested</span>
   {longBody?<details><summary><span className="chat-quote-request-preview">{message.body.slice(0,130)}…</span><span className="chat-quote-request-toggle" data-more="Show more" data-less="Show less"/></summary><p>{message.body}</p></details>:<p>{message.body}</p>}
  </div>
 :<p>{compactMoneyText(message.body)}</p>}
 </div></article>;
}
