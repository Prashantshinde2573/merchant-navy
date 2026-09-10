import React, { useState, useEffect, useRef } from "react";
import { REQUIREMENT_QUESTIONS, parseAnswer } from "../../services/requirementAI";
import "./PostRequirementAI.css";

const CURRENCY_SYMBOLS = {
  USD: "$",
  INR: "₹",
  AED: "AED ",
  EUR: "€",
  GBP: "£"
};

export function PostRequirementAI({ initialData, onComplete, onCancel }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({
    scopeOfWork: initialData?.scopeOfWork || "",
    selectedServices: initialData?.selectedServices || [],
    selectedPorts: initialData?.selectedPorts || [],
    currency: initialData?.currency || "USD",
    minBudget: initialData?.minBudget || "",
    maxBudget: initialData?.maxBudget || "",
    isAsap: initialData?.isAsap || false,
    serviceDates: initialData?.serviceDates || "09/09/2026 - 09/09/2026"
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
    serviceDates: initialData?.serviceDates || "09/09/2026 - 09/09/2026"
  });
  const [isFinishing, setIsFinishing] = useState(false);

  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);

  const currentQ = REQUIREMENT_QUESTIONS[currentIndex];

  // Initialize conversation with the first question
  useEffect(() => {
    const firstQ = REQUIREMENT_QUESTIONS[0];
    setMessages([
      {
        id: "ai-0",
        sender: "ai",
        text: `Hello! I will help you quickly fill out your requirement step by step.\n\n${firstQ.question}`
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

    if (currentQ.type === "multi-select") {
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
        serviceDates: formData.serviceDates || "09/09/2026 - 09/09/2026"
      });
      setTextInput("");
    } else {
      setTextInput(formData.scopeOfWork || "");
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [currentIndex]);

  const handleNext = (customValue = null) => {
    if (!currentQ || isFinishing) return;

    let userDisplayVal = "";
    let parsedVal = null;

    if (currentQ.type === "multi-select") {
      const vals = customValue || selectedChips;
      if (currentQ.required && vals.length === 0 && !textInput.trim()) {
        alert("Please select at least one option or type your answer.");
        return;
      }
      userDisplayVal = vals.length > 0 ? vals.join(", ") : textInput.trim() || "Skipped";
      parsedVal = vals.length > 0 ? vals : textInput.trim();
    } else if (currentQ.type === "budget") {
      if (customValue) {
        parsedVal = customValue;
        userDisplayVal = `${customValue.currency} ${customValue.minBudget || "0"} - ${customValue.maxBudget || "0"}`;
      } else if (budgetState.minBudget || budgetState.maxBudget) {
        parsedVal = budgetState;
        userDisplayVal = `${budgetState.currency} ${budgetState.minBudget || "0"} - ${budgetState.maxBudget || "0"}`;
      } else if (textInput.trim()) {
        parsedVal = textInput.trim();
        userDisplayVal = textInput.trim();
      } else {
        parsedVal = { currency: "USD", minBudget: "", maxBudget: "" };
        userDisplayVal = "Open for quotations / Not specified";
      }
    } else if (currentQ.type === "timing") {
      if (customValue) {
        parsedVal = customValue;
        userDisplayVal = customValue.isAsap ? "ASAP (Urgent)" : customValue.serviceDates;
      } else if (timelineState.isAsap) {
        parsedVal = { isAsap: true, serviceDates: timelineState.serviceDates };
        userDisplayVal = "ASAP (Urgent Requirement)";
      } else if (textInput.trim()) {
        parsedVal = textInput.trim();
        userDisplayVal = textInput.trim();
      } else {
        parsedVal = { isAsap: false, serviceDates: timelineState.serviceDates };
        userDisplayVal = timelineState.serviceDates;
      }
    } else {
      // Textarea / text
      const val = (customValue !== null ? customValue : textInput).trim();
      if (currentQ.required && !val) {
        alert("This field is required. Please provide a description.");
        return;
      }
      parsedVal = val;
      userDisplayVal = val || "Skipped";
    }

    // Update accumulated form data
    const updatedData = parseAnswer(currentQ.id, parsedVal, formData);
    setFormData(updatedData);

    // Append user message
    const newMessages = [
      ...messages,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: userDisplayVal
      }
    ];

    const nextIndex = currentIndex + 1;

    if (nextIndex < REQUIREMENT_QUESTIONS.length) {
      const nextQ = REQUIREMENT_QUESTIONS[nextIndex];
      newMessages.push({
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: nextQ.question
      });
      setMessages(newMessages);
      setCurrentIndex(nextIndex);
    } else {
      // Completed all questions
      setIsFinishing(true);
      newMessages.push({
        id: `ai-finish-${Date.now()}`,
        sender: "ai",
        text: "✨ Perfect! All details have been gathered. Populating the form now so you can review and make any final edits before publishing..."
      });
      setMessages(newMessages);

      setTimeout(() => {
        onComplete(updatedData);
      }, 1200);
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
                AI Form Filling Assistant
              </h3>
              <span className="text-tiny font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 leading-none">
                Step {Math.min(currentIndex + 1, REQUIREMENT_QUESTIONS.length)} of {REQUIREMENT_QUESTIONS.length}
              </span>
            </div>
            <p className="text-modified-13 text-zinc-500">
              {currentQ ? currentQ.title : "Completing Form"}
            </p>
          </div>
        </div>
      </div>

      {/* Message Stream — ONLY THIS AREA SCROLLS */}
      <div
        ref={chatBodyRef}
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
        <div className="ai-interactive-footer p-4 sm:p-6 border-t border-default-100 bg-content1 space-y-3 sm:space-y-3.5 shrink-0">
          {/* Helper Text */}
          {currentQ.helperText && (
            <p className="text-modified-13 text-zinc-500 px-1">{currentQ.helperText}</p>
          )}

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
                ref={inputRef}
                rows={2}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleNext();
                  }
                }}
                placeholder={currentQ.placeholder || "Type your response here..."}
                className="w-full text-small bg-content1 border border-foreground-200 rounded-lg p-3 sm:p-3 text-default-foreground placeholder:text-zinc-500 focus:outline-none focus:border-primary resize-none transition-colors leading-relaxed"
              />
            ) : (
              <input
                ref={inputRef}
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleNext();
                  }
                }}
                placeholder={currentQ.placeholder || "Or type a custom answer..."}
                className="w-full text-small bg-content1 border border-foreground-200 rounded-lg px-4 sm:px-3.5 py-2.5 sm:py-2 text-default-foreground placeholder:text-zinc-500 focus:outline-none focus:border-primary transition-colors h-10"
              />
            )}

            {/* Skip & Next Action Buttons matching Manual Form */}
            <div className="flex items-center justify-between gap-3 pt-1">
              {!currentQ.required ? (
                <button
                  type="button"
                  onClick={() => handleNext(currentQ.type === "multi-select" ? [] : "")}
                  className="px-4 min-w-18 sm:min-w-20 h-10 text-small font-normal rounded-medium bg-default text-default-foreground hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center"
                >
                  Skip
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={() => handleNext()}
                className="px-5 min-w-20 h-10 text-small font-semibold rounded-medium bg-primary text-primary-foreground hover:opacity-80 transition-opacity shadow-sm flex items-center justify-center gap-2 cursor-pointer ml-auto"
              >
                <span>{currentIndex === REQUIREMENT_QUESTIONS.length - 1 ? "Finish & Populate" : "Next"}</span>
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
          </div>
        </div>
      )}
    </div>
  );
}
