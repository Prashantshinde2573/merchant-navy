import { requirementCopy } from "./requirementLanguages.js";

/** Keep the opening informal outside the user's local afternoon. */
export function requirementGreeting(date = new Date(), language = 'en') {
  const hour = date.getHours();
  return requirementCopy(hour >= 12 && hour < 17 ? 'Good afternoon' : 'Hey', language);
}

// Web Speech has no gender field. Match known voice names; never infer gender from pitch.
const FEMALE_VOICES = /\b(?:female|neerja|heera|aarti|diya|meera|jenny|aria|sonia|libby|jane|sara|nancy|zira|hazel|susan|samantha|ava|allison|victoria|karen|moira|tessa|serena|sangeeta|veena|fiona|catherine|joanna|salli|amy|emma|olivia|natasha|clara|jessica|michelle|ana|emily|elizabeth|swara|lekha|aarohi|denise|amelie|audrey|marie|sylvie|katja|hedda|petra|seraphina|anna|monica|paulina|lucia|elvira|dalia|sabina)\b/i;
const NATURAL = /natural|neural|dragonhd/i;
const ENHANCED = /enhanced|premium/i;

export function selectRequirementVoice(voices = [], locale = 'en-IN') {
  const language = locale.split(/[-_]/)[0].toLowerCase();
  return voices.filter(voice => voice.lang.split(/[-_]/)[0].toLowerCase() === language && FEMALE_VOICES.test((voice.name || '').normalize('NFD').replace(/\p{M}/gu, '').replace(/Neural|Multilingual|DragonHD/gi, ' ')))
    .map(voice => {
      const identity = `${voice.name} ${voice.voiceURI || ''}`;
      const quality = NATURAL.test(identity) ? 1000 : ENHANCED.test(identity) ? 700 : 0;
      const localeScore = voice.lang.toLowerCase() === locale.toLowerCase() ? 100 : /^en[-_]GB$/i.test(voice.lang) ? 50 : 40;
      return { voice, score: quality + localeScore + (voice.default ? 5 : 0) };
    }).sort((a, b) => b.score - a.score)[0]?.voice || null;
}

const CURRENCIES = { INR:'Indian rupees', USD:'US dollars', AED:'dirhams', EUR:'euros', GBP:'pounds' };

/** Spoken copy has punctuation and expanded units; the user's written post stays untouched. */
export function prepareRequirementNarration(text, locale = 'en-IN') {
  if (!/^en[-_]/i.test(locale)) return text.replace(/\s*\n+\s*/g, ' ').trim();
  return text.replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
    .replace(/\b(INR|USD|AED|EUR|GBP)\s+(\d[\d,]*(?:\.\d+)?)(?:\s*[–—-]\s*(\d[\d,]*(?:\.\d+)?))?/gi,
      (_, currency, min, max) => `${min}${max && max !== min ? ` to ${max}` : ''} ${CURRENCIES[currency.toUpperCase()]}`)
    .replace(/₹\s*(\d[\d,]*(?:\.\d+)?)/g, '$1 Indian rupees')
    .replace(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g, (raw, day, month, year) => {
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      if (date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) return raw;
      return `${Number(day)} ${date.toLocaleDateString('en-GB', {month:'long'})} ${year}`;
    })
    .replace(/\bASAP\b/g, 'as soon as possible')
    .replace(/\bMT\b/g, 'metric tonnes')
    .replace(/\s+[–—]\s+/g, ' to ')
    .replace(/\s*\n+\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

export function requirementPrompt({ greeting, firstQuestion, heading, support, describing = false, language = 'en' }) {
  const t = value => requirementCopy(value, language);
  const opening = firstQuestion ? `${greeting}, ${t('let’s get your post ready.')} ` : '';
  const question = describing ? t('What do you need?') : /[.!?]$/.test(heading) ? heading : `${heading}.`;
  const detail = describing ? t('Tell me about the work, and I’ll help with the details.') : support;
  return `${opening}${question} ${detail}`.trim();
}

/** Own speech and pending voice discovery, so mute also cancels delayed playback. */
export function createRequirementNarrator({ synthesis, Utterance, onState, onError, onVoice = () => {}, voiceWaitMs = 1500 }) {
  let current = null;
  const detach = request => {
    clearTimeout(request.timer);
    if (request.listener) synthesis?.removeEventListener?.('voiceschanged', request.listener);
    if (request.utterance) request.utterance.onstart = request.utterance.onend = request.utterance.onerror = null;
  };
  const stop = () => {
    if (!current) return;
    const request = current;
    current = null;
    detach(request);
    if (request.utterance) {
      try { synthesis.cancel(); } catch { /* The browser may already have ended speech. */ }
    }
    onState('idle');
  };
  const fail = (request, message) => {
    if (current !== request) return;
    stop();
    onState('error');
    onError(message);
  };
  return {
    stop,
    speak(text, {locale = 'en-IN'} = {}) {
      stop();
      if (!synthesis || !Utterance) {
        onState('error');
        onError('Read aloud is unavailable in this browser. You can read the question below.');
        return;
      }
      const request = { utterance:null, timer:null, listener:null };
      current = request;
      onState('starting');
      onError('');
      const play = voice => {
        if (current !== request || request.utterance) return;
        clearTimeout(request.timer);
        if (request.listener) synthesis.removeEventListener?.('voiceschanged', request.listener);
        request.listener = null;
        try {
          const utterance = new Utterance(prepareRequirementNarration(text, locale));
          request.utterance = utterance;
          utterance.voice = voice;
          utterance.lang = voice.lang;
          // Preserve the voice's own female timbre and prosody. High pitch sounds artificial.
          const premium = NATURAL.test(`${voice.name} ${voice.voiceURI || ''}`) || ENHANCED.test(`${voice.name} ${voice.voiceURI || ''}`);
          utterance.rate = premium ? 1 : 0.98;
          utterance.pitch = 1;
          utterance.volume = 1;
          utterance.onstart = () => { if (current === request) onState('speaking'); };
          utterance.onend = () => {
            if (current !== request) return;
            current = null;
            detach(request);
            onState('idle');
          };
          utterance.onerror = event => {
            if (current !== request) return;
            if (event.error === 'canceled' || event.error === 'interrupted') { stop(); return; }
            fail(request, 'Couldn’t play the voice-over. Try Listen again, or continue with the text.');
          };
          onVoice({ name:voice.name, natural:premium });
          synthesis.speak(utterance);
        } catch {
          fail(request, 'Couldn’t play the voice-over. You can continue with the text.');
        }
      };
      const discover = () => {
        if (current !== request) return;
        try {
          const voice = selectRequirementVoice(synthesis.getVoices(), locale);
          if (voice) play(voice);
        } catch { fail(request, 'Couldn’t load a female voice. You can continue with the text.'); }
      };
      // Chromium may report an empty voice list until voiceschanged fires.
      request.listener = discover;
      synthesis.addEventListener?.('voiceschanged', request.listener);
      request.timer = setTimeout(() => {
        discover();
        if (current === request && !request.utterance) {
          onVoice(null);
          fail(request, 'No recognised female voice is available for this language. You can continue with text.');
        }
      }, voiceWaitMs);
      discover();
    }
  };
}
