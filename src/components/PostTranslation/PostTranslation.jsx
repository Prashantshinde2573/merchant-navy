import React, {useEffect, useState} from 'react';
import {originalPostLanguage, preparePostTranslation} from '../../services/postTranslation';
import {useSiteLanguage} from '../../context/LanguageContext';
import './PostTranslation.css';

export function PostContentWithTranslation({postId,text,sourceLanguage,className='text-modified-15 text-content2-foreground line-clamp-3'}) {
  const {language}=useSiteLanguage();
  const [translation,setTranslation]=useState(null);
  const [originalKey,setOriginalKey]=useState(null);
  const source=originalPostLanguage(text,sourceLanguage);
  const key=JSON.stringify([postId,text,source,language]);
  useEffect(()=>{
    setOriginalKey(null);
    const controller=new AbortController();
    preparePostTranslation(text,source,language,{signal:controller.signal}).then(result=>{
      if(!controller.signal.aborted)setTranslation({key,...result});
    }).catch(()=>{/* Aborted requests cannot update another post/language. */});
    return()=>controller.abort();
  },[key,text,source,language]);
  const ready=translation?.key===key && translation.translated;
  const showOriginal=originalKey===key;
  return <div className="post-translation-wrapper w-full relative">
    <p className={className} lang={ready&&!showOriginal?translation.target:source} style={{whiteSpace:'pre-wrap'}}>
      {ready&&!showOriginal?translation.value:text}
    </p>
    {ready&&<div className="post-translation-action-row mt-1.5 flex items-center gap-1.5 text-xs text-zinc-500" lang="en">
      <span>{showOriginal?'Original':'Translated using AI'}</span><span aria-hidden="true">·</span>
      <button type="button" className="bg-transparent border-0 p-0 text-blue-600 hover:underline cursor-pointer" style={{minHeight:28}}
        onClick={event=>{event.stopPropagation();setOriginalKey(showOriginal?null:key);}}
        aria-label={showOriginal?'See Translation':'See Original'}>
        {showOriginal?'See Translation':'See Original'}
      </button>
    </div>}
  </div>;
}
