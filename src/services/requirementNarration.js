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
  const normalize = value => (value || '').normalize('NFD').replace(/\p{M}/gu, '').replace(/Neural|Multilingual|DragonHD/gi, ' ');
  return voices.filter(voice => {
    if ((voice.lang || '').split(/[-_]/)[0].toLowerCase() !== language) return false;
    const identity = normalize(`${voice.name || ''} ${voice.voiceURI || ''}`);
    // Some engines expose the female identity only in voiceURI. Chrome also
    // gives its US female voice a generic label, without the word "female".
    if (/\bmale\b/i.test(identity) && !/\bfemale\b/i.test(identity)) return false;
    return FEMALE_VOICES.test(identity) || /^Google US English$/i.test(voice.name || '');
  })
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
export function createRequirementNarrator({ synthesis, Utterance, onState, onError, onVoice = () => {}, voiceWaitMs = 5000, voicePollMs = 250 }) {
  let current = null;
  const detach = request => {
    clearTimeout(request.timer);
    clearInterval(request.poll);
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
    speak(text, {locale = 'en-IN', userInitiated = false} = {}) {
      stop();
      if (!synthesis || !Utterance) {
        onState('error');
        onError('Read aloud is unavailable in this browser. You can read the question below.');
        return;
      }
      const request = { utterance:null, timer:null, poll:null, listener:null };
      current = request;
      onState('starting');
      onError('');
      const play = voice => {
        if (current !== request || request.utterance) return;
        clearTimeout(request.timer);
        clearInterval(request.poll);
        if (request.listener) synthesis.removeEventListener?.('voiceschanged', request.listener);
        request.listener = null;
        try {
          const utterance = new Utterance(prepareRequirementNarration(text, locale));
          request.utterance = utterance;
          if (voice) utterance.voice = voice;
          utterance.lang = voice?.lang || locale;
          // Preserve the voice's own female timbre and prosody. High pitch sounds artificial.
          const premium = NATURAL.test(`${voice?.name || ''} ${voice?.voiceURI || ''}`) || ENHANCED.test(`${voice?.name || ''} ${voice?.voiceURI || ''}`);
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
            if (event.error === 'not-allowed') {
              fail(request, 'Tap Listen to play the voice-over.');
              return;
            }
            fail(request, 'Couldn’t play the voice-over. Try Listen again, or continue with the text.');
          };
          onVoice({ name:voice?.name || '', natural:premium, female:Boolean(voice && selectRequirementVoice([voice], locale)) });
          if (synthesis.paused) synthesis.resume?.();
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
      // A direct tap must reach speak synchronously on mobile. Waiting for an
      // event/timer can lose browser user activation. Prefer the known female
      // voice, otherwise let the device choose for the requested language.
      if (userInitiated) {
        let voice = null;
        try { voice = selectRequirementVoice(synthesis.getVoices(), locale); } catch { /* Use native language selection. */ }
        play(voice);
        return;
      }
      // Chromium may report an empty voice list until voiceschanged fires.
      request.listener = discover;
      synthesis.addEventListener?.('voiceschanged', request.listener);
      // Some mobile engines populate voices without firing voiceschanged.
      // Poll only during this bounded discovery window; mute clears it too.
      request.poll = setInterval(discover, voicePollMs);
      request.timer = setTimeout(() => {
        discover();
        if (current === request && !request.utterance) {
          play(null);
        }
      }, voiceWaitMs);
      discover();
    }
  };
}
