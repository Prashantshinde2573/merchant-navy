import React, { useState, useEffect, useRef } from "react";
import { REQUIREMENT_QUESTIONS, parseAnswer, extractRequirement, extractBudget, getMissingQuestions } from "../../services/requirementAI";
import "./PostRequirementAI.css";

const CURRENCY_SYMBOLS = {
  USD: "$",
  INR: "₹",
  AED: "AED ",
  EUR: "€",
  GBP: "£"
};

export function PostRequirementAI({ initialData, onComplete, onCancel }) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [answered, setAnswered] = useState([]);
  const [followUpSteps, setFollowUpSteps] = useState([]);
  const [visitedSteps, setVisitedSteps] = useState([]);
  const [description, setDescription] = useState(initialData?.scopeOfWork || "");
  const [extractedLabels, setExtractedLabels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({
    scopeOfWork: initialData?.scopeOfWork || "",
    selectedServices: initialData?.selectedServices || [],
    selectedPorts: initialData?.selectedPorts || [],
    currency: initialData?.currency || "USD",
    minBudget: initialData?.minBudget || "",
    maxBudget: initialData?.maxBudget || "",
    isAsap: initialData?.isAsap || false,
    serviceDates: initialData?.serviceDates === "09/09/2026 - 09/09/2026" && !initialData?.scopeOfWork ? "" : initialData?.serviceDates || ""
  });

  // Current answer input state
  const [textInput, setTextInput] = useState("");
  const [selectedChips, setSelectedChips] = useState([]);
  const [budgetState, setBudgetState] = useState({
    currency: initialData?.currency || "USD",
    minBudget: initialData?.minBudget || "",
    maxBudget: initialData?.maxBudget || ""
  });
  const [timelineState, setTimelineState] = useState({
    isAsap: initialData?.isAsap || false,
    serviceDates: initialData?.serviceDates === "09/09/2026 - 09/09/2026" && !initialData?.scopeOfWork ? "" : initialData?.serviceDates || ""
  });
  const [isFinishing, setIsFinishing] = useState(false);
  const [editingReview, setEditingReview] = useState(false);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechStatus, setSpeechStatus] = useState("");
  const recognitionRef = useRef(null);
  const SpeechRecognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const stopListening = () => {
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    if (recognition) recognition.abort();
    setIsListening(false);
  };

  useEffect(() => () => {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onend = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.abort();
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;
    const original = textInput.trim();
    recognitionRef.current = recognition;
    setIsListening(true);
    setSpeechStatus("Listening… Speak your answer, then review the text below.");
    recognition.onresult = (event) => {
      if (recognitionRef.current !== recognition) return;
      const transcript = Array.from(event.results).map(result => result[0].transcript).join(" ");
      setTextInput([original, transcript].filter(Boolean).join(" "));
    };
    recognition.onerror = (event) => {
      if (recognitionRef.current !== recognition) return;
      const explanations = {
        "not-allowed": "Microphone access was denied. Allow it in your browser settings or type your answer.",
        "audio-capture": "No microphone is available. Connect one or type your answer.",
        "no-speech": "No speech detected. Try again or type your answer.",
        network: "Speech recognition could not connect. Try again or type your answer."
      };
      setSpeechStatus(explanations[event.error] || "Voice input stopped. You can try again or type your answer.");
      recognitionRef.current = null;
      setIsListening(false);
    };
    recognition.onend = () => {
      if (recognitionRef.current !== recognition) return;
      recognitionRef.current = null;
      setIsListening(false);
      setSpeechStatus("Voice input finished. Review or edit your answer before continuing.");
      inputRef.current?.focus();
    };
    try { recognition.start(); }
    catch {
      recognitionRef.current = null;
      setIsListening(false);
      setSpeechStatus("Could not start voice input. Try again or type your answer.");
    }
  };

  const editStep = (index) => {
    stopListening();
    setError("");
    setSpeechStatus("");
    setEditingReview(isFinishing || editingReview);
    setIsFinishing(false);
    setMessages([{ id: `ai-edit-${index}`, sender: "ai", text: REQUIREMENT_QUESTIONS[index].question }]);
    setCurrentIndex(index);
  };

  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);

  const isDescribing = currentIndex === -1 && !isFinishing;
  const currentQ = currentIndex === -1 ? {
    id: "description", title: "Describe your requirement", type: "textarea", required: true,
    question: "What do you need? Describe the work in your own words. I’ll pick out the details and only ask for what’s missing.",
    placeholder: "e.g. We need 150 MT of fresh water at Mumbai tomorrow, budget around ₹40,000.",
    helperText: "Include the work, port, timing and budget if you know them. A short description is enough to start."
  } : REQUIREMENT_QUESTIONS[currentIndex];

  const startDescription = () => {
    const value = textInput.trim();
    if (!value) { setError("Describe the work you need, or choose the guided questions below."); return; }
    stopListening();
    const { data, identified } = extractRequirement(value, formData);
    const missing = getMissingQuestions(data, identified);
    setFormData(data);
    setDescription(value);
    setAnswered(identified);
    setFollowUpSteps(missing);
    setExtractedLabels(REQUIREMENT_QUESTIONS.filter(question => identified.includes(question.id)).map(question => question.title));
    setVisitedSteps(missing.length ? [missing[0]] : []);
    setMessages([
      { id: "description-answer", sender: "user", text: value },
      { id: "extraction-result", sender: "ai", text: missing.length
        ? `I’ve added the details I recognised. Just ${missing.length} ${missing.length === 1 ? "question" : "questions"} to fill in the gaps.\n\n${REQUIREMENT_QUESTIONS[missing[0]].question}`
        : "I’ve picked out the key details. Please check the draft below before using it." }
    ]);
    setError("");
    if (missing.length) setCurrentIndex(missing[0]);
    else setIsFinishing(true);
  };

  const startGuided = () => {
    stopListening();
    // Keep a description entered before switching to the guided alternative.
    const data = { ...formData, scopeOfWork: textInput.trim() || formData.scopeOfWork };
    const missing = getMissingQuestions(data);
    setFormData(data);
    setDescription(data.scopeOfWork);
    setFollowUpSteps(missing);
    setVisitedSteps(missing.length ? [missing[0]] : []);
    if (missing.length) {
      setMessages([{ id: "guided-start", sender: "ai", text: REQUIREMENT_QUESTIONS[missing[0]].question }]);
      setCurrentIndex(missing[0]);
    } else setIsFinishing(true);
  };

  const reviseDescription = () => {
    stopListening();
    setIsFinishing(false);
    setEditingReview(false);
    setCurrentIndex(-1);
    setMessages([{ id: "description-revise", sender: "ai", text: "Update your description. I’ll check it again, keeping other details unless your description replaces them." }]);
  };

  // Initialize conversation with the first question
  useEffect(() => {
    const firstQ = currentQ;
    setMessages([
      {
        id: "ai-0",
        sender: "ai",
        text: firstQ.question
      }
    ]);
  }, []);

  // Scroll to bottom of message list on new messages (contained inside chat container only)
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, currentIndex]);

  // Sync active question input state
  useEffect(() => {
    if (!currentQ) return;

    if (currentIndex === -1) {
      setTextInput(description);
    } else if (currentQ.type === "multi-select") {
      const existing = currentQ.field === "selectedServices"
        ? formData.selectedServices
        : formData.selectedPorts;
      setSelectedChips(existing || []);
      setTextInput("");
    } else if (currentQ.type === "budget") {
      setBudgetState({
        currency: formData.currency || "USD",
        minBudget: formData.minBudget || "",
        maxBudget: formData.maxBudget || ""
      });
      setTextInput("");
    } else if (currentQ.type === "timing") {
      setTimelineState({
        isAsap: formData.isAsap || false,
        serviceDates: formData.serviceDates || ""
      });
      setTextInput("");
    } else {
      setTextInput(formData.scopeOfWork || "");
    }

    setError("");
    setSpeechStatus("");
  }, [currentIndex, isFinishing]);

  const handleNext = (customValue = null, skip = false) => {
    if (!currentQ || isFinishing || isListening) return;
    if (currentIndex === -1) { startDescription(); return; }

    stopListening();
    setError("");
    let userDisplayVal = "";
    let parsedVal = null;

    if (skip) {
      parsedVal = currentQ.type === "multi-select" ? [] : currentQ.type === "budget"
        ? { currency: formData.currency, minBudget: "", maxBudget: "" }
        : { isAsap: false, serviceDates: "" };
      userDisplayVal = currentQ.type === "budget" ? "Open for quotations" : "Not specified";
    } else if (currentQ.type === "multi-select") {
      const typed = textInput.trim() ? parseAnswer(currentQ.id, textInput, formData)[currentQ.field] : [];
      const vals = [...new Set([...selectedChips, ...typed])];
      userDisplayVal = vals.join(", ") || "Not specified";
      parsedVal = vals;
    } else if (currentQ.type === "budget") {
      if (customValue) {
        parsedVal = customValue;
        userDisplayVal = `${customValue.currency} ${customValue.minBudget || "0"} - ${customValue.maxBudget || "0"}`;
      } else if (textInput.trim()) {
        parsedVal = textInput.trim();
        userDisplayVal = textInput.trim();
      } else if (budgetState.minBudget || budgetState.maxBudget) {
        parsedVal = budgetState;
        userDisplayVal = `${budgetState.currency} ${budgetState.minBudget || "0"} - ${budgetState.maxBudget || "0"}`;
      } else {
        parsedVal = { currency: budgetState.currency, minBudget: "", maxBudget: "" };
        userDisplayVal = "Open for quotations / Not specified";
      }
    } else if (currentQ.type === "timing") {
      if (customValue) {
        parsedVal = customValue;
        userDisplayVal = customValue.isAsap ? "ASAP (Urgent)" : customValue.serviceDates;
      } else if (textInput.trim()) {
        parsedVal = textInput.trim();
        userDisplayVal = textInput.trim();
      } else if (timelineState.isAsap) {
        parsedVal = { isAsap: true, serviceDates: timelineState.serviceDates };
        userDisplayVal = "ASAP (Urgent Requirement)";
      } else {
        parsedVal = { isAsap: false, serviceDates: timelineState.serviceDates };
        userDisplayVal = timelineState.serviceDates;
      }
    } else {
      // Textarea / text
      const val = (customValue !== null ? customValue : textInput).trim();
      if (currentQ.required && !val) {
        setError("Please describe the work needed before continuing.");
        return;
      }
      parsedVal = val;
      userDisplayVal = val || "Skipped";
    }

    // Update accumulated form data
    const updatedData = parseAnswer(currentQ.id, parsedVal, currentQ.type === "budget" ? { ...formData, currency: budgetState.currency } : formData);
    if (currentQ.type === "budget" && !skip) {
      const { minBudget, maxBudget } = updatedData;
      if ((textInput.trim() && !extractBudget(textInput, budgetState.currency, false)) ||
          [minBudget, maxBudget].some(value => value !== "" && (!Number.isFinite(Number(value)) || Number(value) < 0)) ||
          (minBudget !== "" && maxBudget !== "" && Number(minBudget) > Number(maxBudget))) {
        setError("Enter a valid budget with a maximum greater than or equal to the minimum, or skip for quotations.");
        return;
      }
    }
    setFormData(updatedData);
    const nextAnswered = [...new Set([...answered, currentQ.id])];
    setAnswered(nextAnswered);
    if (editingReview) {
      setIsFinishing(true);
      setEditingReview(false);
      return;
    }

    // Append user message
    const newMessages = [
      ...messages,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: userDisplayVal
      }
    ];

    const missing = getMissingQuestions(updatedData, nextAnswered);
    if (missing.length) {
      const nextIndex = missing[0];
      newMessages.push({ id: `ai-${Date.now()}`, sender: "ai", text: REQUIREMENT_QUESTIONS[nextIndex].question });
      setVisitedSteps(previous => [...previous, nextIndex]);
      setMessages(newMessages);
      setCurrentIndex(nextIndex);
    } else {
      setIsFinishing(true);
      setMessages(newMessages);
    }
  };

  const toggleChip = (item) => {
    setSelectedChips((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="ai-requirement-container flex flex-col h-full w-full min-h-0 bg-content1 overflow-hidden">
      {/* AI Assistant Header / Progress Bar */}
      <div className="ai-header px-4 sm:px-6 py-3.5 bg-content1 border-b border-default-100 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
            AI
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-content1-foreground text-base leading-6 font-semibold">
                Create with AI
              </h3>
              <span className="text-tiny font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 leading-none">
                {isFinishing ? "Review" : isDescribing ? "Start here" : editingReview ? "Edit answer" : `Question ${Math.max(1, followUpSteps.indexOf(currentIndex) + 1)} of ${followUpSteps.length}`}
              </span>
            </div>
            <p className="text-modified-13 text-zinc-500">
              {isFinishing ? "Review your requirement" : currentQ?.title}
            </p>
          </div>
        </div>
      </div>

      {!isDescribing && <div className="ai-step-track" aria-label="Requirement progress">
        {REQUIREMENT_QUESTIONS.map((question, index) => (
          <button type="button" key={question.id} disabled={!isFinishing && index !== currentIndex && !answered.includes(question.id) && getMissingQuestions(formData, answered).includes(index)}
            aria-current={!isFinishing && index === currentIndex ? "step" : undefined}
            className={isFinishing || index === currentIndex || !getMissingQuestions(formData, answered).includes(index) ? "is-active" : ""}
            onClick={() => editStep(index)}>{!getMissingQuestions(formData, answered).includes(index) ? "✓ " : ""}{question.title}</button>
        ))}
      </div>}
      {!isDescribing && !isFinishing && extractedLabels.length > 0 && <div className="ai-extracted-summary" role="status">
        <span>Added from your description: {extractedLabels.join(" · ")}</span>
      </div>}
      {isFinishing && <div className="ai-review">
        <h3>Your requirement draft</h3>
        <p>Check the details and edit anything we missed. Nothing is published until you confirm in the post form.</p>
        <div className="ai-draft-heading"><span>Post preview · Scope of work</span><button type="button" onClick={() => editStep(2)}>Edit draft</button></div>
        <div className="ai-draft-preview">{formData.scopeOfWork}</div>
        {REQUIREMENT_QUESTIONS.map((question, index) => {
          const value = question.type === "multi-select" ? formData[question.field].join(", ")
            : question.id === "scopeOfWork" ? formData.scopeOfWork
            : question.id === "timeline" ? (formData.isAsap ? "ASAP • Urgent" : formData.serviceDates)
            : (formData.minBudget || formData.maxBudget) ? `${formData.currency} ${formData.minBudget || "0"} – ${formData.maxBudget || "Not specified"}` : "Open for quotations";
          if (question.id === "scopeOfWork") return null;
          return <div className="ai-review-row" key={question.id}><div><strong>{question.title}</strong><p>{value || "Not specified"}</p></div>
            <button type="button" onClick={() => editStep(index)} aria-label={`Edit ${question.title}`}>Edit</button></div>;
        })}

        <button type="button" className="ai-restart-button" onClick={reviseDescription}>Update original description</button>
      </div>}
      {isFinishing && (
        <div className="ai-review-actions ai-sticky-actions">
          <button type="button" className="ai-cancel-button" onClick={onCancel}>Cancel</button>
          <button type="button" className="ai-primary-action" onClick={() => onComplete(formData)}>Use this draft</button>
        </div>
      )}
      {/* Message Stream — ONLY THIS AREA SCROLLS */}
      <div
        ref={chatBodyRef}
        hidden={isFinishing}
        className="ai-chat-body flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-3.5 bg-blue-25/40"
      >
        {messages.map((msg, index) => {
          const isLatest = index === messages.length - 1;
          const isAI = msg.sender === "ai";

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAI ? "items-start" : "items-end"}`}
            >
              {/* Sender Label */}
              <div className={`text-tiny font-medium mb-1.5 px-1 flex items-center gap-1.5 ${isAI ? "text-blue-700 font-semibold" : "text-zinc-500 pr-1.5 sm:pr-2.5"}`}>
                {isAI ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
                    <span>AI Assistant</span>
                  </>
                ) : (
                  <span>You</span>
                )}
              </div>

              {/* Message Bubble */}
              <div className={`flex ${isAI ? "justify-start" : "justify-end pr-1 sm:pr-2"} w-full`}>
                <div
                  className={`ai-message-bubble max-w-[88%] sm:max-w-[82%] rounded-lg text-small leading-relaxed whitespace-pre-wrap break-words box-border ${
                    isAI
                      ? `ai-bubble ${
                          isLatest
                            ? "bg-content1 text-content1-foreground border border-foreground-200 shadow-neutral-sm font-medium"
                            : "bg-default-100 text-default-600 border border-default-200"
                        } px-4.5 py-3.5 sm:px-5 sm:py-4`
                      : "user-bubble bg-primary text-primary-foreground font-medium shadow-xs px-4 py-3 sm:px-5 sm:py-3.5"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Input Area — FIXED AT BOTTOM OF AI SECTION */}
      {!isFinishing && currentQ && (
        <>
        <div className="ai-interactive-footer p-4 sm:p-6 border-t border-default-100 bg-content1 space-y-3 sm:space-y-3.5 shrink-0">
          {isDescribing && <div className="ai-description-examples">
            <span>Try an example</span>
            <button type="button" disabled={isListening} onClick={() => setTextInput("We need 150 MT of fresh water at Mumbai tomorrow, budget around ₹40,000.")}>Fresh water delivery</button>
            <button type="button" disabled={isListening} onClick={() => setTextInput("Hull cleaning and propeller polishing at Vizag, ASAP. Open for quotations.")}>Hull cleaning</button>
          </div>}
          {/* Helper Text */}
          {currentQ.helperText && (
            <p className="text-modified-13 text-zinc-500 px-1">{currentQ.helperText}</p>
          )}

          {(currentQ.type === "budget" || currentQ.type === "timing") &&
            <p className="ai-feedback">A typed or spoken answer below takes priority over the fields above.</p>}

          {/* Type: Multi-Select (Compact Controlled Selector for Services / Ports) */}
          {currentQ.type === "multi-select" && currentQ.options && (
            <div className="flex flex-col gap-2">
              {/* Selected Pills Summary Bar on mobile when items are selected */}
              {selectedChips.length > 0 && (
                <div className="flex items-center justify-between text-xs text-blue-700 bg-blue-50 px-3 py-2 rounded-md border border-blue-100">
                  <span className="font-semibold truncate">Selected ({selectedChips.length}): {selectedChips.join(", ")}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedChips([])}
                    className="text-zinc-500 hover:text-red-600 font-medium ml-2 cursor-pointer underline text-[11px] shrink-0"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Contained chips container with controlled max-height & smooth internal scrolling */}
              <div className="ai-chips-box max-h-28 sm:max-h-44 overflow-y-auto flex flex-wrap gap-2 sm:gap-2.5 p-3 sm:p-4 bg-content1 rounded-lg border border-foreground-200">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedChips.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => toggleChip(opt)}
                      className={`text-xs px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full border transition-all cursor-pointer font-medium leading-normal inline-flex items-center gap-1.5 sm:gap-2 break-words text-left max-w-full ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
                          : "bg-white text-default-700 border-default-200 hover:border-blue-300 hover:bg-blue-50/40 hover:text-blue-700"
                      }`}
                    >
                      <span className="font-bold text-xs shrink-0">{isSelected ? "✓" : "+"}</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Type: Budget Input */}
          {currentQ.type === "budget" && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 bg-content1 rounded-lg border border-foreground-200">
              <select
                aria-label="Budget currency"
                value={budgetState.currency}
                onChange={(e) => setBudgetState({ ...budgetState, currency: e.target.value })}
                className="text-xs bg-white border border-blue-100 rounded-medium px-3 py-2 text-foreground-500 font-medium focus:outline-none focus:border-primary w-full sm:w-auto cursor-pointer h-10 shadow-xs"
              >
                {currentQ.currencies.map((c) => (
                  <option key={c} value={c}>
                    {c} ({CURRENCY_SYMBOLS[c]})
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="relative w-1/2 min-w-0 inline-flex items-center shadow-xs px-3 h-10 rounded-large border border-blue-100 bg-white">
                  <span className="text-foreground-500 text-sm font-medium mr-1.5">{CURRENCY_SYMBOLS[budgetState.currency]}</span>
                  <input
                    type="number"
                    aria-label="Minimum budget"
                    min="0"
                    placeholder="MIN"
                    value={budgetState.minBudget}
                    onChange={(e) => setBudgetState({ ...budgetState, minBudget: e.target.value })}
                    className="w-full bg-transparent outline-none border-0 text-sm text-default-foreground font-medium placeholder:text-zinc-500"
                  />
                </div>
                <span className="text-zinc-400 text-xs shrink-0 font-medium">-</span>
                <div className="relative w-1/2 min-w-0 inline-flex items-center shadow-xs px-3 h-10 rounded-large border border-blue-100 bg-white">
                  <span className="text-foreground-500 text-sm font-medium mr-1.5">{CURRENCY_SYMBOLS[budgetState.currency]}</span>
                  <input
                    type="number"
                    aria-label="Maximum budget"
                    min="0"
                    placeholder="MAX"
                    value={budgetState.maxBudget}
                    onChange={(e) => setBudgetState({ ...budgetState, maxBudget: e.target.value })}
                    className="w-full bg-transparent outline-none border-0 text-sm text-default-foreground font-medium placeholder:text-zinc-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Type: Timing / Timeline Input */}
          {currentQ.type === "timing" && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 bg-content1 rounded-lg border border-foreground-200">
              {/* ASAP Switch matching Manual Form */}
              <label className="group relative max-w-fit inline-flex items-center justify-start cursor-pointer select-none shrink-0" data-selected={timelineState.isAsap}>
                <input
                  aria-label="ASAP"
                  role="switch"
                  className="sr-only"
                  type="checkbox"
                  checked={timelineState.isAsap}
                  onChange={(e) => setTimelineState({ ...timelineState, isAsap: e.target.checked })}
                />
                <span
                  aria-hidden="true"
                  className={`px-1 relative inline-flex items-center justify-start shrink-0 overflow-hidden rounded-full w-12 h-7 transition-background ${timelineState.isAsap ? "bg-primary" : "bg-default-200"}`}
                >
                  <span
                    className={`z-10 flex items-center justify-center bg-white shadow-small rounded-full w-5 h-5 transition-all ${timelineState.isAsap ? "ms-5" : "ms-0"}`}
                  ></span>
                </span>
                <span className="relative text-foreground select-none ms-2 text-small font-medium">ASAP</span>
              </label>

              {!timelineState.isAsap && (
                <div className="flex-1 flex items-center gap-2.5 min-w-0">
                  <div className="relative w-full inline-flex items-center shadow-xs px-3 h-10 rounded-medium bg-default-100 hover:bg-default-200 transition-colors">
                    <input
                      type="text"
                      aria-label="Service dates"
                      value={timelineState.serviceDates}
                      onChange={(e) => setTimelineState({ ...timelineState, serviceDates: e.target.value })}
                      placeholder="DD/MM/YYYY - DD/MM/YYYY"
                      className="w-full bg-transparent outline-none border-0 text-small text-default-foreground"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground-400 shrink-0">
                      <path d="M8 2v4"></path>
                      <path d="M16 2v4"></path>
                      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                      <path d="M3 10h18"></path>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Free-form Input + Actions */}
          <div className="space-y-3 sm:space-y-3.5">
            {currentQ.type === "textarea" ? (
              <textarea
                aria-label={`Answer: ${currentQ.title}`}
                aria-describedby="ai-answer-feedback"
                ref={inputRef}
                rows={isDescribing ? 4 : 2}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && !e.nativeEvent.isComposing && !isListening) {
                    e.preventDefault();
                    handleNext();
                  }
                }}
                placeholder={currentQ.placeholder || "Type your response here..."}
                className="w-full text-small bg-content1 border border-foreground-200 rounded-lg p-3 sm:p-3 text-default-foreground placeholder:text-zinc-500 focus:outline-none focus:border-primary resize-none transition-colors leading-relaxed"
              />
            ) : (
              <input
                aria-label={`Answer: ${currentQ.title}`}
                aria-describedby="ai-answer-feedback"
                ref={inputRef}
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing && !isListening) {
                    e.preventDefault();
                    handleNext();
                  }
                }}
                placeholder={currentQ.placeholder || "Or type a custom answer..."}
                className="w-full text-small bg-content1 border border-foreground-200 rounded-lg px-4 sm:px-3.5 py-2.5 sm:py-2 text-default-foreground placeholder:text-zinc-500 focus:outline-none focus:border-primary transition-colors h-10"
              />
            )}

            <div className="ai-voice-row">
              <button type="button" className={`ai-voice-button ${isListening ? "is-listening" : ""}`}
                disabled={!SpeechRecognition} aria-pressed={isListening} onClick={toggleListening}
                aria-label={isListening ? "Stop voice input" : "Speak your answer"}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/></svg>
                {isListening ? "Stop listening" : "Speak answer"}
              </button>
              <span>Type or speak · Review before sending</span>
            </div>
            <p id="ai-answer-feedback" className="ai-feedback" role="status" aria-live="polite">
              {speechStatus || (!SpeechRecognition ? "Voice input is unavailable in this browser. You can type your answer." : "Voice input uses your browser’s speech service. Microphone access is requested when you start.")}
            </p>
            {error && <p className="ai-error" role="alert">{error}</p>}

          </div>
        </div>
            <div className="ai-answer-actions ai-sticky-actions flex items-center gap-3">
              <button type="button" className="ai-cancel-button" onClick={onCancel}>Cancel</button>
              {!isDescribing && !editingReview && <button type="button" className="ai-back-button" onClick={() => {
                if (visitedSteps.length > 1) {
                  const previous = visitedSteps.slice(0, -1);
                  setVisitedSteps(previous);
                  editStep(previous[previous.length - 1]);
                } else reviseDescription();
              }}>Back</button>}
              {isDescribing && <button type="button" className="ai-back-button ai-guided-button" disabled={isListening} onClick={startGuided}>Use guided questions</button>}
              {!currentQ.required ? (
                <button
                  type="button"
                  onClick={() => handleNext(null, true)}
                  className="px-4 min-w-18 sm:min-w-20 h-10 text-small font-normal rounded-medium bg-default text-default-foreground hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center"
                >
                  Skip
                </button>
              ) : null}

              <button
                type="button"
                disabled={isListening}
                onClick={() => handleNext()}
                className="ai-continue-button px-5 min-w-20 h-10 text-small font-semibold rounded-medium bg-primary text-primary-foreground hover:opacity-80 transition-opacity shadow-sm flex items-center justify-center gap-2 cursor-pointer ml-auto"
              >
                <span>{isDescribing ? "Build my draft" : editingReview ? "Save answer" : getMissingQuestions(formData, [...answered, currentQ.id]).length === 0 ? "Review draft" : "Continue"}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
        </>
      )}
    </div>
  );
}
