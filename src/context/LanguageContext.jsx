import React, {createContext, useContext, useEffect, useState} from 'react';
import {useAuth} from './AuthContext';
import {getUserPreferredLanguage, setUserPreferredLanguage} from '../services/translationService';
import {requirementCopy} from '../services/requirementLanguages';
const LanguageContext = createContext(null);
export function LanguageProvider({children}) {
  const {currentUser} = useAuth();
  const [saved, setSaved] = useState(()=>({user:currentUser,language:getUserPreferredLanguage(currentUser)}));
  const language = saved.user===currentUser ? saved.language : getUserPreferredLanguage(currentUser);
  useEffect(()=>{
    const update=()=>setSaved({user:currentUser,language:getUserPreferredLanguage(currentUser)});
    update();
    window.addEventListener('storage',update);
    window.addEventListener('merchant-navy-language-change',update);
    return ()=>{window.removeEventListener('storage',update);window.removeEventListener('merchant-navy-language-change',update);};
  },[currentUser]);
  useEffect(()=>{document.documentElement.lang=language;},[language]);
  return <LanguageContext.Provider value={{language,setLanguage:value=>setUserPreferredLanguage(value,currentUser),t:value=>requirementCopy(value,language)}}>{children}</LanguageContext.Provider>;
}
export function useSiteLanguage() { return useContext(LanguageContext); }
