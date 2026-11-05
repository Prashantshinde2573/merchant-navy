export const APPLICANT_EMAIL = 'shivhare.yuvraj@gmail.com';
export const COMPANY_EMAIL = 'ronakrawat3@gmail.com';
export const demoCompany = email => email === COMPANY_EMAIL
  ? { name: 'Indra Shipping Co.', avatar: '/images/indra_avatar.jpg', initials: 'IS' }
  : email === APPLICANT_EMAIL
    ? { name: 'Bluesea Marine Works Pvt Ltd.', avatar: '/images/profile_avatar.webp', initials: 'BM' }
    : { name: email?.split('@')[0] || 'Merchant', avatar: '/images/profile_avatar.webp', initials: 'M' };
export const ownerOfPost = post => post?.ownerId || (post?.vendorName === 'Indra Shipping Co.' ? COMPANY_EMAIL : post?.vendorName === 'Bluesea Marine Works Pvt Ltd.' || post?.id === 'my-post-1' ? APPLICANT_EMAIL : post?.vendorName ? `demo:${post.vendorName}` : null);
export const compactBudget = (min, max, currency = 'USD') => {
  const values = [min,max].filter(value => value !== '' && value != null);
  if (!values.length) return '';
  const format = value => Number(value) >= 1000 ? `${Number((Number(value)/1000).toFixed(1))}K` : String(Number(value));
  const symbol = {USD:'$',INR:'₹',EUR:'€',GBP:'£',AED:'AED '}[currency] || `${currency} `;
  return `${symbol}${values.map(format).join(' - ')}`;
};
export const quotePrice = quote => quote ? (Number(quote.amount)>=1000 ? compactBudget(quote.amount,null,quote.currency) : new Intl.NumberFormat('en-US',{style:'currency',currency:quote.currency}).format(quote.amount)) : '';
export const compactMoneyText = text => String(text||'').replace(/([₹$€£])\s*(\d[\d,]*(?:\.\d+)?)/g,(match,symbol,amount)=>Number(amount.replaceAll(',',''))>=1000?compactBudget(amount.replaceAll(',',''),null,{'₹':'INR','$':'USD','€':'EUR','£':'GBP'}[symbol]):match);
export const workflowDate = date => date ? new Date(date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}) : '';

