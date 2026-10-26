import React, { useEffect, useRef, useState } from "react";
import { REQUIREMENT_QUESTIONS, parseAnswer, extractRequirement, extractBudget, getMissingQuestions } from "../../services/requirementAI";
import { requirementGreeting, requirementPrompt, createRequirementNarrator } from "../../services/requirementNarration";
import { startRequirementSpeech } from "../../services/requirementSpeech";
import { REQUIREMENT_LANGUAGES, requirementLocale, requirementCopy, preferredRequirementLanguage, saveRequirementLanguage, questionCount, localizedRequirementService, canonicalRequirementServices, normalizeRequirementDigits, normalizeRequirementNumbers, requirementCurrencyHint, localizedRequirementPort, canonicalRequirementPorts } from "../../services/requirementLanguages";
import { translateRequirementText } from "../../services/requirementTranslation";
import { detectLanguage } from "../../services/translationService";
import "./PostRequirementAI.css";

const QUESTIONS = [
  { question: "What service do you need?", placeholder: "e.g. Fresh water supply and hull cleaning", help: "You can include more than one service." },
  { question: "Which port is this for?", placeholder: "e.g. Mumbai, Chennai or a specific anchorage", help: "Include all the ports you need." },
  { question: "What work needs to be done?", placeholder: "Describe the work, quantities and any special requirements.", help: "A few clear details will help merchants quote accurately." },
  { question: "When do you need it?", placeholder: "e.g. Tomorrow, ASAP, or 10/11/2026 – 12/11/2026", help: "You can leave this open if your dates are flexible." },
  { question: "What’s your budget?", placeholder: "e.g. INR 40,000 or USD 4,000 – 5,000", help: "No fixed budget? Choose Open to quotations." }
];

function answerText(index, data) {
  if (index === -1 || index === 2) return data.scopeOfWork || "";
  if (index === 0) return (data.selectedServices || []).join(", ");
  if (index === 1) return (data.selectedPorts || []).join(", ");
  if (index === 3) return data.isAsap ? "ASAP" : data.serviceDates || "";
  const amounts = [data.minBudget, data.maxBudget].filter(value => value !== "" && value != null);
  if (!amounts.length) return "";
  return `${data.currency || "USD"} ${amounts[0]}${amounts.length > 1 && amounts[0] !== amounts[1] ? ` – ${amounts[1]}` : ""}`;
}

