import React from 'react';
import {demoCompany,compactMoneyText,quotePrice,workflowDate} from '../../utils/companyWorkflow';
export function ChatWorkflowMessage({message,currentUser}) {
 const sender=demoCompany(message.senderId);
 return <article className="chat-workflow-message"><img src={sender.avatar} alt=""/><div className="chat-workflow-message-content"><div className="chat-workflow-message-heading"><span>{message.senderId===currentUser?'You':sender.name}</span><time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'})}</time></div>
 {message.type==='quote'&&message.quote?<><div className="chat-quote-message"><span>Quote Request</span><strong>{message.quote.currency} {quotePrice(message.quote).replace(/^[^\d]+/,'').replace(/\.00$/,'')}</strong><span>Valid until: {workflowDate(message.quote.validUntil)}</span></div>{message.quote.details&&<p>{message.quote.details}</p>}</>:message.type==='quote_requested'?<details className="chat-quote-request-message"><summary>{message.body.slice(0,130)}{message.body.length>130?'…':''}</summary><p>{message.body}</p></details>:<p>{compactMoneyText(message.body)}</p>}
 </div></article>;
}