// Pure transitions shared by the UI and tests. No network or browser APIs.
export function transitionApplications(records, action, actor, payload = {}, now = new Date().toISOString()) {
  const id = payload.id || `app-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const event = (recipient,type,title,message) => ({id:`event-${id}-${action}-${now}`,recipient,type,title,message,createdAt:now,read:false});
  if (action === 'apply') {
    const post=payload.post, ownerId=ownerOfPost(post);
    if (!post?.id || !ownerId) throw new Error('This demo requirement does not have an available owner.');
    if (ownerId === actor) throw new Error('You cannot apply to your own requirement.');
    if (['Draft','Closed','History','Awarded','Rate Now'].includes(post.status)) throw new Error('This requirement is no longer accepting applications.');
    if (!payload.message?.trim()) throw new Error('Please enter an application message.');
    if (records.some(app=>app.postId===post.id && app.applicantId===actor)) return records;
    return [{id,postId:post.id,ownerId,applicantId:actor,applicantName:demoCompany(actor).name,message:payload.message.trim(),fileName:payload.fileName||'',status:'applied',appliedAt:now,messages:[],events:[event(ownerId,'application','New Application',`${demoCompany(actor).name} applied to your service request.`)]},...records];
  }
  if(action==='invite' && !records.some(record=>record.id===id) && payload.reference && id===`reference-application-${payload.post?.id}` && ownerOfPost(payload.post)===actor) {
    const applicantId=actor===APPLICANT_EMAIL?COMPANY_EMAIL:APPLICANT_EMAIL;
    const seeded={id,postId:payload.post.id,ownerId:actor,applicantId,applicantName:demoCompany(applicantId).name,message:payload.reference.scopeSummary||'',status:'applied',appliedAt:now,messages:[],events:[]};
    return transitionApplications([...records,seeded],action,actor,{...payload,reference:undefined},now);
  }
  const app=records.find(record=>record.id===id);
  if (!app) throw new Error('Application not found.');
  const isOwner=app.ownerId===actor, isApplicant=app.applicantId===actor;
  if (!isOwner && !isApplicant) throw new Error('This application belongs to another company.');
  let changes={};
  const message=(body,type='text')=>({id:`message-${id}-${now}-${app.messages?.length||0}`,senderId:actor,body,type,createdAt:now});
  switch(action) {
    case 'invite':
      if(!isOwner) throw new Error('Only the request owner can invite an applicant.');
      if(app.threadId) return records;
      if(!['applied','Applied'].includes(app.status)) throw new Error('Only an application awaiting discussion can be invited.');
      if((payload.message||'').length>1500) throw new Error('Invitation message must be 1,500 characters or fewer.');
      if(payload.fileSize>20*1024*1024 || (payload.fileName && !(payload.fileType==='application/pdf'||payload.fileType?.startsWith('image/')))) throw new Error('Choose one PDF or image up to 20 MB.');
      changes={invitation:{messageHtml:payload.messageHtml||'',fileName:payload.fileName||'',fileType:payload.fileType||'',fileSize:payload.fileSize||0},status:'discussion',threadId:`thread-${id}`,discussionAt:now,messages:[...(app.messages||[]),message(`${payload.message?.trim()||'Thank you for your application. Let’s discuss this requirement.'}${payload.fileName?`\nAttachment: ${payload.fileName}`:''}`)],events:[...(app.events||[]),event(app.applicantId,'invites','Invited to Discussion',`${demoCompany(actor).name} invited you to discuss this request.`)]};break;
    case 'message':
      if(!app.threadId) throw new Error('Discussion starts after the owner sends an invitation.');
      if(!payload.message?.trim()) throw new Error('Please enter a message.');
      changes={messages:[...(app.messages||[]),message(payload.message.trim())]};break;
    case 'requestQuote':
      if(!isOwner) throw new Error('Only the request owner can request a quotation.');
      if(!['discussion','quotation_requested'].includes(app.status)) throw new Error('Start a discussion before requesting a quotation.');
      if(app.status==='quotation_requested') return records;
      changes={status:'quotation_requested',messages:[...(app.messages||[]),message('Please share your formal quotation, amount and validity.','quote_requested')],events:[...(app.events||[]),event(app.applicantId,'action','Quotation Requested',`${demoCompany(actor).name} requested your quotation.`)]};break;
    case 'quote': {
      if(!isApplicant) throw new Error('Only the applying merchant can submit this quotation.');
      if(!['quotation_requested','quoted'].includes(app.status)) throw new Error('The request owner must request a quotation first.');
      const amount=Number(payload.amount);
      if(!Number.isFinite(amount)||amount<=0) throw new Error('Enter a valid positive amount.');
      if(!['USD','INR','EUR','GBP','AED'].includes(payload.currency)) throw new Error('Choose a valid currency.');
      if(!/^\d{4}-\d{2}-\d{2}$/.test(payload.validUntil||'') || Number.isNaN(Date.parse(payload.validUntil)) || payload.validUntil<now.slice(0,10)) throw new Error('Choose a valid quotation expiry date.');
      const quote={amount,currency:payload.currency,validUntil:payload.validUntil,details:payload.details?.trim()||'',submittedAt:now};
      changes={status:'quoted',quote,messages:[...(app.messages||[]),message(`${quotePrice(quote)} · Valid until ${workflowDate(quote.validUntil)}${quote.details?`\n${quote.details}`:''}`,'quote')],events:[...(app.events||[]),event(app.ownerId,'action','Quotation Received',`${demoCompany(actor).name} submitted a quotation.`)]};break;
    }
    case 'award':
      if(!isOwner) throw new Error('Only the request owner can award a quotation.');
      if(app.status==='awarded') return records;
      if(app.status!=='quoted'||!app.quote) throw new Error('A submitted quotation is required before awarding.');
      if(app.quote.validUntil<now.slice(0,10)) throw new Error('This quotation has expired. Request an updated quotation.');
      if(records.some(other=>other.id!==id&&other.postId===app.postId&&['awarded','completed'].includes(other.status))) throw new Error('This requirement has already been awarded.');
      changes={status:'awarded',awardedAt:now,events:[...(app.events||[]),event(app.applicantId,'awards','Application Awarded',`${demoCompany(actor).name} awarded this requirement to you.`)]};break;
    case 'complete':
      if(!isApplicant) throw new Error('Only the awarded merchant can mark the work complete.');
      if(app.status==='completed') return records;
      if(app.status!=='awarded') throw new Error('Only awarded work can be completed.');
      changes={status:'completed',completedAt:now,events:[...(app.events||[]),event(app.ownerId,'action','Job marked complete',`${demoCompany(actor).name} completed this requirement. Please rate the service.`)]};break;
    case 'review': {
      if(!isOwner) throw new Error('Only the request owner can rate this work.');
      if(app.status!=='completed') throw new Error('Work must be completed before rating.');
      if(app.review) throw new Error('You have already rated this work.');
      for(const key of ['quality','communication','timeliness']) if(!Number.isInteger(payload[key])||payload[key]<1||payload[key]>5) throw new Error('Rate all three service dimensions from 1 to 5.');
      if((payload.feedback||'').length>600) throw new Error('Feedback must be 600 characters or fewer.');
      changes={review:{quality:payload.quality,communication:payload.communication,timeliness:payload.timeliness,feedback:payload.feedback?.trim()||'',createdAt:now,reviewerId:actor},events:[...(app.events||[]),event(app.applicantId,'review','New Review',`${demoCompany(actor).name} rated your service.`)]};break;
    }
    default:throw new Error('Unknown workflow action.');
  }
  return records.map(record=>record.id===id?{...record,...changes}:record);
}
