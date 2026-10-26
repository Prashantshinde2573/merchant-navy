// Same provider as translationService, with complete text and explicit failures for this flow.
const cache = new Map();
const encoder = new TextEncoder();
export function splitRequirementTranslation(text, limit = 450) {
  const chunks = [];
  let chunk = '';
  for (const token of text.match(/\S+\s*/gu) || []) {
    if (encoder.encode(chunk + token).length <= limit) { chunk += token; continue; }
    if (chunk) { chunks.push(chunk.trim()); chunk = ''; }
    for (const char of token) {
      if (encoder.encode(chunk + char).length > limit) { chunks.push(chunk.trim()); chunk = ''; }
      chunk += char;
    }
  }
  if (chunk.trim()) chunks.push(chunk.trim());
  return chunks;
}
function decode(text) {
  return text.replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
}
export async function translateRequirementText(text, source, target, {signal, fetcher = fetch, timeoutMs = 8000} = {}) {
  if (!text.trim() || source === target) return text;
  const key = JSON.stringify([source,target,text]);
  if (signal?.aborted) throw new DOMException('Aborted','AbortError');
  if (cache.has(key)) return cache.get(key);
  const translated = [];
  for (const paragraph of text.split(/\n+/).filter(value=>value.trim())) {
    const segments = [];
    for (const chunk of splitRequirementTranslation(paragraph)) {
      if (signal?.aborted) throw new DOMException('Aborted','AbortError');
      const controller = new AbortController();
      const abort = () => controller.abort();
      signal?.addEventListener('abort',abort,{once:true});
      const timer = setTimeout(abort,timeoutMs);
      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${source}|${target}`;
        const response = await fetcher(url,{signal:controller.signal});
        if (!response.ok) throw new Error('Translation unavailable');
        const result = await response.json();
        const value = result?.responseData?.translatedText;
        if (Number(result.responseStatus) !== 200 || typeof value !== 'string' || !value.trim() || /MYMEMORY WARNING|QUERY LENGTH LIMIT|INVALID LANGUAGE PAIR/i.test(value)) throw new Error('Translation unavailable');
        const decoded = decode(value.trim());
        if (decoded.toLowerCase() === chunk.toLowerCase() && (chunk.match(/\p{L}+/gu) || []).length >= 5) throw new Error('Translation was unchanged');
        if (['hi','mr'].includes(target) && (chunk.match(/\p{L}+/gu) || []).length >= 3 && !/[\u0900-\u097f]/.test(decoded)) throw new Error('Translation language mismatch');
        segments.push(decoded);
      } finally {
        clearTimeout(timer);
        signal?.removeEventListener('abort',abort);
      }
    }
    translated.push(segments.join(' '));
  }
  if (signal?.aborted) throw new DOMException('Aborted','AbortError');
  const output = translated.join('\n\n');
  if (cache.size > 100) cache.clear();
  cache.set(key,output);
  return output;
}
