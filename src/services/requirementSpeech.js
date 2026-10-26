/** Browser speech adapter shared by the AI input and its lifecycle tests. */
export function startRequirementSpeech({ Recognition, initialText, onText, onState, onError, onFinish, locale = 'en-IN' }) {
  let recognition;
  let active = true;
  let receivedText = false;
  let timer;
  const clearTimer = () => clearTimeout(timer);
  const detach = () => {
    if (!recognition) return;
    recognition.onstart = recognition.onresult = recognition.onspeechend = null;
    recognition.onerror = recognition.onend = null;
  };
  const fail = (message) => {
    if (!active) return;
    active = false;
    clearTimer();
    detach();
    try { recognition?.abort(); } catch { /* Some browsers have already ended the session. */ }
    onState('error');
    onError(message);
  };
  const processing = () => {
    if (!active) return;
    onState('processing');
    clearTimer();
    timer = setTimeout(() => fail('Transcription took too long. Try again or type your answer.'), 8000);
  };
  const session = {
    stop() {
      if (!active) return;
      processing();
      try { recognition.stop(); }
      catch { fail('Voice input stopped. You can edit the text or try again.'); }
    },
    cancel() {
      active = false;
      clearTimer();
      detach();
      try { recognition?.abort(); } catch { /* Some browsers have already ended the session. */ }
    }
  };
  try {
    if (!Recognition) throw new Error('unsupported');
    recognition = new Recognition();
    recognition.lang = locale;
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onstart = () => { if (active) onState('listening'); };
    recognition.onresult = (event) => {
      if (!active) return;
      const transcript = Array.from(event.results).map(result => result[0].transcript).join(' ').trim();
      receivedText = Boolean(transcript);
      onText([initialText.trim(), transcript].filter(Boolean).join(' '));
    };
    recognition.onspeechend = processing;
    recognition.onerror = (event) => {
      const messages = {
        'not-allowed': 'Microphone access was denied. Allow it in your browser settings, or type your answer.',
        'service-not-allowed': 'Voice input is blocked in this browser. You can type your answer instead.',
        'audio-capture': 'No microphone found. Connect one or type your answer.',
        'no-speech': 'No speech detected. Try the microphone again or type your answer.',
        network: 'Voice input could not connect. Try again or type your answer.'
      };
      fail(messages[event.error] || 'Voice input stopped. Try again or type your answer.');
    };
    recognition.onend = () => {
      if (!active) return;
      active = false;
      clearTimer();
      detach();
      if (!receivedText) {
        onState('error');
        onError('No speech detected. Try the microphone again or type your answer.');
      } else {
        onState('complete');
        onFinish();
      }
    };
    onState('requesting');
    recognition.start();
  } catch {
    fail('Voice input is unavailable. You can still type your answer.');
  }
  return session;
}
