import React,{useMemo} from 'react';
const tags=new Set(['P','DIV','BR','STRONG','B','EM','I','U','UL','OL','LI']);
/** Render only formatting elements; never execute stored HTML or copy attributes. */
export function RichScope({html,fallback,className,language,direction}){
 const content=useMemo(()=>{
  if(!html||typeof DOMParser==='undefined')return fallback;
  const document=new DOMParser().parseFromString(html,'text/html');
  const render=(node,key)=>{
   if(node.nodeType===3)return node.textContent;
   if(node.nodeType!==1||['SCRIPT','STYLE','IFRAME','OBJECT'].includes(node.tagName))return null;
   const children=Array.from(node.childNodes).map((child,index)=>render(child,`${key}-${index}`));
   return tags.has(node.tagName)?React.createElement(node.tagName==='DIV'?'p':node.tagName.toLowerCase(),{key},node.tagName==='BR'?undefined:children):children;
  };
  return Array.from(document.body.childNodes).map((node,index)=>render(node,String(index)));
 },[html,fallback]);
 return <div className={`${className} post-rich-scope`} lang={language} dir={direction}>{content}</div>;
}
