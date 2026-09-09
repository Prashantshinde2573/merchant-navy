import React, { useState, useRef } from "react";
import "./PostModal.css";

const CURRENCY_SYMBOLS = {
  USD: "$",
  INR: "₹",
  AED: "AED ",
  EUR: "€",
  GBP: "£"
};

const AVAILABLE_SERVICES = [
  "Ship Chandlering",
  "Bunker Supply",
  "Fresh Water Supply",
  "Underwater Hull Cleaning",
  "Propeller Polishing",
  "Waste Disposal",
  "Crew Transfer",
  "Canal Transit Agency Support",
  "Cash to Master (CTM) Coordination",
  "Compressed Air Utility",
  "Sea Chest Grating Inspection",
  "Zinc Anode Inspection"
];

const AVAILABLE_PORTS = [
  "Chennai",
  "Mumbai",
  "Visakhapatnam (Vizag)",
  "Cochin",
  "Kolkata",
  "Jawaharlal Nehru Port (JNPT)",
  "Kandla",
  "Paradip",
  "Tuticorin",
  "Mormugao",
  "Mangalore",
  "Dubai (UAE)",
  "Singapore",
  "Rotterdam",
  "Fujairah"
];

export function PostModal({ isOpen, onClose, onPostCreated }) {
  const [scopeOfWork, setScopeOfWork] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [isAsap, setIsAsap] = useState(false);
  const [serviceDates, setServiceDates] = useState("09/09/2026 - 09/09/2026");
  const [selectedServices, setSelectedServices] = useState([]);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [selectedPorts, setSelectedPorts] = useState([]);
  const [isPortsOpen, setIsPortsOpen] = useState(false);
  const [files, setFiles] = useState([]);

  const fileInputRef = useRef(null);
  const editorRef = useRef(null);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, 3);
      setFiles(newFiles);
    }
  };

  const toggleService = (service) => {
    setSelectedServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const togglePort = (port) => {
    setSelectedPorts(prev =>
      prev.includes(port) ? prev.filter(p => p !== port) : [...prev, port]
    );
  };

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handlePublish = (e) => {
    if (e) e.preventDefault();
    const content = editorRef.current ? editorRef.current.innerText.trim() : scopeOfWork;
    if (!content) {
      alert("Please enter the Scope of Work details.");
      return;
    }

    const newPost = {
      id: "post-" + Date.now(),
      company: "Bluesea Marine Works Pvt Ltd.",
      date: "Just now",
      urgent: isAsap,
      title: content.split("\n")[0] || "Requirement",
      details: content,
      ports: selectedPorts.length > 0 ? selectedPorts.join(", ") : "Chennai, Mumbai",
      services: selectedServices.length > 0 ? selectedServices.join(", ") : "Bunkering Coordination, Compressed Air Utility",
      budget: minBudget && maxBudget ? `${CURRENCY_SYMBOLS[currency]}${minBudget} - ${maxBudget}` : "$4K - 4.5K",
      views: 1,
      applied: false
    };

    if (onPostCreated) {
      onPostCreated(newPost);
    }

    alert("Requirement published successfully!");
    onClose();
  };

  const handleSaveDraft = (e) => {
    if (e) e.preventDefault();
    alert("Draft saved successfully!");
    onClose();
  };

  return (
    <div tabIndex="-1">
      {/* Background Overlay */}
      <div
        className="z-50 bg-overlay/50 backdrop-opacity-disabled w-screen h-screen fixed inset-0"
        aria-hidden="true"
        style={{ opacity: 1 }}
        onClick={onClose}
      ></div>

      {/* Modal Wrapper */}
      <div
        className="flex w-screen fixed inset-0 z-50 overflow-x-auto justify-center h-full items-end sm:items-center"
        data-slot="wrapper"
        onClick={onClose}
      >
        <section
          role="dialog"
          tabIndex="-1"
          className="flex flex-col relative z-50 w-full box-border bg-content1 outline-solid outline-transparent mx-1 my-1 sm:mx-6 sm:my-16 rounded-large shadow-small overflow-y-hidden max-w-300"
          id="_r_19q_"
          data-open="true"
          data-dismissable="true"
          aria-modal="true"
          data-placement="right"
          aria-labelledby="_r_19r_"
          aria-describedby="_r_19s_"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Accessibility Button */}
          <div style={{ border: "0px", clip: "rect(0px, 0px, 0px, 0px)", clipPath: "inset(50%)", height: "1px", margin: "-1px", overflow: "hidden", padding: "0px", position: "absolute", width: "1px", whiteSpace: "nowrap" }}>
            <button id="react-aria7586308166-_r_1bg_" aria-label="Dismiss" tabIndex="-1" style={{ width: "1px", height: "1px" }} onClick={onClose}></button>
          </div>

          {/* Modal Header */}
          <div className="py-4 px-6 flex-initial text-large font-semibold border-default-100 shadow-neutral-sm flex items-center justify-between border-b" id="_r_19r_">
            <h2 className="text-content1-foreground text-xl leading-7 font-semibold">Post Your Requirements</h2>
            <span className="flex items-center gap-16">
              <button
                type="button"
                tabIndex="0"
                onClick={onClose}
                aria-label="Close"
                data-react-aria-pressable="true"
                className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] cursor-pointer outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-small gap-2 rounded-medium px-0 !gap-0 transition-transform-colors-opacity motion-reduce:transition-none text-default-foreground data-[hover=true]:bg-default/40 min-w-10 h-8 w-8 max-w-8 bg-blue-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x stroke-4 text-zinc-400" aria-hidden="true">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </span>
          </div>

          {/* Modal Content Body */}
          <div className="flex flex-1 flex-col gap-3 bg-blue-25 p-6 max-h-[calc(90vh-140px)] overflow-y-auto" id="_r_19s_">
            <form className="space-y-6" onSubmit={handlePublish}>
              <div className="flex flex-col gap-6 md:flex-row">
                {/* Left Column */}
                <div className="flex flex-1 flex-col gap-3">
                  {/* Scope of work */}
                  <div className="bg-content1 shadow-neutral-sm rounded-lg p-6">
                    <div className="mb-4 flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <div className="shrink-0">
                          <i className="material-symbols-outlined h-4 w-4 text-base! text-blue-700">layers</i>
                        </div>
                        <h3 className="text-content1-foreground text-base leading-6 font-semibold">Scope of work</h3>
                      </div>
                      <p className="text-modified-13 text-zinc-500">Share the job details. Keep the first 2 lines crisp - they show on the post.</p>
                    </div>

                    <div>
                      <div className="border border-foreground-200 bg-content1 min-h-56 rounded-lg overflow-hidden">
                        <div className="quill min-h-45">
                          {/* Quill Toolbar */}
                          <div role="toolbar" className="ql-toolbar ql-snow border-b border-foreground-200 bg-default-50">
                            <span className="ql-formats">
                              <button type="button" className="ql-bold" onClick={() => handleFormat("bold")} aria-label="bold">
                                <svg viewBox="0 0 18 18"><path className="ql-stroke" d="M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z"></path><path className="ql-stroke" d="M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z"></path></svg>
                              </button>
                              <button type="button" className="ql-italic" onClick={() => handleFormat("italic")} aria-label="italic">
                                <svg viewBox="0 0 18 18"><line className="ql-stroke" x1="7" x2="13" y1="4" y2="4"></line><line className="ql-stroke" x1="5" x2="11" y1="14" y2="14"></line><line className="ql-stroke" x1="8" x2="10" y1="14" y2="4"></line></svg>
                              </button>
                              <button type="button" className="ql-underline" onClick={() => handleFormat("underline")} aria-label="underline">
                                <svg viewBox="0 0 18 18"><path className="ql-stroke" d="M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3"></path><rect className="ql-fill" height="1" rx="0.5" ry="0.5" width="12" x="3" y="15"></rect></svg>
                              </button>
                            </span>
                            <span className="ql-formats">
                              <button type="button" className="ql-list" onClick={() => handleFormat("insertOrderedList")} aria-label="list: ordered">
                                <svg viewBox="0 0 18 18"><line className="ql-stroke" x1="7" x2="15" y1="4" y2="4"></line><line className="ql-stroke" x1="7" x2="15" y1="9" y2="9"></line><line className="ql-stroke" x1="7" x2="15" y1="14" y2="14"></line><line className="ql-stroke ql-thin" x1="2.5" x2="4.5" y1="5.5" y2="5.5"></line><path className="ql-fill" d="M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z"></path><path className="ql-stroke ql-thin" d="M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156"></path><path className="ql-stroke ql-thin" d="M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109"></path></svg>
                              </button>
                              <button type="button" className="ql-list" onClick={() => handleFormat("insertUnorderedList")} aria-label="list: bullet">
                                <svg viewBox="0 0 18 18"><line className="ql-stroke" x1="6" x2="15" y1="4" y2="4"></line><line className="ql-stroke" x1="6" x2="15" y1="9" y2="9"></line><line className="ql-stroke" x1="6" x2="15" y1="14" y2="14"></line><line className="ql-stroke" x1="3" x2="3" y1="4" y2="4"></line><line className="ql-stroke" x1="3" x2="3" y1="9" y2="9"></line><line className="ql-stroke" x1="3" x2="3" y1="14" y2="14"></line></svg>
                              </button>
                            </span>
                            <span className="ql-formats">
                              <button type="button" className="ql-clean" onClick={() => handleFormat("removeFormat")} aria-label="clean">
                                <svg viewBox="0 0 18 18"><line className="ql-stroke" x1="5" x2="13" y1="3" y2="3"></line><line className="ql-stroke" x1="6" x2="9.35" y1="12" y2="3"></line><line className="ql-stroke" x1="11" x2="15" y1="11" y2="15"></line><line className="ql-stroke" x1="15" x2="11" y1="11" y2="15"></line><rect className="ql-fill" height="1" rx="0.5" ry="0.5" width="7" x="2" y="14"></rect></svg>
                              </button>
                            </span>
                          </div>

                          {/* Quill Container */}
                          <div className="ql-container ql-snow">
                            <div
                              ref={editorRef}
                              className="ql-editor"
                              contentEditable="true"
                              onInput={(e) => setScopeOfWork(e.currentTarget.innerText)}
                              style={{ minHeight: "150px" }}
                            >
                              <p><br /></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attachments & Budget row */}
                  <div className="flex gap-3">
                    {/* Attachments */}
                    <div className="bg-content1 shadow-neutral-sm rounded-lg p-6 h-fit w-1/2">
                      <div className="mb-4 flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <div className="shrink-0">
                            <i className="material-symbols-outlined h-4 w-4 text-base! text-blue-700">attach_file</i>
                          </div>
                          <h3 className="text-content1-foreground text-base leading-6 font-semibold">Attachments</h3>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          className="flex min-h-30 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#E5E7EB] bg-white px-4 py-6 text-center hover:border-blue-300 transition-colors"
                        >
                          <span className="material-symbols-outlined h-6 w-6 text-blue-400">upload_file</span>
                          <div className="flex flex-col gap-1">
                            <p className="text-sm leading-5 font-semibold">
                              {files.length > 0 ? `${files.length} file(s) selected` : "Upload PDFs/Images"}
                            </p>
                            <input
                              ref={fileInputRef}
                              multiple
                              accept="image/*,application/pdf"
                              className="hidden"
                              type="file"
                              onChange={handleFileUpload}
                            />
                            <p className="text-tiny text-blue-600">Upto 3 files • 15 MB each</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="bg-content1 shadow-neutral-sm rounded-lg p-6 relative w-1/2">
                      <div className="mb-4 flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <div className="shrink-0">
                            <i className="material-symbols-outlined h-4 w-4 text-base text-blue-700">attach_money</i>
                          </div>
                          <h3 className="text-content1-foreground text-base leading-6 font-semibold">Budget</h3>
                        </div>
                        <p className="text-modified-13 text-zinc-500">Specify the budget for the project.</p>
                      </div>

                      <div className="flex flex-col gap-3">
                        {/* Currency Selector */}
                        <div data-slot="base" data-filled="true" data-has-value="true" className="group flex flex-col w-full transition-background motion-reduce:transition-none !duration-150 justify-end absolute top-4 right-6 max-w-22">
                          <div className="relative">
                            <button
                              data-slot="trigger"
                              className="relative px-3 gap-3 w-full inline-flex flex-row items-center justify-between shadow-xs outline-solid outline-transparent tap-highlight-transparent h-10 min-h-10 rounded-medium transition-colors border border-blue-100 bg-white cursor-pointer"
                              type="button"
                              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                            >
                              <div data-slot="innerWrapper" className="inline-flex h-fit w-[calc(100%_-theme(spacing.6))] min-h-4 items-center gap-1.5 box-border">
                                <span data-slot="value" className="text-foreground-500 font-normal w-full text-start text-small truncate">
                                  {currency}
                                </span>
                              </div>
                              <svg aria-hidden="true" fill="none" height="1em" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="1em" data-slot="selectorIcon" className={`w-4 h-4 transition-transform duration-150 ${isCurrencyOpen ? "rotate-180" : ""}`}>
                                <path d="m6 9 6 6 6-6"></path>
                              </svg>
                            </button>

                            {isCurrencyOpen && (
                              <div className="absolute right-0 top-11 w-24 bg-white rounded-medium shadow-medium border border-blue-100 py-1 z-50">
                                {Object.keys(CURRENCY_SYMBOLS).map((curr) => (
                                  <button
                                    key={curr}
                                    type="button"
                                    onClick={() => {
                                      setCurrency(curr);
                                      setIsCurrencyOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-blue-50 ${currency === curr ? "font-bold text-primary bg-blue-25" : "text-gray-700"}`}
                                  >
                                    {curr}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* MIN input */}
                        <div className="group flex flex-col w-full relative justify-end" data-slot="base" data-filled="true" data-filled-within="true">
                          <div data-slot="main-wrapper" className="h-full flex flex-col">
                            <div data-slot="input-wrapper" className="relative w-full inline-flex tap-highlight-transparent flex-row items-center shadow-xs px-3 gap-3 h-12 min-h-12 rounded-large !duration-150 transition-colors border border-blue-100 bg-white" style={{ cursor: "text" }}>
                              <div data-slot="inner-wrapper" className="inline-flex w-full items-center h-full box-border">
                                <span className="text-foreground-500 text-sm leading-5 font-medium">{CURRENCY_SYMBOLS[currency]}</span>
                                <input
                                  data-slot="input"
                                  data-has-start-content="true"
                                  data-type="number"
                                  className="w-full bg-transparent !outline-solid focus-visible:outline-solid outline-transparent ps-1.5 text-sm leading-5 font-medium placeholder:text-zinc-500"
                                  aria-label="MIN"
                                  placeholder="MIN"
                                  type="number"
                                  value={minBudget}
                                  onChange={(e) => setMinBudget(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* MAX input */}
                        <div className="group flex flex-col w-full relative justify-end" data-slot="base" data-filled="true" data-filled-within="true">
                          <div data-slot="main-wrapper" className="h-full flex flex-col">
                            <div data-slot="input-wrapper" className="relative w-full inline-flex tap-highlight-transparent flex-row items-center shadow-xs px-3 gap-3 h-12 min-h-12 rounded-large !duration-150 transition-colors border border-blue-100 bg-white" style={{ cursor: "text" }}>
                              <div data-slot="inner-wrapper" className="inline-flex w-full items-center h-full box-border">
                                <span className="text-foreground-500 text-sm leading-5 font-medium">{CURRENCY_SYMBOLS[currency]}</span>
                                <input
                                  data-slot="input"
                                  data-has-start-content="true"
                                  data-type="number"
                                  className="w-full bg-transparent !outline-solid focus-visible:outline-solid outline-transparent ps-1.5 text-sm leading-5 font-medium placeholder:text-zinc-500"
                                  aria-label="MAX"
                                  placeholder="MAX"
                                  type="number"
                                  value={maxBudget}
                                  onChange={(e) => setMaxBudget(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex max-w-100 flex-1 flex-col gap-3">
                  {/* Services */}
                  <div className="bg-content1 shadow-neutral-sm rounded-lg p-6 relative">
                    <div className="mb-4 flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <div className="shrink-0">
                          <i className="material-symbols-outlined h-4 w-4 text-base! text-blue-700">settings</i>
                        </div>
                        <h3 className="text-content1-foreground text-base leading-6 font-semibold">Services</h3>
                      </div>
                      <p className="text-modified-13 text-zinc-500">Choose services for this request</p>
                    </div>
                    <div
                      onClick={() => setIsServicesOpen(!isServicesOpen)}
                      className="border-default-200 hover:border-default-400 rounded-medium min-h-10 cursor-pointer border-2 bg-white px-3 py-2 transition-colors flex items-center justify-between"
                    >
                      <span className="text-foreground-400 text-sm truncate">
                        {selectedServices.length > 0 ? selectedServices.join(", ") : "Select services"}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="m6 9 6 6 6-6"></path></svg>
                    </div>

                    {isServicesOpen && (
                      <div className="absolute left-6 right-6 top-full mt-1 bg-white rounded-medium shadow-medium border border-blue-100 p-3 z-50 max-h-48 overflow-y-auto">
                        <div className="grid grid-cols-1 gap-1">
                          {AVAILABLE_SERVICES.map(service => (
                            <label key={service} className="flex items-center gap-2 p-1.5 hover:bg-blue-50 rounded cursor-pointer text-xs">
                              <input
                                type="checkbox"
                                checked={selectedServices.includes(service)}
                                onChange={() => toggleService(service)}
                                className="rounded border-gray-300 text-primary"
                              />
                              <span className={selectedServices.includes(service) ? "font-semibold text-primary" : "text-gray-700"}>{service}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ports */}
                  <div className="bg-content1 shadow-neutral-sm rounded-lg p-6 relative">
                    <div className="mb-4 flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <div className="shrink-0">
                          <i className="material-symbols-outlined h-4 w-4 text-base! text-blue-700">anchor</i>
                        </div>
                        <h3 className="text-content1-foreground text-base leading-6 font-semibold">Ports</h3>
                      </div>
                      <p className="text-modified-13 text-zinc-500">Pick ports this request applies to</p>
                    </div>
                    <div
                      onClick={() => setIsPortsOpen(!isPortsOpen)}
                      className="border-default-200 hover:border-default-400 rounded-medium min-h-10 cursor-pointer border-2 bg-white px-3 py-2 transition-colors flex items-center justify-between"
                    >
                      <span className="text-foreground-400 text-sm truncate">
                        {selectedPorts.length > 0 ? selectedPorts.join(", ") : "Select ports"}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="m6 9 6 6 6-6"></path></svg>
                    </div>

                    {isPortsOpen && (
                      <div className="absolute left-6 right-6 top-full mt-1 bg-white rounded-medium shadow-medium border border-blue-100 p-3 z-50 max-h-48 overflow-y-auto">
                        <div className="grid grid-cols-1 gap-1">
                          {AVAILABLE_PORTS.map(port => (
                            <label key={port} className="flex items-center gap-2 p-1.5 hover:bg-blue-50 rounded cursor-pointer text-xs">
                              <input
                                type="checkbox"
                                checked={selectedPorts.includes(port)}
                                onChange={() => togglePort(port)}
                                className="rounded border-gray-300 text-primary"
                              />
                              <span className={selectedPorts.includes(port) ? "font-semibold text-primary" : "text-gray-700"}>{port}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Needed by */}
                  <div className="bg-content1 shadow-neutral-sm rounded-lg p-6">
                    <div className="mb-4 flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-content1-foreground text-base leading-6 font-semibold">Needed by</h3>
                      </div>
                      <p className="text-modified-13 text-zinc-500">Choose a service window (or select ASAP).</p>
                    </div>

                    {/* ASAP Switch */}
                    <label className="group relative max-w-fit inline-flex items-center justify-start cursor-pointer touch-none tap-highlight-transparent select-none mb-3" data-selected={isAsap}>
                      <input
                        aria-label="ASAP"
                        role="switch"
                        className="sr-only"
                        type="checkbox"
                        checked={isAsap}
                        onChange={(e) => setIsAsap(e.target.checked)}
                      />
                      <span
                        aria-hidden="true"
                        className={`px-1 relative inline-flex items-center justify-start shrink-0 overflow-hidden rounded-full w-12 h-7 transition-background ${isAsap ? "bg-primary" : "bg-default-200"}`}
                      >
                        <span
                          className={`z-10 flex items-center justify-center bg-white shadow-small rounded-full w-5 h-5 text-small transition-all ${isAsap ? "ms-5" : "ms-0"}`}
                        ></span>
                      </span>
                      <span className="relative text-foreground select-none ms-2 text-medium">ASAP</span>
                    </label>

                    {/* Service Dates */}
                    <div className="relative" style={{ display: "block" }}>
                      <div className="group flex flex-col w-full is-filled" data-slot="base" data-filled="true" data-filled-within="true" data-has-elements="true" data-has-label="true" data-has-value="true">
                        <div
                          data-slot="input-wrapper"
                          className="relative w-full inline-flex tap-highlight-transparent shadow-xs px-3 bg-default-100 hover:bg-default-200 min-h-10 rounded-medium flex-col items-start justify-center gap-0 transition-background !duration-150 outline-none outline-transparent border-0 h-14 py-2 is-filled"
                          style={{ cursor: "text" }}
                        >
                          <label
                            data-slot="label"
                            className="block text-foreground-500 text-xs font-normal pe-2 max-w-full text-ellipsis overflow-hidden pointer-events-none"
                          >
                            Service dates
                          </label>
                          <div data-slot="inner-wrapper" className="inline-flex w-full items-center h-full box-border pb-0.5">
                            <input
                              data-slot="input"
                              className="w-full font-normal bg-transparent outline-none focus:outline-none focus:ring-0 border-0 text-small text-default-foreground is-filled p-0 m-0 shadow-none ring-0"
                              type="text"
                              value={serviceDates}
                              onChange={(e) => setServiceDates(e.target.value)}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar text-foreground-400 shrink-0" aria-hidden="true">
                              <path d="M8 2v4"></path>
                              <path d="M16 2v4"></path>
                              <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                              <path d="M3 10h18"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Modal Footer */}
          <footer className="flex flex-row gap-2 px-6 py-4 justify-end border-t border-default-100 bg-content1">
            <button
              type="button"
              tabIndex="0"
              onClick={onClose}
              data-react-aria-pressable="true"
              className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] cursor-pointer outline-solid outline-transparent px-4 min-w-20 h-10 text-small gap-2 rounded-medium [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none bg-transparent text-default-foreground data-[hover=true]:bg-default/40 hover:bg-default/40"
            >
              Cancel
            </button>
            <button
              type="button"
              tabIndex="0"
              onClick={handleSaveDraft}
              data-react-aria-pressable="true"
              className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] cursor-pointer outline-solid outline-transparent px-4 min-w-20 h-10 text-small gap-2 rounded-medium [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none bg-default text-default-foreground data-[hover=true]:opacity-hover hover:opacity-80"
            >
              Save Draft
            </button>
            <button
              type="button"
              tabIndex="0"
              onClick={handlePublish}
              data-react-aria-pressable="true"
              className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] cursor-pointer outline-solid outline-transparent px-4 min-w-20 h-10 text-small gap-2 rounded-medium transition-transform-colors-opacity motion-reduce:transition-none bg-primary text-primary-foreground data-[hover=true]:opacity-hover hover:opacity-80"
            >
              Publish Request
            </button>
          </footer>

          {/* Bottom Accessibility Button */}
          <div style={{ border: "0px", clip: "rect(0px, 0px, 0px, 0px)", clipPath: "inset(50%)", height: "1px", margin: "-1px", overflow: "hidden", padding: "0px", position: "absolute", width: "1px", whiteSpace: "nowrap" }}>
            <button id="react-aria7586308166-_r_1do_" aria-label="Dismiss" tabIndex="-1" style={{ width: "1px", height: "1px" }} onClick={onClose}></button>
          </div>
        </section>
      </div>
    </div>
  );
}
