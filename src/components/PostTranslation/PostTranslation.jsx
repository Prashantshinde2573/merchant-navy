import React, {useEffect, useRef, useState} from 'react';
import {originalPostLanguage, preparePostTranslation} from '../../services/postTranslation';
import {useSiteLanguage} from '../../context/LanguageContext';
import './PostTranslation.css';
import {RichScope} from './RichScope';
const originals=new Set();

export function PostContentWithTranslation({postId,text,sourceLanguage,richHtml,placement='feed',demoState,className='text-modified-15 text-content2-foreground line-clamp-2'}) {
  const {language}=useSiteLanguage();
  const [translation,setTranslation]=useState(null);
  const [retry,setRetry]=useState(0),[loading,setLoading]=useState(false);
  const root=useRef(null);
  const [originalKey,setOriginalKey]=useState(null);
  const source=originalPostLanguage(text,sourceLanguage);
  const key=JSON.stringify([postId,text,richHtml,source,language]);
  useEffect(()=>{
    setOriginalKey(originals.has(key)?key:null);
    const controller=new AbortController();let timer;
    const run=()=>{
      if(source===language){setLoading(false);return;}
      setLoading(true);
      timer=setTimeout(()=>preparePostTranslation(text,source,language,{signal:controller.signal,richHtml}).then(result=>{
        if(!controller.signal.aborted){setTranslation({key,...result});setLoading(false);}
      }).catch(()=>{if(!controller.signal.aborted)setLoading(false);}),350);
    };
    const observer=typeof IntersectionObserver!=='undefined'?new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){run();observer.disconnect();}},{rootMargin:'200px'}):null;
    if(observer&&root.current)observer.observe(root.current);else run();
    return()=>{controller.abort();clearTimeout(timer);observer?.disconnect();};
  },[key,text,richHtml,source,language,retry]);
  const ready=translation?.key===key && translation.translated;
  const showOriginal=originalKey===key;
  const translated=demoState==='translated'||demoState==='original'||ready;
  const original=demoState==='original'||showOriginal;
  const busy=demoState==='translating'||loading;
  const failed=demoState==='failed'||(!busy&&source!==language&&translation?.key===key&&!translation.translated);
  const controls=translated?<div className="post-translation-action-row mt-1.5 flex items-center gap-1.5 text-xs text-zinc-500" lang="en">
    <span className="material-symbols-outlined" aria-hidden="true" style={{fontSize:14}}>auto_awesome</span><span>{original?'Original':'Translated using AI'}</span><span aria-hidden="true">·</span>
    <button type="button" className="bg-transparent border-0 p-0 text-blue-600 hover:underline cursor-pointer" style={{minHeight:28}}
      onClick={event=>{event.stopPropagation();if(original){originals.delete(key);setOriginalKey(null);}else{originals.add(key);setOriginalKey(key);}}}>
      {original?'See Translation':'See Original'}
    </button>
  </div>:failed?<div className="post-translation-action-row text-xs text-zinc-500" lang="en">Translation unavailable · <button type="button" className="text-blue-600 bg-transparent border-0 cursor-pointer" onClick={event=>{event.stopPropagation();setRetry(value=>value+1);}}>Retry</button></div>:null;
  return <div className="post-translation-wrapper w-full relative" ref={root}>
    {placement==='detail'&&controls}
    {busy?<div className="translation-skeleton" aria-label="Translating post" role="status"><i/><i/><i/></div>:<RichScope html={translated&&!original?translation?.richHtml:richHtml} fallback={translated&&!original&&translation?.value?translation.value:text} className={className} language={translated&&!original?language:source} direction={['ar','ur'].includes(translated&&!original?language:source)?'rtl':'auto'}/>}
    {placement!=='detail'&&controls}
  </div>;
}
