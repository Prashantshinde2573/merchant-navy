import React, {useEffect, useId, useRef, useState} from 'react';
import {AVAILABLE_LANGUAGES} from '../../services/translationService';
import {useSiteLanguage} from '../../context/LanguageContext';
import './LanguageMenu.css';

export function LanguageMenu({variant='icon'}) {
  const {language,setLanguage,t}=useSiteLanguage();
  const [open,setOpen]=useState(false),[query,setQuery]=useState('');
  const root=useRef(null),trigger=useRef(null),options=useRef(null);
  const id=useId();
  useEffect(()=>{
    if(!open)return;
    options.current?.querySelector('[aria-checked="true"]')?.focus();
    const outside=event=>{if(!root.current?.contains(event.target))setOpen(false);};
    const escape=event=>{if(event.key==='Escape'){event.preventDefault();setOpen(false);trigger.current?.focus();}};
    document.addEventListener('pointerdown',outside);
    document.addEventListener('keydown',escape);
    return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);};
  },[open]);
  return <div className={`navbar-language ${variant==='navigation'?'is-navigation':''}`} ref={root}>
    <button type="button" className="navbar-language-trigger" ref={trigger} aria-label={t('Language')} title={t('Language')} aria-haspopup="menu" aria-expanded={open} aria-controls={open?id:undefined} onClick={()=>setOpen(value=>!value)}>
      <span className="material-symbols-outlined" aria-hidden="true">translate</span>
      {variant==='navigation'&&<><span className="navbar-language-label">{t('Language')}</span><span className="navbar-language-current">{AVAILABLE_LANGUAGES.find(item=>item.code===language)?.nativeName}</span><span className="material-symbols-outlined navbar-language-chevron" aria-hidden="true">{open?'expand_less':'expand_more'}</span></>}
    </button>
    {open&&<div className="navbar-language-menu" id={id} role="menu" aria-label={t('Language')} ref={options} onKeyDown={event=>{
      const buttons=[...options.current.querySelectorAll('button')];const index=buttons.indexOf(document.activeElement);
      const next=event.key==='ArrowDown'?(index+1)%buttons.length:event.key==='ArrowUp'?(index-1+buttons.length)%buttons.length:event.key==='Home'?0:event.key==='End'?buttons.length-1:null;
      if(event.target.tagName==='INPUT'&&!['ArrowDown','ArrowUp'].includes(event.key))return;
      if(next!==null){event.preventDefault();buttons[next]?.focus();}
      if(event.key==='Tab'){trigger.current?.focus();setOpen(false);}
    }}>
      <label className="sr-only" htmlFor={`${id}-search`}>Search languages</label><input id={`${id}-search`} type="search" placeholder="Search languages…" value={query} onChange={event=>setQuery(event.target.value)} className="language-menu-search" />
      {AVAILABLE_LANGUAGES.filter(item=>`${item.name} ${item.nativeName}`.toLowerCase().includes(query.toLowerCase())).map(item=><button type="button" role="menuitemradio" aria-checked={language===item.code} key={item.code} lang={item.code} onClick={()=>{setLanguage(item.code);setOpen(false);trigger.current?.focus();}}>
        <span><span aria-hidden="true">{({en:'🇬🇧',hi:'🇮🇳',mr:'🇮🇳',es:'🇪🇸',fr:'🇫🇷',de:'🇩🇪',ar:'🇸🇦',ja:'🇯🇵'})[item.code]||'🌐'}</span> {item.nativeName}<small>{item.name!==item.nativeName?item.name:''}</small></span>
        {language===item.code&&<span className="material-symbols-outlined" aria-hidden="true">check</span>}
      </button>)}
    </div>}
  </div>;
}
