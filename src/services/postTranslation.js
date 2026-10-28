import {translateRequirementText} from './requirementTranslation.js';
import {AVAILABLE_LANGUAGES, detectLanguage} from './translationService.js';

export function normalizePostLanguage(value) {
  if (typeof value !== 'string') return null;
  const normalized=value.trim().toLowerCase();
  return AVAILABLE_LANGUAGES.find(item=>item.code===normalized.split(/[-_]/)[0] || item.name.toLowerCase()===normalized)?.code || null;
}
export function originalPostLanguage(text, savedLanguage) {
  return normalizePostLanguage(savedLanguage) || detectLanguage(text || '');
}
/** Original content is immutable; a failed/unchanged translation has no toggle. */
export async function preparePostTranslation(text, savedLanguage, viewerLanguage, {signal, translate=translateRequirementText,richHtml}={}) {
  const source=originalPostLanguage(text,savedLanguage);
  const target=normalizePostLanguage(viewerLanguage);
  const original={value:text,source,target:source,translated:false};
  if (signal?.aborted) throw new DOMException('Aborted','AbortError');
  if (!text?.trim() || !target || source===target) return original;
  try {
    let html;
    if(richHtml&&typeof DOMParser!=='undefined'){
      const document=new DOMParser().parseFromString(richHtml,'text/html');
      const walker=document.createTreeWalker(document.body,4);const nodes=[];let node;
      while((node=walker.nextNode()))if(node.textContent.trim())nodes.push(node);
      for(const item of nodes)item.textContent=await translate(item.textContent,source,target,{signal});
      html=document.body.innerHTML;
    }
    const value=await translate(text,source,target,{signal});
    if (signal?.aborted) throw new DOMException('Aborted','AbortError');
    return typeof value==='string' && value.trim() && value.trim()!==text.trim()
      ? {value,source,target,translated:true,richHtml:html} : original;
  } catch (error) {
    if (signal?.aborted || error.name==='AbortError') throw error;
    return original;
  }
}
