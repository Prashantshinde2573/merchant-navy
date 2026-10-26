import React, { useState } from 'react';
import { usePosts } from '../../context/PostContext';
import './ReportModal.css';

export function ReportModal({ isOpen, onClose, postId }) {
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { reportPost } = usePosts();

  if (!isOpen) return null;

  const minChars = 10;
  const maxChars = 2000;
  const isValid = details.trim().length >= minChars;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    if (reportPost && postId) {
      reportPost(postId, details.trim());
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDetails('');
      onClose();
    }, 1200);
  };

  return (
    <div tabIndex="-1">
      {/* Backdrop overlay */}
      <div 
        className="z-[100] bg-overlay/50 bg-black/50 backdrop-blur-xs w-screen h-screen fixed inset-0 transition-opacity" 
        aria-hidden="true" 
        style={{ opacity: 1 }}
        onClick={onClose}
      />
      
      {/* Centered modal wrapper */}
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
          className="flex flex-col relative z-50 w-full box-border bg-content1 bg-white outline-solid outline-transparent mx-1 my-1 sm:mx-6 sm:my-16 max-w-lg rounded-large shadow-small overflow-hidden max-h-[calc(100vh-2rem)]" 
          id="_r_1s9_" 
          data-open="true" 
          data-dismissable="true" 
          aria-modal="true" 
          data-placement="center" 
          aria-labelledby="_r_1sa_" 
          aria-describedby="_r_1sb_"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button top right */}
          <button 
            role="button" 
            tabIndex="0" 
            aria-label="Close" 
            onClick={onClose}
            className="absolute appearance-none select-none top-3 end-3 p-2 text-foreground-500 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-default-100 hover:bg-zinc-100 active:bg-default-200 tap-highlight-transparent outline-solid outline-transparent cursor-pointer z-10 transition-colors" 
            type="button" 
            data-react-aria-pressable="true"
          >
            <svg aria-hidden="true" className="fill-current" fill="none" focusable="false" height="1.1em" role="presentation" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="1.1em">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <header className="py-4 px-6 flex-initial text-large font-semibold flex flex-col gap-1 pr-12 border-b border-gray-100" id="_r_1sa_">
            <span className="text-lg font-semibold text-zinc-900 font-['Inter']">Report post</span>
            <span className="text-sm font-normal text-zinc-500 font-['Inter']">
              Describe what is wrong (spam, misleading content, policy violation, etc.). Reports are reviewed by admins.
            </span>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex flex-1 flex-col gap-3 px-6 py-4" id="_r_1sb_">
              <div className="group flex flex-col w-full" data-slot="base" data-filled="true" data-filled-within="true" data-has-elements="true" data-has-label="true">
                <div data-slot="input-wrapper" className="relative w-full inline-flex tap-highlight-transparent shadow-xs px-3 bg-default-100 bg-[#f4f4f5] data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-10 rounded-medium flex-col items-start justify-center gap-0 !h-auto transition-background motion-reduce:transition-none !duration-150 outline-solid outline-transparent h-14 py-2 border border-transparent focus-within:border-blue-500/30" data-has-multiple-rows="true" style={{ cursor: "text" }}>
                  <label data-slot="label" className="z-10 pointer-events-none origin-top-left shrink-0 subpixel-antialiased block text-foreground-500 text-zinc-500 cursor-text relative text-small text-xs pb-0.5 pe-2 max-w-full text-ellipsis overflow-hidden" id="react-aria8552086545-_r_1uk_">
                    Details
                  </label>
                  <div data-slot="inner-wrapper" className="inline-flex w-full h-full box-border items-start pb-0.5">
                    <textarea 
                      data-slot="input" 
                      className="w-full font-normal bg-transparent !outline-solid placeholder:text-foreground-500 placeholder:text-zinc-400 focus-visible:outline-solid outline-transparent text-small text-zinc-800 text-sm resize-none pt-0 leading-relaxed" 
                      aria-label="Report details" 
                      maxLength={maxChars} 
                      placeholder="At least 10 characters" 
                      tabIndex="0" 
                      id="react-aria8552086545-_r_1uj_" 
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      required
                      title="" 
                      style={{ height: "80px" }}
                    />
                  </div>
                </div>
              </div>
              <p className="text-tiny text-xs text-zinc-500">
                {details.length}/{maxChars} · minimum 10 characters
              </p>
            </div>

            {/* Footer */}
            <footer className="flex flex-row gap-2 px-6 py-4 justify-end border-t border-gray-100 bg-zinc-50/50">
              <button 
                type="button" 
                tabIndex="0" 
                data-react-aria-pressable="true" 
                onClick={onClose}
                className="report-modal-cancel-btn z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] cursor-pointer outline-solid outline-transparent px-4 min-w-20 h-10 text-small text-sm gap-2 rounded-medium bg-transparent text-black hover:bg-[#d4d4d8]/40 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={!isValid || submitted}
                data-react-aria-pressable="true" 
                className={`report-modal-submit-btn z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-medium subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] outline-solid outline-transparent px-4 min-w-28 h-10 text-small text-sm gap-2 rounded-medium transition-all ${
                  isValid && !submitted
                    ? 'cursor-pointer bg-[#f31260] text-white hover:opacity-90 shadow-sm opacity-100'
                    : 'cursor-not-allowed opacity-50 bg-[#f31260] text-white'
                }`}
              >
                {submitted ? 'Report Submitted' : 'Submit report'}
              </button>
            </footer>
          </form>
        </section>
      </div>
    </div>
  );
}

export default ReportModal;
