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

  const messagesEndRef = useRef(null);
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

  // Scroll to bottom of message list on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    <div className="ai-requirement-container flex flex-col h-full min-h-[460px] bg-white rounded-lg border border-blue-50 overflow-hidden shadow-neutral-sm">
      {/* AI Assistant Header / Progress Bar */}
      <div className="ai-header px-6 py-3 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
            AI
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-800 flex items-center gap-1.5">
              <span>AI Form Filling Assistant</span>
              <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                Step {Math.min(currentIndex + 1, REQUIREMENT_QUESTIONS.length)} of {REQUIREMENT_QUESTIONS.length}
              </span>
            </h4>
            <p className="text-[11px] text-zinc-500">
              {currentQ ? currentQ.title : "Completing Form"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-medium text-zinc-500 hover:text-zinc-800 px-2.5 py-1 rounded hover:bg-zinc-200/50 transition-colors border border-zinc-200 bg-white"
        >
          Switch to Manual Form
        </button>
      </div>

      {/* Message Stream */}
      <div className="ai-chat-body flex-1 p-5 overflow-y-auto space-y-4 max-h-[320px] bg-zinc-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "ai" && (
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-semibold shrink-0 mr-2 mt-1">
                AI
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                msg.sender === "user"
                  ? "bg-primary text-white rounded-br-none shadow-sm"
                  : "bg-white text-zinc-800 border border-blue-100 rounded-bl-none shadow-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Interactive Input Area */}
      {!isFinishing && currentQ && (
        <div className="ai-interactive-footer p-4 border-t border-blue-100 bg-white">
          {/* Helper Text */}
          {currentQ.helperText && (
            <p className="text-[11px] text-zinc-400 mb-2">{currentQ.helperText}</p>
          )}

          {/* Type: Multi-Select (Chips for Services / Ports) */}
          {currentQ.type === "multi-select" && currentQ.options && (
            <div className="mb-3 max-h-32 overflow-y-auto flex flex-wrap gap-1.5 p-1 bg-zinc-50 rounded-md border border-zinc-200">
              {currentQ.options.map((opt) => {
                const isSelected = selectedChips.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleChip(opt)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-white border-primary font-medium shadow-xs"
                        : "bg-white text-zinc-700 border-zinc-200 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* Type: Budget Input */}
          {currentQ.type === "budget" && (
            <div className="mb-3 flex flex-wrap items-center gap-2 p-2 bg-zinc-50 rounded-md border border-zinc-200">
              <select
                value={budgetState.currency}
                onChange={(e) => setBudgetState({ ...budgetState, currency: e.target.value })}
                className="text-xs bg-white border border-zinc-300 rounded px-2 py-1.5 text-zinc-700 font-semibold focus:outline-none"
              >
                {currentQ.currencies.map((c) => (
                  <option key={c} value={c}>
                    {c} ({CURRENCY_SYMBOLS[c]})
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1.5 flex-1">
                <input
                  type="number"
                  placeholder="Min Budget"
                  value={budgetState.minBudget}
                  onChange={(e) => setBudgetState({ ...budgetState, minBudget: e.target.value })}
                  className="w-1/2 text-xs bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-blue-500"
                />
                <span className="text-zinc-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max Budget"
                  value={budgetState.maxBudget}
                  onChange={(e) => setBudgetState({ ...budgetState, maxBudget: e.target.value })}
                  className="w-1/2 text-xs bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Type: Timing / Timeline Input */}
          {currentQ.type === "timing" && (
            <div className="mb-3 flex items-center gap-3 p-2 bg-zinc-50 rounded-md border border-zinc-200">
              <button
                type="button"
                onClick={() => setTimelineState({ ...timelineState, isAsap: !timelineState.isAsap })}
                className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border ${
                  timelineState.isAsap
                    ? "bg-danger-500 text-white border-danger-500 shadow-xs"
                    : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100"
                }`}
              >
                <span>⚡ ASAP</span>
                {timelineState.isAsap && <span>(Active)</span>}
              </button>

              <div className="flex-1 flex items-center gap-1.5">
                <span className="text-xs text-zinc-500 whitespace-nowrap">Dates:</span>
                <input
                  type="text"
                  value={timelineState.serviceDates}
                  disabled={timelineState.isAsap}
                  onChange={(e) => setTimelineState({ ...timelineState, serviceDates: e.target.value })}
                  placeholder="DD/MM/YYYY - DD/MM/YYYY"
                  className={`w-full text-xs bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-zinc-800 focus:outline-none ${
                    timelineState.isAsap ? "opacity-50 cursor-not-allowed bg-zinc-100" : "focus:border-blue-500"
                  }`}
                />
              </div>
            </div>
          )}

          {/* Free-form Input + Submit / Continue Buttons */}
          <div className="flex items-center gap-2">
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
                className="flex-1 text-xs sm:text-sm bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-blue-500 focus:bg-white resize-none transition-colors"
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
                placeholder="Or type a custom answer..."
                className="flex-1 text-xs sm:text-sm bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-2 text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            )}

            {!currentQ.required && (
              <button
                type="button"
                onClick={() => handleNext(currentQ.type === "multi-select" ? [] : "")}
                className="text-xs px-3 py-2 text-zinc-500 hover:text-zinc-700 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 font-medium transition-colors"
              >
                Skip
              </button>
            )}

            <button
              type="button"
              onClick={() => handleNext()}
              className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{currentIndex === REQUIREMENT_QUESTIONS.length - 1 ? "Finish & Populate" : "Next"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