export function PostRequirementAI({ initialData, onComplete, onCancel }) {
  const [language, setLanguage] = useState(preferredRequirementLanguage);
  const locale = requirementLocale(language);
  const t = value => requirementCopy(value, language);
  const [scopeLanguage, setScopeLanguage] = useState(() => detectLanguage(initialData?.scopeOfWork || ""));
  const [textLanguage, setTextLanguage] = useState(() => detectLanguage(initialData?.scopeOfWork || ""));
  const [working, setWorking] = useState(false);
  const [preview, setPreview] = useState(null);
  const [previewError, setPreviewError] = useState(false);
  const [translationRetry, setTranslationRetry] = useState(0);
  const requestRef = useRef(null);
  const draftLanguages = useRef({});
  const [data, setData] = useState(() => ({
    scopeOfWork: initialData?.scopeOfWork || "",
    selectedServices: initialData?.selectedServices || [],
    selectedPorts: initialData?.selectedPorts || [],
    currency: initialData?.currency || "USD",
    minBudget: initialData?.minBudget ?? "",
    maxBudget: initialData?.maxBudget ?? "",
    isAsap: initialData?.isAsap || false,
    // The manual demo's preset is not an answer supplied to the assistant.
    serviceDates: initialData?.serviceDates === "09/09/2026 - 09/09/2026" && !initialData?.scopeOfWork ? "" : initialData?.serviceDates || ""
  }));
  const [index, setIndex] = useState(-1);
  const [reviewing, setReviewing] = useState(false);
  const [answered, setAnswered] = useState([]);
  const [questionOrder, setQuestionOrder] = useState([]);
  const [trail, setTrail] = useState([-1]);
  const [returnTo, setReturnTo] = useState(null);
  const [text, setText] = useState(initialData?.scopeOfWork || "");
  const [error, setError] = useState("");
  const [speechState, setSpeechState] = useState("idle");
  const [speechError, setSpeechError] = useState("");
  const [greetingTime] = useState(() => new Date());
  const greeting = requirementGreeting(greetingTime, language);
  const [muted, setMuted] = useState(true);
  const [narrationState, setNarrationState] = useState("idle");
  const [narrationError, setNarrationError] = useState("");
  const [narrationVoice, setNarrationVoice] = useState(null);
  const narratorRef = useRef(null);
  const lastNarratedKey = useRef(null);
  const draftsRef = useRef({});
  const sessionRef = useRef(null);
  const inputRef = useRef(null);
  const headingRef = useRef(null);
  const bodyRef = useRef(null);
  const firstRender = useRef(true);
  const Recognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const speechBusy = ["requesting", "listening", "processing"].includes(speechState);
  const busy = working || speechBusy;
  const describing = index === -1;
  const question = describing ? null : REQUIREMENT_QUESTIONS[index];
  const missing = getMissingQuestions(data, answered);
  const completed = REQUIREMENT_QUESTIONS.map((_, i) => i).filter(i => !missing.includes(i));
  const previous = completed.filter(i => i !== index);

  const previewReady = !data.scopeOfWork || scopeLanguage === language ||
    (preview?.source === data.scopeOfWork && preview?.sourceLanguage === scopeLanguage && preview?.language === language);
  const localizedScope = scopeLanguage === language ? data.scopeOfWork : previewReady ? preview?.text || "" : "";
  useEffect(() => {
    setPreviewError(false);
    if (!data.scopeOfWork || scopeLanguage === language) return;
    const controller = new AbortController();
    translateRequirementText(data.scopeOfWork, scopeLanguage, language, {signal:controller.signal})
      .then(value => { if (!controller.signal.aborted) setPreview({source:data.scopeOfWork, sourceLanguage:scopeLanguage, language, text:value}); })
      .catch(() => { if (!controller.signal.aborted) setPreviewError(true); });
    return () => controller.abort();
  }, [data.scopeOfWork, scopeLanguage, language, translationRetry]);

  const displayAnswer = (answerIndex, value = data) => {
    if (answerIndex === -1 || answerIndex === 2) return value.scopeOfWork === data.scopeOfWork ? (previewReady ? localizedScope : previewError ? data.scopeOfWork : t("Translating…")) : value.scopeOfWork;
    if (answerIndex === 0) return value.selectedServices.map(item => localizedRequirementService(item, language)).join(", ");
    if (answerIndex === 1) return value.selectedPorts.map(item => localizedRequirementPort(item, language)).join(", ");
    if (answerIndex === 4) {
      const format = amount => new Intl.NumberFormat(locale).format(Number(amount));
      const amounts = [value.minBudget, value.maxBudget].filter(item => item !== "" && item != null);
      return amounts.length ? `${value.currency} ${format(amounts[0])}${amounts.length > 1 && amounts[0] !== amounts[1] ? ` – ${format(amounts[1])}` : ""}` : "";
    }
    return answerText(answerIndex, value);
  };

  const canonicalInput = async (value, signal) => {
    const normalized = index === 4 ? normalizeRequirementNumbers(value, textLanguage) : normalizeRequirementDigits(value);
    if (index === 4 && extractBudget(normalized, data.currency, false)) return normalized;
    if (index === 0) {
      const known = canonicalRequirementServices(normalized, textLanguage) || canonicalRequirementServices(normalized, "en");
      if (known) return known;
    }
    if (index === 1) { const known = canonicalRequirementPorts(normalized); if (known) return known; }
    if (textLanguage === "en") return normalized;
    return normalizeRequirementDigits(await translateRequirementText(normalized, textLanguage, "en", {signal}));
  };

  const canNarrate = typeof window !== "undefined" && Boolean(window.speechSynthesis && window.SpeechSynthesisUtterance);
  useEffect(() => {
    // Start voice discovery while the user reads/types, before they tap Listen.
    // Never enqueue silent speech or request microphone permission to warm it up.
    try { window.speechSynthesis?.getVoices(); } catch { /* Listen can retry. */ }
  }, []);
  const firstQuestion = !reviewing && !returnTo && (describing || questionOrder[0] === index);
  const heading = t(reviewing ? "Review your post" : describing ? "Describe your requirement" : QUESTIONS[index].question);
  const support = t(reviewing ? "Check the details. You can make final changes in the post form." : describing
    ? "Tell us what you need. We’ll ask only for anything missing." : QUESTIONS[index].help);
  const narrationKey = `${language}:${reviewing ? "review" : index}:${returnTo ? "edit" : "answer"}`;
  const promptText = requirementPrompt({ greeting, firstQuestion, heading, support, describing, language });
  const reading = narrationState === "starting" || narrationState === "speaking";

  const narrator = () => {
    if (!narratorRef.current) narratorRef.current = createRequirementNarrator({
      synthesis: window.speechSynthesis, Utterance: window.SpeechSynthesisUtterance,
      onState: setNarrationState, onError: setNarrationError, onVoice: setNarrationVoice
    });
    return narratorRef.current;
  };

  useEffect(() => () => {
    sessionRef.current?.cancel();
    narratorRef.current?.stop();
    requestRef.current?.abort();
  }, []);
  useEffect(() => {
    // Voice is opt-in. After enabling it, read each new question once.
    if (muted) { lastNarratedKey.current = null; return; }
    if (!busy && canNarrate && lastNarratedKey.current !== narrationKey) {
      lastNarratedKey.current = narrationKey;
      setNarrationError("");
      narrator().speak(promptText, {locale});
    }
    return () => narratorRef.current?.stop();
  }, [index, reviewing, muted, language]);

  const toggleMute = () => {
    if (muted) {
      setMuted(false);
      lastNarratedKey.current = narrationKey;
      narrator().speak(promptText, {locale, userInitiated:true});
    } else {
      narratorRef.current?.stop();
      setMuted(true);
      setNarrationError("");
    }
  };

  const readQuestion = () => {
    if (reading) { narratorRef.current?.stop(); return; }
    setMuted(false);
    lastNarratedKey.current = narrationKey;
    const reviewText = reviewing ? `${promptText} ${[2, 0, 1, 3, 4].map(item =>
      `${t(REQUIREMENT_QUESTIONS[item].title)}: ${displayAnswer(item) || t(item === 4 ? "Open to quotations" : "Not specified")}.`).join(" ")}` : promptText;
    narrator().speak(reviewText, {locale, userInitiated:true});
  };
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    bodyRef.current?.scrollTo({ top: 0 });
    // Focus the question rather than opening the phone keyboard automatically.
    headingRef.current?.focus();
  }, [index, reviewing]);

  const stopSpeech = () => {
    narratorRef.current?.stop();
    setNarrationError("");
    sessionRef.current?.cancel();
    sessionRef.current = null;
    setSpeechState("idle");
    setSpeechError("");
  };

  const navigate = (nextIndex, nextData = data) => {
    stopSpeech();
    setIndex(nextIndex);
    const hasTranslatedScope = nextData.scopeOfWork === data.scopeOfWork && previewReady;
    setText(draftsRef.current[nextIndex] ?? (nextIndex === -1 || nextIndex === 2 ? (hasTranslatedScope ? localizedScope : nextData.scopeOfWork) : displayAnswer(nextIndex, nextData)));
    setTextLanguage(draftLanguages.current[nextIndex] || ((nextIndex === -1 || nextIndex === 2) && !hasTranslatedScope ? scopeLanguage : language));
    setError("");
    setReviewing(false);
  };

  const showReview = () => {
    stopSpeech();
    setReviewing(true);
    setReturnTo(null);
    setError("");
  };

  const begin = async (guided = false) => {
    if (busy) return;
    const description = text.trim();
    if (!description && !guided) { setError("Tell us a little about the work you need."); inputRef.current?.focus(); return; }
    const controller = new AbortController();
    requestRef.current = controller;
    setWorking(true);
    setError("");
    try {
      const english = description ? await canonicalInput(description, controller.signal) : "";
      if (controller.signal.aborted) return;
      const extracted = description ? extractRequirement(english, data) : {data, identified:[]};
      if (description) {
        extracted.data.scopeOfWork = description;
        setScopeLanguage(textLanguage);
        const currency = requirementCurrencyHint(description);
        if (currency && extracted.identified.includes("budget")) extracted.data.currency = currency;
      }
      const nextAnswered = [...new Set([...answered, ...extracted.identified])];
      const nextMissing = getMissingQuestions(extracted.data, nextAnswered);
      setData(extracted.data);
      setAnswered(nextAnswered);
      setQuestionOrder(nextMissing);
      setReturnTo(null);
      delete draftsRef.current[-1];
      delete draftLanguages.current[-1];
      if (!nextMissing.length) showReview();
      else { setTrail([-1, nextMissing[0]]); navigate(nextMissing[0], extracted.data); }
    } catch {
      if (!controller.signal.aborted) setError("Translation failed. Your answers are safe. Retry or choose another language.");
    } finally { if (!controller.signal.aborted) setWorking(false); }
  };

  const edit = (editIndex) => {
    if (!reviewing) { draftsRef.current[index] = text; draftLanguages.current[index] = textLanguage; }
    setReturnTo({ reviewing, index, trail });
    navigate(editIndex);
  };

  const back = () => {
    draftsRef.current[index] = text;
    draftLanguages.current[index] = textLanguage;
    if (returnTo) {
      const target = returnTo;
      setReturnTo(null);
      if (target.reviewing) showReview();
      else { setTrail(target.trail); navigate(target.index); }
    } else {
      const previousTrail = trail.slice(0, -1);
      setTrail(previousTrail.length ? previousTrail : [-1]);
      navigate(previousTrail[previousTrail.length - 1] ?? -1);
    }
  };

  const submit = async (event, skip = false) => {
    event?.preventDefault();
    if (busy) return;
    if (describing) { begin(); return; }
    const value = text.trim();
    if (!skip && !value) {
      setError(question.required ? "Please describe the work before continuing." : "Add an answer, or choose the option to leave it open.");
      inputRef.current?.focus();
      return;
    }
    const controller = new AbortController();
    requestRef.current = controller;
    setWorking(true);
    setError("");
    try {
    const parsedValue = skip || index === 2 ? value : await canonicalInput(value, controller.signal);
    if (controller.signal.aborted) return;
    let nextData;
    if (skip) {
      const empty = question.type === "multi-select" ? [] : index === 4
        ? { currency: data.currency, minBudget: "", maxBudget: "" }
        : { isAsap: false, serviceDates: "" };
      nextData = parseAnswer(question.id, empty, data);
    } else if (index === 4) {
      if (/^(?:open (?:to|for) (?:quotes|quotations)|no (?:fixed )?budget|not sure)$/i.test(parsedValue)) {
        nextData = { ...data, minBudget: "", maxBudget: "" };
      } else {
        const budget = extractBudget(parsedValue, requirementCurrencyHint(value) || data.currency, false);
        if (!budget || Number(budget.minBudget) > Number(budget.maxBudget)) {
          setError("Enter an amount or range, such as INR 40,000 – 50,000.");
          inputRef.current?.focus();
          return;
        }
        nextData = { ...data, ...budget, currency:requirementCurrencyHint(value) || budget.currency };
      }
    } else {
      nextData = parseAnswer(question.id, index === 2 ? value : parsedValue, data);
      if (index === 2) setScopeLanguage(textLanguage);
    }
    setData(nextData);
    const nextAnswered = [...new Set([...answered, question.id])];
    setAnswered(nextAnswered);
    delete draftsRef.current[index];
    delete draftLanguages.current[index];
    if (returnTo) {
      const target = returnTo;
      setReturnTo(null);
      if (target.reviewing) showReview();
      else { setTrail(target.trail); navigate(target.index, nextData); }
      return;
    }
    const nextMissing = getMissingQuestions(nextData, nextAnswered);
    if (!nextMissing.length) showReview();
    else {
      setTrail(previousTrail => [...previousTrail, nextMissing[0]]);
      navigate(nextMissing[0], nextData);
    }
    } catch {
      if (!controller.signal.aborted) setError("Translation failed. Your answers are safe. Retry or choose another language.");
    } finally { if (!controller.signal.aborted) setWorking(false); }
  };

  const startVoice = () => {
    if (speechState === "requesting" || speechState === "processing") { stopSpeech(); return; }
    if (speechState === "listening") { sessionRef.current?.stop(); return; }
    if (!Recognition) return;
    narratorRef.current?.stop();
    setNarrationError("");
    setError("");
    setSpeechError("");
    sessionRef.current = startRequirementSpeech({
      Recognition, initialText: text, locale,
      onText: value => { setText(value); setTextLanguage(language); }, onState: setSpeechState, onError: setSpeechError,
      onFinish: () => inputRef.current?.focus()
    });
  };

  const cancel = () => { requestRef.current?.abort(); stopSpeech(); onCancel(); };
  const changeLanguage = event => {
    stopSpeech();
    lastNarratedKey.current = null;
    setNarrationVoice(null);
    setLanguage(event.target.value);
    saveRequirementLanguage(event.target.value);
  };
  const localizedSpeechError = requirementCopy(speechError, language) === speechError && language !== "en"
    ? t("Voice input is unavailable in this browser. You can type your answer.") : t(speechError);
  const localizedNarrationError = requirementCopy(narrationError, language) === narrationError && language !== "en"
    ? t("Couldn’t play the voice-over. Try Listen again, or continue with the text.") : t(narrationError);
  const speechLabel = {
    idle: Recognition ? "Type or use the microphone." : "Voice input is unavailable in this browser. You can type your answer.",
    requesting: "Allow microphone access in your browser to start. Tap again to cancel.",
    listening: "Listening… Tap stop when you’re finished.",
    processing: "Finishing transcription…",
    complete: "Review or edit your answer, then continue.",
    error: localizedSpeechError
  }[speechState];
  const progressIndex = Math.max(0, questionOrder.indexOf(index));

  const renderAnswers = (items) => <dl className="ai-simple-answers">
    {items.map(answerIndex => <div className="ai-simple-answer" key={answerIndex}>
      <div><dt>{t(REQUIREMENT_QUESTIONS[answerIndex].title)}</dt>
        <dd>{displayAnswer(answerIndex) || t(answerIndex === 4 ? "Open to quotations" : "Not specified")}</dd></div>
      <button type="button" className="ai-simple-link" onClick={() => edit(answerIndex)} disabled={working || (!previewReady && answerIndex === 2)} aria-label={`${t("Edit")} ${t(REQUIREMENT_QUESTIONS[answerIndex].title)}`}>{t("Edit")}</button>
    </div>)}
  </dl>;

  return <div className="ai-requirement-container ai-simple" lang={language}>
    <div className="ai-simple-body" ref={bodyRef}>
      <div className="ai-simple-content">
        <div className="ai-simple-meta">
          <span className="ai-simple-eyebrow"><span className="material-symbols-outlined" aria-hidden="true">auto_awesome</span>{t("Post assistant")}</span>
          <div className="ai-simple-preferences">
            <label className="ai-simple-language"><span className="sr-only">{t("Language")}</span>
              <span className="material-symbols-outlined" aria-hidden="true">translate</span>
              <select aria-label={t("Language")} value={language} disabled={working} onChange={changeLanguage}>
                {REQUIREMENT_LANGUAGES.map(item => <option key={item.code} value={item.code}>{item.nativeName}</option>)}
              </select>
            </label>
          <button type="button" className={`ai-simple-audio-toggle ${muted ? "is-muted" : ""}`}
            onClick={toggleMute} disabled={!canNarrate || busy} aria-pressed={!muted}
            aria-label={t(muted ? "Unmute assistant voice" : "Mute assistant voice")}
            title={canNarrate ? "When on, new questions are read aloud automatically using a female voice." : "Read aloud is unavailable in this browser."}>
            <span className="material-symbols-outlined" aria-hidden="true">{muted ? "volume_off" : "volume_up"}</span>
            {t(muted ? "Voice off" : "Voice on")}
          </button>
          </div>
        </div>
        {!describing && !reviewing && !returnTo && <div className="ai-simple-progress-row">
          <span>{questionCount(progressIndex + 1, questionOrder.length, language)}</span>
          <progress className="ai-simple-progress" value={progressIndex + 1} max={Math.max(1, questionOrder.length)} aria-label="Question progress" />
        </div>}
        {(reviewing || returnTo) && <p className="ai-simple-phase">{t(reviewing ? "Final check" : "Edit answer")}</p>}
        <section className="ai-simple-question" aria-labelledby="ai-current-question">
          {firstQuestion && <p className="ai-simple-greeting">{greeting}, {t("let’s get your post ready.")}</p>}
          <h3 id="ai-current-question" ref={headingRef} tabIndex={-1} className="ai-simple-heading">{heading}</h3>
          <p className="ai-simple-support">{support}</p>
          <div className="ai-simple-read-row">
            <button type="button" className="ai-simple-read" onClick={readQuestion} disabled={!canNarrate || busy || (reviewing && !previewReady)}
              aria-label={t(reading ? "Stop reading aloud" : reviewing ? "Listen to post preview" : "Listen to this question")} aria-pressed={reading}>
              <span className="material-symbols-outlined" aria-hidden="true">{reading ? "stop_circle" : "play_circle"}</span>
              {t(reading ? "Stop reading" : reviewing ? "Listen to post" : "Listen")}
            </button>
            <span className={`ai-simple-read-status ${narrationError ? "is-error" : ""}`} role="status" aria-live="polite">
              {narrationError ? localizedNarrationError : !canNarrate ? t("Read aloud is unavailable in this browser.") : narrationState === "starting" ? t("Preparing voice…") : narrationState === "speaking" ? t("Reading aloud…") : narrationVoice ? `${t(narrationVoice.female ? (narrationVoice.natural ? "Natural female voice" : "Female voice") : "Device voice")}${narrationVoice.name ? ` · ${narrationVoice.name}` : ""}` : ""}
            </span>
          </div>
        </section>

        {reviewing ? <>
          {!previewReady && <div className="ai-simple-translation" role="status">
            <p>{t(previewError ? "Translation failed. Your answers are safe. Retry or choose another language." : "Translating…")}</p>
            {previewError && <button type="button" className="ai-simple-link" onClick={() => setTranslationRetry(value => value + 1)}>{t("Retry translation")}</button>}
          </div>}
          {renderAnswers([2, 0, 1, 3, 4])}
          <div className="ai-simple-actions">
            <button type="button" className="ai-simple-link" onClick={() => {
              setReturnTo({ reviewing: true, index, trail });
              navigate(-1);
            }}>{t("Back")}</button>
            <button type="button" className="ai-simple-primary" disabled={!previewReady || busy} onClick={() => { stopSpeech(); onComplete({...data, scopeOfWork:localizedScope}); }}>{t("Generate Post")}<span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span></button>
          </div>
          <p className="ai-simple-caption">{t("Nothing is published yet.")}</p>
        </> : <>
          <form onSubmit={submit} noValidate>
            <div className={`ai-simple-composer ${speechState === "listening" ? "is-listening" : ""} ${error ? "has-error" : ""}`}>
              <label className="sr-only" htmlFor="ai-requirement-answer">{t(describing ? "Describe your requirement" : QUESTIONS[index].question)}</label>
              <textarea id="ai-requirement-answer" ref={inputRef} rows={describing || index === 2 ? 4 : 3}
                placeholder={t(describing ? "e.g. We need 150 MT of fresh water at Mumbai tomorrow, budget around ₹40,000." : QUESTIONS[index].placeholder)}
                value={text} readOnly={busy} aria-invalid={Boolean(error)}
                aria-describedby={`ai-voice-status${error ? " ai-input-error" : ""}`}
                onChange={event => {
                  setText(event.target.value);
                  setTextLanguage(language);
                  setError("");
                  if (speechState === "error") { setSpeechState("idle"); setSpeechError(""); }
                }}
                onKeyDown={event => {
                  if (event.key === "Enter" && (event.ctrlKey || event.metaKey) && !event.nativeEvent.isComposing) submit(event);
                }} />
              <div className="ai-simple-composer-tools">
                <button type="button" className={`ai-simple-mic ${speechBusy ? "is-active" : ""}`} onClick={startVoice}
                  disabled={!Recognition || working} aria-label={t(speechBusy ? "Stop voice input" : "Speak your answer")}
                  aria-pressed={speechBusy} title={Recognition ? "Uses your browser’s speech service. Microphone permission is requested when you start." : "Voice input is unavailable in this browser."}>
                  {speechState === "processing" ? <span className="ai-simple-spinner" aria-hidden="true" />
                    : <span className="material-symbols-outlined" aria-hidden="true">{speechBusy ? "stop" : "mic"}</span>}
                  <span>{t(speechState === "listening" ? "Stop" : speechState === "processing" ? "Processing" : speechState === "requesting" ? "Cancel recording" : "Speak")}</span>
                </button>
                <span className="ai-simple-shortcut">Ctrl / ⌘ + Enter</span>
              </div>
            </div>
            <p id="ai-voice-status" className={`ai-simple-status ${speechState === "error" ? "is-error" : ""}`} role="status" aria-live="polite">{t(working ? "Translating…" : speechLabel)}</p>
            {error && <p id="ai-input-error" className="ai-simple-error" role="alert">{t(error)}</p>}
            <div className="ai-simple-actions">
              {(!describing || returnTo) ? <button type="button" className="ai-simple-link" disabled={working} onClick={back}>{t("Back")}</button>
                : <button type="button" className="ai-simple-cancel" onClick={cancel}>{t("Cancel")}</button>}
              {!describing && !question.required && <button type="button" className="ai-simple-link ai-simple-skip" disabled={busy} onClick={event => submit(event, true)}>{t(index === 4 ? "Open to quotations" : "Skip")}</button>}
              <button type="submit" className="ai-simple-primary" disabled={busy}>
                {t(working ? "Translating…" : returnTo && !describing ? "Save answer" : "Continue")}
                <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
              </button>
            </div>
          </form>
          {describing && !returnTo && <button type="button" className="ai-simple-link ai-simple-guided" disabled={busy} onClick={() => begin(true)}>{t("Use guided questions instead")}</button>}
          {!describing && previous.length > 0 && <details className="ai-simple-history">
            <summary>{t("Your answers")} <span>{previous.length}</span></summary>
            {renderAnswers(previous)}
          </details>}
        </>}
      </div>
    </div>
  </div>;
}
