import React, {useEffect, useRef, useState} from 'react';
import {startRequirementVoiceOpening} from '../../services/requirementVoiceOpening';
import {startRequirementSpeech} from '../../services/requirementSpeech';
import {buildRequestVoiceDraft} from '../../services/requestVoiceDraft';
import {requestConversationTurn} from '../../services/requestConversation';
import {useSiteLanguage} from '../../context/LanguageContext';
import './PostRequirementAI.css';

export function PostRequirementAI({initialData={},onComplete,voiceSessionFactory=startRequirementSpeech}) {
  const {language,t}=useSiteLanguage();
  const [mode,setMode]=useState('voice');
  const [state,setState]=useState('idle');
  const [transcript,setTranscript]=useState('');
  const [input,setInput]=useState('');
  const [messages,setMessages]=useState([{role:'assistant',text:'What do you need?',local:true}]);
  const [error,setError]=useState('');
  const [working,setWorking]=useState(false);
  const session=useRef(null),latestText=useRef(''),pendingFinish=useRef(false),request=useRef(null),alive=useRef(true);
  const transcriptLanguage=useRef(language),history=useRef(null);
  const Recognition=typeof window!=='undefined' && (window.SpeechRecognition||window.webkitSpeechRecognition);
  const active=['requesting','listening','processing','speaking'].includes(state);
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;session.current?.cancel();request.current?.abort();};},[]);
  useEffect(()=>{history.current?.scrollTo({top:history.current.scrollHeight,behavior:'smooth'});},[messages,working]);
  const setText=value=>{if (!latestText.current.trim()) transcriptLanguage.current=language;latestText.current=value;setTranscript(value);};
  const complete=async()=>{
    if(request.current)return;
    session.current?.cancel();
    const controller=new AbortController();request.current=controller;setWorking(true);setError('');
    try {
      const draft=await buildRequestVoiceDraft(latestText.current,transcriptLanguage.current,initialData,{signal:controller.signal});
      if(!controller.signal.aborted&&alive.current)onComplete(draft);
    } catch {if(!controller.signal.aborted&&alive.current){setError('Couldn’t prepare your request. Your answers are safe. Try again.');setState('complete');}}
    finally{request.current=null;if(alive.current)setWorking(false);}
  };
  const endInput=()=>{
    if(working||pendingFinish.current)return;
    if(input.trim()){setText([latestText.current,input.trim()].filter(Boolean).join('\n'));setInput('');}
    if(['requesting','listening','processing'].includes(state)){pendingFinish.current=true;session.current?.stop();}
    else complete();
  };
  const toggleVoice=()=>{
    if(working)return;
    if(active){session.current?.stop();return;}
    setError('');session.current?.cancel();
    session.current=startRequirementVoiceOpening({language,synthesis:window.speechSynthesis,Utterance:window.SpeechSynthesisUtterance,recognitionFactory:voiceSessionFactory,Recognition,locale:language==='en'?'en-IN':language,initialText:latestText.current,
      onText:value=>{if(alive.current)setText(value);},onState:value=>{if(alive.current)setState(value);},
      onError:message=>{if(alive.current){setError(message);pendingFinish.current=false;}},
      onFinish:()=>{if(pendingFinish.current&&alive.current){pendingFinish.current=false;complete();}}
    });
  };
  const send=async event=>{
    event.preventDefault();const value=input.trim();if(!value||working)return;
    const combined=[latestText.current,value].filter(Boolean).join('\n');setText(combined);setInput('');
    setMessages(items=>[...items,{role:'user',text:value}]);setWorking(true);setError('');
    const controller=new AbortController();request.current=controller;
    try{
      const result=await requestConversationTurn(combined,transcriptLanguage.current,initialData,{signal:controller.signal});
      if(!controller.signal.aborted&&alive.current)setMessages(items=>[...items,{role:'assistant',text:result.question,local:true}]);
    }catch{if(!controller.signal.aborted&&alive.current)setError('Couldn’t prepare your request. Your answers are safe. Try again.');}
    finally{request.current=null;if(alive.current)setWorking(false);}
  };
  const changeMode=value=>{session.current?.cancel();pendingFinish.current=false;setState('idle');setError('');setMode(value);};
  const status=working?'Processing':{idle:'Tap to talk',requesting:'Allow microphone access to start',listening:'Listening…',speaking:'Speaking…',processing:'Finishing transcription…',complete:'Tap to add more',error:'Tap to try again'}[state];
  return <div className={`ai-simple ai-minimal-agent is-${mode}-mode`} lang={language}>
    <header className="ai-agent-heading">
      <span className="ai-agent-heading-mark" aria-hidden="true">
        <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
          <path d="m10 3 2.4 6.6L19 12l-6.6 2.4L10 21l-2.4-6.6L1 12l6.6-2.4L10 3Z" fill="currentColor" />
          <path d="m19 2 1.1 3L23 6l-2.9 1L19 10l-1-3-3-1 3-1L19 2Z" fill="#42a8a7" />
        </svg>
      </span>
      <div className="ai-agent-heading-copy">
        <span className="ai-agent-heading-label">{t('Post assistant')}</span>
        <h3>{t('Describe your requirement')}</h3>
      </div>
    </header>
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
        <textarea id="voice-request-transcript" rows={3} value={transcript} readOnly={active||working} onChange={event=>setText(event.target.value)} />
      </details>}
      {error&&<p className="ai-simple-error" role="alert">{t(error)}</p>}
    </>}
    <div className="ai-minimal-end"><button type="button" className="ai-end-chat" disabled={working||(pendingFinish.current&&active)} onClick={endInput}><span className="material-symbols-outlined" aria-hidden="true">{working?'hourglass_top':'task_alt'}</span>{t(working?'Preparing form…':'End Chat')}</button></div>
  </div>;
}
