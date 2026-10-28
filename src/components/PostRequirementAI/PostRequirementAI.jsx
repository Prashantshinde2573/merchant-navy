import {DEMO_SCOPE,DEMO_SCOPES,DEMO_AGENT_VERSION} from '../../prototype/demoData';
import {requirementGreeting} from '../../services/requirementNarration';
import React, {useEffect, useRef, useState} from 'react';
import {startRequirementVoiceOpening} from '../../services/requirementVoiceOpening';
import {startRequirementSpeech} from '../../services/requirementSpeech';
import {buildRequestVoiceDraft} from '../../services/requestVoiceDraft';
import {requestConversationTurn} from '../../services/requestConversation';
import {detectLanguage} from '../../services/translationService';
import {requirementCopy} from '../../services/requirementLanguages';
import {useSiteLanguage} from '../../context/LanguageContext';
import './PostRequirementAI.css';

export function PostRequirementAI({initialData={},onComplete,onCancel,voiceSessionFactory=startRequirementSpeech,demoMode=false}) {
  const {language:profileLanguage}=useSiteLanguage();
  const [language,setAssistantLanguage]=useState(profileLanguage);
  const t=value=>requirementCopy(value,language);
  useEffect(()=>setAssistantLanguage(profileLanguage),[profileLanguage]);
  const manualData=useRef(initialData),manualBaseline=useRef(initialData);manualData.current=initialData;
  const [mode,setMode]=useState('voice');
  const [state,setState]=useState('idle');
  const [transcript,setTranscript]=useState('');
  const [input,setInput]=useState('');
  const [messages,setMessages]=useState([{role:'assistant',text:'What do you need?',local:true}]);
  const [error,setError]=useState('');
  const [working,setWorking]=useState(false),[demoMuted,setDemoMuted]=useState(false),[silence,setSilence]=useState(false);
  const demoTimers=useRef([]),startedAt=useRef(Date.now());
  const clearDemo=()=>{demoTimers.current.forEach(clearTimeout);demoTimers.current=[];};
  const session=useRef(null),latestText=useRef(''),pendingFinish=useRef(false),request=useRef(null),alive=useRef(true);
  const transcriptLanguage=useRef(language),history=useRef(null),turns=useRef([]),questionField=useRef(null),followups=useRef({});
  const Recognition=typeof window!=='undefined' && (window.SpeechRecognition||window.webkitSpeechRecognition);
  const active=['permission','connecting','thinking','filling','requesting','listening','processing','speaking'].includes(state);
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;clearDemo();session.current?.cancel();request.current?.abort();};},[]);
  useEffect(()=>{history.current?.scrollTo({top:history.current.scrollHeight,behavior:'smooth'});},[messages,working]);
  const setText=value=>{if (!latestText.current.trim()) transcriptLanguage.current=language;latestText.current=value;setTranscript(value);};
  const complete=async()=>{
    if(request.current)return;
    session.current?.cancel();
    const controller=new AbortController();request.current=controller;setWorking(true);setError('');
    try {
      const draft=await buildRequestVoiceDraft(latestText.current,transcriptLanguage.current,manualData.current,{signal:controller.signal,turns:turns.current});
      for(const key of ['scopeOfWork','selectedServices','selectedPorts','currency','minBudget','maxBudget','isAsap','serviceDates'])if(JSON.stringify(manualData.current[key])!==JSON.stringify(manualBaseline.current[key]))draft[key]=manualData.current[key];
      if(!controller.signal.aborted&&alive.current)onComplete({...draft,aiTranscript:latestText.current,agentVersion:demoMode?DEMO_AGENT_VERSION:'browser-voice-1'});
    } catch {if(!controller.signal.aborted&&alive.current){setError('Couldn’t prepare your request. Your answers are safe. Try again.');setState('complete');}}
    finally{request.current=null;if(alive.current)setWorking(false);}
  };
  const returnToManual=()=>{
    alive.current=false;pendingFinish.current=false;clearDemo();
    session.current?.cancel();request.current?.abort();
    onCancel?.();
  };
  const endInput=()=>{
    if(working||pendingFinish.current)return;
    if(input.trim()){turns.current.push({text:input.trim(),field:questionField.current});setText([latestText.current,input.trim()].filter(Boolean).join('\n'));setInput('');}
    if(['requesting','listening','processing'].includes(state)){pendingFinish.current=true;session.current?.stop();}
    else complete();
  };
  const runVoiceDemo=()=>{
    clearDemo();setError('');setSilence(false);setState('connecting');
    session.current={cancel:clearDemo,stop:()=>{clearDemo();setState('complete');if(pendingFinish.current){pendingFinish.current=false;complete();}}};
    demoTimers.current.push(setTimeout(()=>setState('speaking'),500));
    demoTimers.current.push(setTimeout(()=>{
      setState('listening');
      const spoken=DEMO_SCOPES[language]||DEMO_SCOPE;
      const text=[latestText.current,spoken].filter(Boolean).join('\n');
      turns.current.push({text:spoken,field:null});setText(text);
      demoTimers.current.push(setTimeout(()=>{setSilence(true);demoTimers.current.push(setTimeout(()=>{pendingFinish.current=true;session.current?.stop();},15000));},60000));
    },1900));
  };
  useEffect(()=>{const timer=setTimeout(()=>{if(alive.current&&!request.current)complete();},240000);return()=>clearTimeout(timer);},[]);
  const toggleVoice=()=>{
    if(working)return;
    if(active){session.current?.stop();return;}
    setError('');session.current?.cancel();
    if(demoMode){setState('permission');return;}
    const previousText=latestText.current;
    session.current=startRequirementVoiceOpening({language,synthesis:window.speechSynthesis,Utterance:window.SpeechSynthesisUtterance,recognitionFactory:voiceSessionFactory,Recognition,locale:language==='en'?'en-IN':language,initialText:latestText.current,
      onText:value=>{if(alive.current)setText(value);},onState:value=>{if(alive.current)setState(value);},
      onError:message=>{if(alive.current){setError(message);pendingFinish.current=false;}},
      onFinish:()=>{
        if(!alive.current)return;
        const answer=latestText.current.slice(previousText.length).trim();
        if(answer)turns.current.push({text:answer,field:null});
        if(pendingFinish.current){pendingFinish.current=false;complete();}
      }
    });
  };
  const send=async event=>{
    event.preventDefault();const value=input.trim();if(!value||working)return;
    if(messages.filter(item=>item.role==='user').length>=12||Date.now()-startedAt.current>240000){complete();return;}
    const combined=[latestText.current,value].filter(Boolean).join('\n');const replyLanguage=detectLanguage(value);
    turns.current.push({text:value,field:questionField.current,language:replyLanguage});
    if(replyLanguage!==language&&(/[^\u0000-\u007f]/.test(value)||value.split(/\s+/).length>=4))setAssistantLanguage(replyLanguage);
    setText(combined);setInput('');
    setMessages(items=>[...items,{role:'user',text:value}]);setWorking(true);setError('');
    const controller=new AbortController();request.current=controller;
    try{
      const result=await requestConversationTurn(combined,transcriptLanguage.current,manualData.current,{signal:controller.signal,turns:turns.current});
      if(!controller.signal.aborted&&alive.current){
        if(result.field&&result.field===questionField.current)followups.current[result.field]=(followups.current[result.field]||0)+1;
        const limit=result.field&&followups.current[result.field]>=3;
        questionField.current=limit?null:result.field;setMessages(items=>[...items,{role:'assistant',text:limit?'Please review the remaining details in the form.':result.question,local:!limit}]);
      }
    }catch{if(!controller.signal.aborted&&alive.current)setError('Couldn’t prepare your request. Your answers are safe. Try again.');}
    finally{request.current=null;if(alive.current)setWorking(false);}
  };
  const changeMode=value=>{session.current?.cancel();pendingFinish.current=false;setState('idle');setError('');setMode(value);};
  const status=working?'Processing':{idle:'Tap to talk',permission:'Microphone permission preview',connecting:'Connecting…',thinking:'Thinking…',filling:'Filling your form…',requesting:'Allow microphone access to start',listening:'Listening…',speaking:'Speaking…',processing:'Finishing transcription…',complete:'Tap to add more',error:'Tap to try again'}[state];
  return <div className={`ai-simple ai-minimal-agent is-${mode}-mode`} lang={language}>
    {onCancel&&<button type="button" className="ai-describe-manually" onClick={returnToManual}><span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>{t('Describe Manually')}</button>}
    <div className="ai-minimal-stage">
      <button type="button" className={`ai-agent-orb ai-fluid-orb ${state==='listening'?'is-listening':state==='speaking'?'is-speaking':''}`}
        onClick={mode==='voice'?toggleVoice:undefined} disabled={mode==='chat'||working||state==='processing'||state==='requesting'}
        aria-label={t(active?'Stop voice input':'Talk to the assistant')} aria-pressed={active} aria-describedby="request-voice-status">
        <span className="ai-orb-fluid" aria-hidden="true" />
        {mode==='voice'&&<span className="material-symbols-outlined" aria-hidden="true">{active?'stop':'mic'}</span>}
      </button>
      <p id="request-voice-status" className="ai-minimal-status" role="status" aria-live="polite">{mode==='voice'?t(status):t('Let’s get the details right.')}</p>
      <div className="ai-mode-switch" role="group" aria-label={t('Input mode')}>
        {['voice','chat'].map(value=><button type="button" key={value} aria-pressed={mode===value} disabled={working} onClick={()=>changeMode(value)}>
          <span className="material-symbols-outlined" aria-hidden="true">{value==='voice'?'mic':'chat_bubble_outline'}</span>{t(value==='voice'?'Voice':'Chat')}
        </button>)}
      </div>
    </div>
    {demoMode&&mode==='voice'&&<p className="ai-prototype-caption">Scripted voice preview · no audio is recorded</p>}
    {state==='permission'&&<div className="ai-prototype-permission" role="group" aria-label="Microphone permission preview"><p>Allow microphone access?</p><button type="button" onClick={runVoiceDemo}>Allow (demo)</button><button type="button" onClick={()=>{setState('error');setError('Microphone access was denied. Allow it in your browser settings, or type your answer.');}}>Deny (demo)</button></div>}
    {state==='speaking'&&demoMode&&<p className="ai-voice-guide">{requirementGreeting(new Date(),language)}. {t('Please describe your requirements.')} I’ll fill the form for you.</p>}
    {state==='listening'&&<button type="button" className="ai-simple-link" aria-pressed={demoMuted} onClick={()=>{if(demoMode){setDemoMuted(value=>!value);}else{session.current?.stop();}}}>{demoMode?(demoMuted?'Unmute':'Mute'):'Stop listening'}</button>}
    {silence&&<p role="status">Are you still there? End the input to review your form.</p>}
    {mode==='chat'?<>
      <div className="ai-chat-history" ref={history} role="log" aria-label={t('Conversation')}>
        {messages.map((message,index)=><div key={index} className={`ai-chat-row is-${message.role}`}>
          <span className="ai-chat-avatar material-symbols-outlined" aria-hidden="true">{message.role==='assistant'?'auto_awesome':'person'}</span>
          <div className={`ai-chat-message is-${message.role}`}><span className="ai-chat-speaker">{t(message.role==='assistant'?'Assistant':'You')}</span><p>{message.local?t(message.text):message.text}</p></div>
        </div>)}
        {working&&<div className="ai-chat-typing" role="status" aria-label={t('Processing')}><i/><i/><i/></div>}
      </div>
      {error&&<p className="ai-simple-error" role="alert">{t(error)}</p>}
      <form className="ai-chat-input" onSubmit={send}>
        <label className="sr-only" htmlFor="ai-chat-answer">{t('Your answer')}</label>
        <textarea id="ai-chat-answer" rows={1} value={input} disabled={working} placeholder={t('Type your answer…')} onChange={event=>setInput(event.target.value)}
          onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.nativeEvent.isComposing){event.preventDefault();send(event);}}} />
        <button type="submit" disabled={working||!input.trim()} aria-label={t('Send answer')}><span className="material-symbols-outlined" aria-hidden="true">arrow_upward</span></button>
      </form>
    </>:<>
      {!transcript&&<div className="ai-voice-guide"><p>{t(state==='listening'?'Please describe your requirements.':'Your assistant is ready.')}</p><span>{t(state==='listening'?'Speak naturally. Review before publishing.':'Nothing is published yet.')}</span></div>}
      {transcript&&<details className="ai-voice-transcript"><summary>{t('Your answers')}</summary><label className="sr-only" htmlFor="voice-request-transcript">{t('Your answer')}</label>
        <textarea id="voice-request-transcript" rows={3} value={transcript} readOnly={active||working} onChange={event=>{
        const lines=event.target.value.split(/\n+/).filter(value=>value.trim());
        turns.current=lines.map((text,index)=>({text,field:lines.length===turns.current.length?turns.current[index]?.field:null}));
        setText(event.target.value);
      }} />
      </details>}
      {error&&<p className="ai-simple-error" role="alert">{t(error)}</p>}
    </>}
    {error&&<div className="ai-prototype-recovery"><button type="button" onClick={()=>{setError('');setState('idle');}}>Retry</button><button type="button" onClick={()=>changeMode('chat')}>Type instead</button></div>}
    <div className="ai-minimal-end"><button type="button" className="ai-end-chat" disabled={working||(pendingFinish.current&&active)} onClick={endInput}><span className="material-symbols-outlined" aria-hidden="true">{working?'hourglass_top':'task_alt'}</span>{t(working?'Preparing form…':'End Chat')}</button></div>
  </div>;
}
