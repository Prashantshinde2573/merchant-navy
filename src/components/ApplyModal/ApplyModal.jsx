import React, { useState } from 'react';
import './ApplyModal.css';

export function ApplyModal({ isOpen, onClose, onApply, post }) {
  const [message, setMessage] = useState('');
  const [fileName, setFileName] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !post) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleTextChange = (e) => {
    setMessage(e.target.value);
    if (errorMessage && e.target.value.trim()) {
      setErrorMessage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMessage('Please enter a message to introduce yourself before sending your application.');
      return;
    }
    setErrorMessage('');
    onApply(message);
    onClose();
  };

  return (
    <div className="apply-modal-root" data-overlay-container="true">
      {/* Backdrop */}
      <div
        className="z-50 bg-black/50 backdrop-opacity-disabled w-screen h-screen fixed inset-0 apply-modal-backdrop"
        aria-hidden="true"
        onClick={onClose}
        style={{ opacity: 1 }}
      />

      {/* Modal Wrapper */}
      <div
        className="flex w-screen fixed inset-0 z-50 overflow-x-auto justify-center items-end sm:items-center apply-modal-wrapper"
        data-slot="wrapper"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <section
          role="dialog"
          tabIndex="-1"
          className="flex flex-col relative z-50 w-full box-border bg-content1 outline-solid outline-transparent mx-1 my-1 sm:mx-6 sm:my-16 rounded-large shadow-small max-h-[calc(100%_-_4rem)] sm:max-h-[calc(100%_-_8rem)] max-w-[600px] apply-modal-dialog"
          data-open="true"
          data-dismissable="true"
          aria-modal="true"
        >
          {/* Header */}
          <header className="py-4 px-6 flex-initial text-large font-semibold border-divider flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-semibold text-content1-foreground">Send your application</h2>
            <button
              type="button"
              tabIndex="0"
              onClick={onClose}
              aria-label="Close modal"
              className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent cursor-pointer outline-solid outline-transparent text-tiny rounded-small px-0 transition-colors bg-transparent text-default-foreground hover:bg-default/40 min-w-8 w-8 h-8 -mr-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </header>

          {/* Body */}
          <div className="flex flex-1 flex-col px-6 overflow-y-auto gap-6 py-6 apply-modal-body">
            {/* Post Summary Card */}
            <div className="bg-content2 rounded-lg p-4">
              <div className="flex gap-3 items-center">
                <span
                  tabIndex="-1"
                  className="flex relative justify-center items-center box-border overflow-hidden align-middle z-0 outline-solid outline-transparent w-14 h-14 text-small bg-[#e4e4e7] text-zinc-700 font-semibold rounded-full shrink-0"
                >
                  <span
                    aria-label={post.vendorName}
                    className="font-semibold text-center text-inherit text-base"
                    role="img"
                  >
                    {post.vendorAvatar || post.vendorName?.charAt(0) || 'V'}
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-content1-foreground">{post.vendorName}</h3>
                  <p className="text-zinc-600 mt-1 line-clamp-2 text-sm leading-5">
                    {post.scopeOfWork}
                  </p>
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-medium text-content1-foreground">
                  Message <span className="text-danger-500 font-normal">*</span>
                </div>
                <span className="text-zinc-500 text-xs">{message.length}/600</span>
              </div>
              <div className="group flex flex-col w-full">
                <div
                  className={`relative w-full inline-flex tap-highlight-transparent flex-row items-center shadow-xs px-3 gap-3 border-2 ${
                    errorMessage
                      ? 'border-danger-500 bg-danger-50/20'
                      : 'border-zinc-200 hover:border-zinc-400 focus-within:border-primary'
                  } rounded-medium !h-auto py-2 transition-colors bg-white`}
                  style={{ cursor: 'text' }}
                >
                  <textarea
                    className="w-full font-normal bg-transparent outline-none placeholder:text-zinc-400 text-sm resize-none text-zinc-800"
                    aria-label="Write a message to introduce yourself and explain why you're a great fit for this project..."
                    maxLength={600}
                    rows={3}
                    value={message}
                    onChange={handleTextChange}
                    placeholder="Write a message to introduce yourself and explain why you're a great fit for this project..."
                    style={{ height: '80px' }}
                  />
                </div>
                {errorMessage && (
                  <p className="text-xs text-danger-500 mt-1.5 font-medium flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errorMessage}
                  </p>
                )}
              </div>
            </div>

            {/* File Upload Box */}
            <div>
              <div className="flex flex-col gap-3">
                <label className="flex min-h-30 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#E5E7EB] bg-white px-4 py-6 text-center hover:border-blue-400 transition-colors">
                  <span className="material-symbols-outlined h-6 w-6 text-blue-400">upload_file</span>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm leading-5 font-semibold text-zinc-800">
                      {fileName ? `Selected: ${fileName}` : 'Click to upload attachments'}
                    </p>
                    <input
                      multiple
                      accept="image/*,application/pdf"
                      className="hidden"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <p className="text-tiny text-blue-600">Upto 1 files • 10 MB each</p>
                  </div>
                </label>
              </div>
            </div>

            {/* What's Next Progress Indicator */}
            <div className="bg-content2 rounded-lg p-4">
              <p className="mb-3 text-sm font-medium text-content1-foreground">What's next:</p>
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {/* Step 1: Applied */}
                <div className="flex items-center gap-1.5">
                  <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full shrink-0">
                    <span className="text-primary-foreground text-xs font-semibold">1</span>
                  </div>
                  <span className="text-xs font-medium text-zinc-800">Applied</span>
                </div>
                <div className="bg-divider h-0.5 w-6 sm:w-8 shrink-0" />

                {/* Step 2: Invited */}
                <div className="flex items-center gap-1.5">
                  <div className="border-divider flex h-8 w-8 items-center justify-center rounded-full border-2 shrink-0 bg-white">
                    <span className="text-zinc-400 text-xs font-semibold">2</span>
                  </div>
                  <span className="text-zinc-500 text-xs">Invited</span>
                </div>
                <div className="bg-divider h-0.5 w-6 sm:w-8 shrink-0" />

                {/* Step 3: Discussion */}
                <div className="flex items-center gap-1.5">
                  <div className="border-divider flex h-8 w-8 items-center justify-center rounded-full border-2 shrink-0 bg-white">
                    <span className="text-zinc-400 text-xs font-semibold">3</span>
                  </div>
                  <span className="text-zinc-500 text-xs">Discussion</span>
                </div>
                <div className="bg-divider h-0.5 w-6 sm:w-8 shrink-0" />

                {/* Step 4: Awarded */}
                <div className="flex items-center gap-1.5">
                  <div className="border-divider flex h-8 w-8 items-center justify-center rounded-full border-2 shrink-0 bg-white">
                    <span className="text-zinc-400 text-xs font-semibold">4</span>
                  </div>
                  <span className="text-zinc-500 text-xs">Awarded</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="flex flex-row gap-2 px-6 py-4 justify-end border-divider border-t pt-4">
            <div className="flex w-full items-center justify-between">
              <button
                type="button"
                tabIndex="0"
                onClick={() => setIsBookmarked(!isBookmarked)}
                aria-label="Save post"
                className={`z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent cursor-pointer outline-solid outline-transparent text-small gap-2 rounded-medium px-0 !gap-0 transition-colors bg-transparent ${
                  isBookmarked ? 'text-primary' : 'text-default-foreground'
                } hover:bg-default/40 min-w-10 w-10 h-10`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={isBookmarked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-bookmark"
                  aria-hidden="true"
                >
                  <path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" />
                </svg>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  tabIndex="0"
                  onClick={onClose}
                  className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent cursor-pointer outline-solid outline-transparent px-4 min-w-20 h-10 text-small gap-2 rounded-medium transition-opacity bg-transparent border border-default text-foreground hover:opacity-hover"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  tabIndex="0"
                  onClick={handleSubmit}
                  className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent cursor-pointer outline-solid outline-transparent px-4 min-w-20 h-10 text-small gap-2 rounded-medium transition-opacity bg-primary text-primary-foreground hover:opacity-hover font-medium"
                >
                  Send Application
                </button>
              </div>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}
