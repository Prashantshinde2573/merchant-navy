import React, { useState, useRef } from 'react';
import './SupportModal.css';

export function SupportModal({ isOpen, onClose }) {
  const [topic, setTopic] = useState('');
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('Bluesea Marine Works Pvt Ltd.');
  const [email, setEmail] = useState('shivhare.yuvraj@gmail.com');
  const [phone, setPhone] = useState('91 8080282067');
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).slice(0, 3);
      setFiles(selected);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDescription('');
      setFiles([]);
      onClose();
    }, 1200);
  };

  return (
    <div tabindex="-1">
      <div 
        className="z-[100] bg-overlay/50 bg-black/50 backdrop-blur-xs w-screen h-screen fixed inset-0 transition-opacity"
        aria-hidden="true" 
        style={{ opacity: 1 }}
        onClick={onClose}
      />
      <div 
        className="flex w-screen fixed inset-0 z-[100] overflow-x-auto justify-center items-center sm:items-center p-2 sm:p-4" 
        data-slot="wrapper" 
        style={{ opacity: 1 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <section 
          role="dialog" 
          tabIndex="-1" 
          className="flex flex-col relative z-50 w-full box-border bg-content1 bg-white outline-solid outline-transparent mx-1 my-1 sm:mx-6 sm:my-16 max-w-3xl rounded-large shadow-small max-h-[calc(100vh-4rem)] overflow-hidden" 
          id="_r_1ih_" 
          data-open="true" 
          data-dismissable="true" 
          aria-modal="true" 
          data-placement="center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button 
            role="button" 
            tabIndex="0" 
            aria-label="Close" 
            onClick={onClose}
            className="absolute appearance-none select-none top-3 end-3 p-2 text-foreground-500 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-default-100 hover:bg-zinc-100 active:bg-default-200 tap-highlight-transparent outline-solid outline-transparent cursor-pointer z-10 transition-colors" 
            type="button" 
            data-react-aria-pressable="true"
          >
            <svg aria-hidden="true" className="fill-current" fill="none" focusable="false" height="1.2em" role="presentation" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="1.2em">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <header className="py-4 px-6 flex-initial text-large font-semibold flex flex-col gap-1 pb-2 border-b border-gray-100" id="_r_1ii_">
            <span className="text-xl font-semibold text-zinc-900 font-['Inter']">Submit a Support Request</span>
          </header>

          {/* Body Content */}
          <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto">
            <div className="flex flex-1 flex-col px-6 overflow-y-auto gap-5 py-6" id="_r_1ij_">
              
              {/* Row 1: Topic & What's the issue? */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Topic */}
                <div data-slot="base" data-filled="true" data-has-label="true" className="group inline-flex flex-col relative w-full transition-background motion-reduce:transition-none !duration-150">
                  <div data-slot="mainWrapper" className="w-full flex flex-col">
                    <div data-slot="trigger" className="relative px-3 w-full inline-flex shadow-xs tap-highlight-transparent group-data-[focus=true]:bg-default-200 rounded-medium flex-col items-start justify-center gap-0 bg-default-100 bg-[#f4f4f5] data-[hover=true]:bg-default-200 outline-solid outline-transparent h-14 min-h-14 py-2">
                      <label data-slot="label" className="block absolute z-10 flex-shrink-0 subpixel-antialiased text-foreground-500 text-zinc-500 pointer-events-none cursor-pointer after:content-['*'] after:text-danger after:text-red-500 after:ms-0.5 origin-top-left text-xs top-2 left-3">
                        Topic
                      </label>
                      <div data-slot="innerWrapper" className="inline-flex h-fit w-full min-h-4 items-center gap-1.5 box-border pt-4">
                        <select
                          required
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          className="w-full bg-transparent text-small text-zinc-800 font-normal outline-none appearance-none cursor-pointer pr-6 text-sm"
                        >
                          <option value="" disabled className="text-zinc-400">Select a topic</option>
                          <option value="billing_plan">Billing &amp; Success Plan</option>
                          <option value="account_profile">Account &amp; profile</option>
                          <option value="verification_trust">Verification &amp; trust badges</option>
                          <option value="technical_issue">Technical issue / bug</option>
                          <option value="marketplace_jobs">Marketplace &amp; jobs</option>
                          <option value="feedback_other">Feedback &amp; other</option>
                        </select>
                      </div>
                      <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="1em" data-slot="selectorIcon" className="absolute end-3 w-4 h-4 text-zinc-400 pointer-events-none">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* What's the issue? */}
                <div data-slot="base" data-filled="true" data-has-label="true" className="group inline-flex flex-col relative w-full transition-background motion-reduce:transition-none !duration-150">
                  <div data-slot="mainWrapper" className="w-full flex flex-col">
                    <div data-slot="trigger" className="relative px-3 w-full inline-flex shadow-xs tap-highlight-transparent group-data-[focus=true]:bg-default-200 rounded-medium flex-col items-start justify-center gap-0 bg-default-100 bg-[#f4f4f5] data-[hover=true]:bg-default-200 outline-solid outline-transparent h-14 min-h-14 py-2">
                      <label data-slot="label" className="block absolute z-10 flex-shrink-0 subpixel-antialiased text-foreground-500 text-zinc-500 pointer-events-none cursor-pointer after:content-['*'] after:text-danger after:text-red-500 after:ms-0.5 origin-top-left text-xs top-2 left-3">
                        What's the issue?
                      </label>
                      <div data-slot="innerWrapper" className="inline-flex h-fit w-full min-h-4 items-center gap-1.5 box-border pt-4">
                        <select
                          required
                          value={issue}
                          onChange={(e) => setIssue(e.target.value)}
                          className="w-full bg-transparent text-small text-zinc-800 font-normal outline-none appearance-none cursor-pointer pr-6 text-sm"
                        >
                          <option value="" disabled className="text-zinc-400">Select an action</option>
                          <option value="refund_or_invoice">Refund / invoice question</option>
                          <option value="subscription_change">Upgrade or downgrade plan</option>
                          <option value="update_business_info">Change business info</option>
                          <option value="verification_documents">Verification / documents</option>
                          <option value="bug_or_error">Bug or error message</option>
                          <option value="feature_request">Feature request</option>
                          <option value="general_question">General question</option>
                        </select>
                      </div>
                      <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="1em" data-slot="selectorIcon" className="absolute end-3 w-4 h-4 text-zinc-400 pointer-events-none">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Describe the Issue */}
              <div className="group flex flex-col data-[hidden=true]:hidden w-full" data-slot="base" data-filled="true" data-filled-within="true" data-required="true" data-has-elements="true" data-has-label="true">
                <div data-slot="input-wrapper" className="relative w-full inline-flex tap-highlight-transparent shadow-xs px-3 bg-default-100 bg-[#f4f4f5] data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-10 rounded-medium flex-col items-start justify-center gap-0 !h-auto transition-background motion-reduce:transition-none !duration-150 outline-solid outline-transparent h-14 py-2" data-has-multiple-rows="true" style={{ cursor: "text" }}>
                  <label data-slot="label" className="z-10 pointer-events-none origin-top-left shrink-0 subpixel-antialiased block text-foreground-500 text-zinc-500 cursor-text after:content-['*'] after:text-danger after:text-red-500 after:ms-0.5 relative will-change-auto text-small text-xs pb-0.5 pe-2 max-w-full text-ellipsis overflow-hidden" id="react-aria8552086545-_r_1jd_">
                    Describe the Issue
                  </label>
                  <div data-slot="inner-wrapper" className="inline-flex w-full h-full box-border items-start group-data-[has-label=true]:items-start pb-0.5">
                    <textarea 
                      data-slot="input" 
                      className="w-full font-normal bg-transparent !outline-solid placeholder:text-foreground-500 placeholder:text-zinc-400 focus-visible:outline-solid outline-transparent text-small text-zinc-800 text-sm resize-none pt-0" 
                      required
                      maxLength="8000" 
                      placeholder="What happened, where (screen), when (date/time), any error message, expected vs. actual result..." 
                      tabIndex="0" 
                      id="react-aria8552086545-_r_1jc_" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      title="" 
                      style={{ height: "100px" }}
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Attachments (Optional) */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-normal text-[#696f93]">
                  Attachments <span className="text-[#959ab3]">(Optional)</span>
                </span>
                <input 
                  ref={fileInputRef}
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,application/pdf,image/jpeg,image/png,image/webp" 
                  multiple 
                  className="hidden" 
                  type="file"
                  onChange={handleFileChange}
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="hover:border-primary hover:bg-primary/5 hover:border-blue-400 hover:bg-blue-50/20 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#e5e7eb] bg-white px-8.5 py-10.5 py-8 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload text-[#696f93]" aria-hidden="true">
                    <path d="M12 3v12" />
                    <path d="m17 8-5-5-5 5" />
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  </svg>
                  <span className="text-sm font-semibold text-[#3f3f46]">Click to upload or drag and drop</span>
                  <span className="text-tiny text-xs text-[#696f93]">Max 3 files, 10MB each. Supported: PDF, JPG, PNG, DOCX.</span>

                  {files.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2 justify-center">
                      {files.map((f, i) => (
                        <span key={i} className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 text-xs px-2.5 py-1 rounded-md">
                          📎 {f.name}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="h-px bg-[rgba(17,17,17,0.15)] opacity-50" />

              {/* Section 2: Your Contact Information */}
              <div>
                <p className="text-foreground text-zinc-900 mb-3 text-base font-semibold">
                  Your Contact Information
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Name */}
                  <div className="group flex flex-col data-[hidden=true]:hidden w-full is-filled" data-slot="base" data-required="true" data-has-elements="true" data-has-label="true" data-has-value="true" data-filled="true" data-filled-within="true">
                    <div data-slot="input-wrapper" className="relative w-full inline-flex tap-highlight-transparent shadow-xs px-3 bg-default-100 bg-[#f4f4f5] data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-10 rounded-medium flex-col items-start justify-center gap-0 transition-background motion-reduce:transition-none !duration-150 outline-solid outline-transparent h-14 py-2 is-filled" style={{ cursor: "text" }}>
                      <label data-slot="label" className="absolute z-10 pointer-events-none origin-top-left shrink-0 subpixel-antialiased block text-foreground-500 text-zinc-500 cursor-text after:content-['*'] after:text-danger after:text-red-500 after:ms-0.5 will-change-auto text-small text-xs top-2 left-3 pe-2 max-w-full text-ellipsis overflow-hidden">
                        Name
                      </label>
                      <div data-slot="inner-wrapper" className="inline-flex w-full items-center h-full box-border pt-4 pb-0.5">
                        <input 
                          data-slot="input" 
                          className="w-full font-normal bg-transparent !outline-solid placeholder:text-foreground-500 focus-visible:outline-solid outline-transparent text-small text-zinc-800 text-sm is-filled" 
                          required 
                          tabIndex="0" 
                          type="text" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group flex flex-col data-[hidden=true]:hidden w-full is-filled" data-slot="base" data-required="true" data-has-elements="true" data-has-label="true" data-has-value="true" data-filled="true" data-filled-within="true">
                    <div data-slot="input-wrapper" className="relative w-full inline-flex tap-highlight-transparent shadow-xs px-3 bg-default-100 bg-[#f4f4f5] data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-10 rounded-medium flex-col items-start justify-center gap-0 transition-background motion-reduce:transition-none !duration-150 outline-solid outline-transparent h-14 py-2 is-filled" style={{ cursor: "text" }}>
                      <label data-slot="label" className="absolute z-10 pointer-events-none origin-top-left shrink-0 subpixel-antialiased block text-foreground-500 text-zinc-500 cursor-text after:content-['*'] after:text-danger after:text-red-500 after:ms-0.5 will-change-auto text-small text-xs top-2 left-3 pe-2 max-w-full text-ellipsis overflow-hidden">
                        Email
                      </label>
                      <div data-slot="inner-wrapper" className="inline-flex w-full items-center h-full box-border pt-4 pb-0.5">
                        <input 
                          data-slot="input" 
                          data-type="email" 
                          className="w-full font-normal bg-transparent !outline-solid placeholder:text-foreground-500 focus-visible:outline-solid outline-transparent text-small text-zinc-800 text-sm is-filled" 
                          required 
                          tabIndex="0" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="group flex flex-col data-[hidden=true]:hidden w-full is-filled" data-slot="base" data-has-elements="true" data-has-label="true" data-has-value="true" data-filled="true" data-filled-within="true">
                    <div data-slot="input-wrapper" className="relative w-full inline-flex tap-highlight-transparent shadow-xs px-3 bg-default-100 bg-[#f4f4f5] data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-10 rounded-medium flex-col items-start justify-center gap-0 transition-background motion-reduce:transition-none !duration-150 outline-solid outline-transparent h-14 py-2 is-filled" style={{ cursor: "text" }}>
                      <label data-slot="label" className="absolute z-10 pointer-events-none origin-top-left shrink-0 subpixel-antialiased block text-foreground-500 text-zinc-500 cursor-text will-change-auto text-small text-xs top-2 left-3 pe-2 max-w-full text-ellipsis overflow-hidden">
                        Phone (Optional)
                      </label>
                      <div data-slot="inner-wrapper" className="inline-flex w-full items-center h-full box-border pt-4 pb-0.5">
                        <input 
                          data-slot="input" 
                          className="w-full font-normal bg-transparent !outline-solid placeholder:text-foreground-500 focus-visible:outline-solid outline-transparent text-small text-zinc-800 text-sm is-filled" 
                          tabIndex="0" 
                          type="text" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <footer className="flex flex-row gap-2 px-6 py-4 justify-start pt-2 border-t border-gray-100 bg-white">
              <button 
                type="submit" 
                disabled={submitted}
                data-react-aria-pressable="true" 
                className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] cursor-pointer outline-solid outline-transparent px-4 min-w-20 h-10 text-small gap-2 rounded-medium transition-transform-colors-opacity motion-reduce:transition-none data-[hover=true]:opacity-hover w-60 bg-[#1f285d] hover:bg-[#18204a] font-medium text-white text-sm shadow-sm"
              >
                {submitted ? 'Request Submitted ✓' : 'Submit Request'}
              </button>
            </footer>
          </form>
        </section>
      </div>
    </div>
  );
}

export default SupportModal;
