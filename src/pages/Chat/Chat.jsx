import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Chat.css';

export function Chat() {
  const { id } = useParams();
  const [selectedThreadId, setSelectedThreadId] = useState(id || null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (id) {
      setSelectedThreadId(id);
    }
  }, [id]);

  const threads = [
    {
      id: '1',
      name: 'Indra Shipping Co.',
      time: '28 days ago',
      lastMessage: 'Your profile looksgood, lets talk',
      unread: false,
    },
    {
      id: '2',
      name: 'Indra Shipping Co.',
      time: '4 months ago',
      lastMessage: 'Quote',
      unread: false,
    },
    {
      id: '3',
      name: 'Indra Shipping Co.',
      time: '4 months ago',
      lastMessage: 'Quote',
      unread: false,
    },
    {
      id: '4',
      name: 'test',
      time: '4 months ago',
      lastMessage: 'Share the job details. Keep the first 2 lines crisp - they show on the post....',
      unread: false,
    },
  ];

  const filteredThreads = threads.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chat-page-container bg-blue-25 flex h-[calc(100dvh-3.5rem)] min-h-0 w-full">
      {/* Sidebar */}
      <div className={`h-full w-full max-w-md shrink-0 flex-col border-r border-gray-200 bg-content1 ${selectedThreadId ? 'hidden md:flex' : 'flex'}`}>
        <div className="bg-blue-25 shadow-neutral-sm mx-4 mt-4 mb-2 flex h-[40px] items-center rounded-[6px] border border-blue-50 px-[6px] py-[4px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search mr-2 shrink-0 text-zinc-500" aria-hidden="true">
            <path d="m21 21-4.34-4.34"></path>
            <circle cx="11" cy="11" r="8"></circle>
          </svg>
          <input
            placeholder="Search chats..."
            className="text-modified-13 flex-1 border-none bg-transparent leading-[18px] font-normal text-zinc-500 outline-none placeholder:text-zinc-500"
            aria-label="Search chats"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto pt-2">
          {filteredThreads.map((thread) => {
            const isSelected = selectedThreadId === thread.id;
            return (
              <div
                key={thread.id}
                onClick={() => setSelectedThreadId(thread.id)}
                className={`hover:bg-blue-25 relative mx-2 mb-1 flex cursor-pointer items-start gap-3 rounded-[8px] border px-[13px] py-[13px] transition-colors ${
                  isSelected
                    ? 'bg-blue-25 border-l-primary border-l-[3px] border-[#0D1A470D]'
                    : 'border-transparent bg-white'
                }`}
                style={{minHeight: '74px'}}
              >
                <div className="relative shrink-0">
                  <span tabIndex="-1" className="flex relative justify-center items-center box-border overflow-hidden align-middle z-0 text-tiny bg-default text-default-foreground shadow-neutral-sm h-12 w-12 rounded-[8px] object-cover">
                    <img
                      className="flex object-cover w-full h-full transition-opacity opacity-100"
                      alt={thread.name}
                      src="/images/indra_avatar.jpg" onError={(e) => { e.currentTarget.src = "/images/profile_avatar.webp"; }}
                    />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-[2px] pt-[2px]">
                  <div className="flex h-6 w-full items-center justify-between gap-2">
                    <span className="text-content2-foreground truncate text-[14px] font-semibold">{thread.name}</span>
                    <span className="shrink-0 text-right text-[11px] font-light whitespace-nowrap text-blue-500">{thread.time}</span>
                  </div>
                  <div className="flex w-full items-center justify-between gap-2">
                    <div className="min-w-0 flex-1 truncate text-[13px] text-zinc-500">{thread.lastMessage}</div>
                  </div>
                </div>
                <div className="shrink-0 self-center" role="presentation">
                  <button type="button" aria-label="Thread actions" className="p-1 text-zinc-400 hover:text-zinc-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Pane: Initial State (REF 16) vs Open Chat (REF 17) */}
      {!selectedThreadId ? (
        <div className="hidden min-h-0 flex-1 flex-col md:flex">
          <div className="flex flex-1 items-center justify-center text-zinc-400 font-medium text-sm">
            Select a conversation to start chatting
          </div>
        </div>
      ) : (
<div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden"><div className="bg-blue-25 flex h-full min-h-0 flex-1 flex-col overflow-hidden"><div className="shrink-0 border-b border-gray-200 bg-white px-3 py-3 shadow-sm"><div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedThreadId(null)}
              className="md:hidden p-1.5 -ml-1 mr-1 rounded-lg text-zinc-600 hover:bg-zinc-100 transition-colors"
              aria-label="Back to conversations"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button><button type="button" tabIndex="0" data-react-aria-pressable="true" aria-label="Back to chats" className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] cursor-pointer outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-tiny gap-2 rounded-small px-0 !gap-0 transition-transform-colors-opacity motion-reduce:transition-none bg-transparent text-default-foreground data-[hover=true]:bg-default/40 h-8 w-8 min-w-8 shrink-0 md:hidden"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg></button><div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg"><span tabIndex="-1" className="flex relative justify-center items-center box-border overflow-hidden align-middle z-0 outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-tiny bg-default text-default-foreground rounded-full h-full w-full"><img className="flex object-cover w-full h-full transition-opacity !duration-500 opacity-100 data-[loaded=true]:opacity-100" alt="Indra Shipping Co." src="/images/indra_avatar.jpg" onError={(e) => { e.currentTarget.src = "/images/profile_avatar.webp"; }} data-loaded="true" /></span></div><div className="min-w-0 flex-1"><h2 className="text-content1-foreground truncate text-base font-semibold">Multiple port services required for MV Indravati (45,000 DWT bulk carrier) arriving Visakhapatnam. Vendors with VPT auth…</h2><div className="flex min-w-0 gap-1 text-xs text-zinc-500"><span className="shrink-0 font-medium">Services:</span><span className="min-w-0 truncate">Canal Transit Agency Support</span></div></div><a role="button" target="_blank" rel="noopener noreferrer" tabIndex="0" data-react-aria-pressable="true" className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] cursor-pointer outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-3 min-w-16 h-8 text-tiny rounded-small [&amp;&gt;svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none bg-default/40 data-[hover=true]:opacity-hover text-primary shrink-0 gap-1" href="/my-posts/details">Post Details<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right h-4 w-4 shrink-0" aria-hidden="true" focusable="false"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></a></div></div><div className="bg-blue-25 flex min-h-0 min-w-0 flex-1 items-stretch gap-4 overflow-hidden px-3 pt-2 pb-0 md:px-4 md:pt-2 md:pb-0"><div className="flex min-h-0 min-w-0 flex-1 flex-col self-stretch overflow-hidden"><div className="shadow-neutral-sm flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-blue-50 bg-white"><div className="scrollbar-theme min-h-0 flex-1 overflow-y-auto px-4 py-4"><div className="divide-layout-divider flex flex-col divide-y"><div className="flex flex-col gap-3 px-4 py-4"><div className="flex items-start justify-between"><div className="flex items-start gap-3.25"><span tabIndex="-1" className="flex relative justify-center items-center box-border overflow-hidden align-middle z-0 outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-tiny bg-default text-default-foreground shadow-neutral-sm h-10 w-10 shrink-0 rounded-lg"><img className="flex object-cover w-full h-full transition-opacity !duration-500 opacity-100 data-[loaded=true]:opacity-100" alt="Indra Shipping Co." src="/images/indra_avatar.jpg" onError={(e) => { e.currentTarget.src = "/images/profile_avatar.webp"; }} data-loaded="true" /></span><div className="flex min-w-0 flex-1 flex-col gap-px"><div className="flex items-center"><span className="text-modified-15-semibold text-content1-foreground max-w-55 overflow-hidden text-ellipsis whitespace-nowrap">Indra Shipping Co.</span></div><div className="flex items-center gap-2.5"><div className="flex items-center"><div className="text-content4-foreground w-150 text-sm leading-5 font-normal overflow-hidden text-ellipsis whitespace-nowrap">Your profile looksgood, lets talk</div></div></div></div></div><div className="flex shrink-0 items-center gap-3"><span className="text-xs leading-4 font-normal whitespace-nowrap text-zinc-500">Aug 13, 2026 · 2:13 PM</span></div></div></div></div></div></div></div></div><div className="bg-blue-25 relative z-10 w-full shrink-0 border-t border-gray-200"><div className="w-full border-0 px-3 pb-3 md:px-4 md:pb-4"><div className="w-full max-w-full border border-blue-100 bg-white p-0"><div className="shadow-neutral-sm overflow-hidden rounded-lg border border-blue-50 bg-white"><div className="bg-blue-25 rounded-lg"><div className="relative bg-white p-4"><input className="hidden" accept=".pdf,image/jpeg,image/png,image/webp" multiple="" type="file" /><div className="border-foreground-200 bg-content1 min-h-32 rounded-lg md:min-h-40"><div className="quill min-h-24"><div role="toolbar" className="ql-toolbar ql-snow"><span className="ql-formats"><span className="ql-header ql-picker"><span className="ql-picker-label" tabIndex="0" role="button" aria-expanded="false" aria-controls="ql-picker-options-1"><svg viewBox="0 0 18 18"><polygon className="ql-stroke" points="7 11 9 13 11 11 7 11"></polygon><polygon className="ql-stroke" points="7 7 9 5 11 7 7 7"></polygon></svg></span><span className="ql-picker-options" aria-hidden="true" tabIndex="-1" id="ql-picker-options-1"><span tabIndex="0" role="button" className="ql-picker-item" data-value="1"></span><span tabIndex="0" role="button" className="ql-picker-item" data-value="2"></span><span tabIndex="0" role="button" className="ql-picker-item" data-value="3"></span><span tabIndex="0" role="button" className="ql-picker-item ql-selected"></span></span></span><select className="ql-header" style={{"display": "none"}}><option value="1"></option><option value="2"></option><option value="3"></option><option selected="selected"></option></select></span><span className="ql-formats"><button type="button" className="ql-bold" aria-pressed="false" aria-label="bold"><svg viewBox="0 0 18 18"><path className="ql-stroke" d="M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z"></path><path className="ql-stroke" d="M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z"></path></svg></button><button type="button" className="ql-italic" aria-pressed="false" aria-label="italic"><svg viewBox="0 0 18 18"><line className="ql-stroke" x1="7" x2="13" y1="4" y2="4"></line><line className="ql-stroke" x1="5" x2="11" y1="14" y2="14"></line><line className="ql-stroke" x1="8" x2="10" y1="14" y2="4"></line></svg></button><button type="button" className="ql-underline" aria-pressed="false" aria-label="underline"><svg viewBox="0 0 18 18"><path className="ql-stroke" d="M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3"></path><rect className="ql-fill" height="1" rx="0.5" ry="0.5" width="12" x="3" y="15"></rect></svg></button><button type="button" className="ql-link" aria-pressed="false" aria-label="link"><svg viewBox="0 0 18 18"><line className="ql-stroke" x1="7" x2="11" y1="7" y2="11"></line><path className="ql-even ql-stroke" d="M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z"></path><path className="ql-even ql-stroke" d="M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z"></path></svg></button></span><span className="ql-formats"><button type="button" className="ql-list" aria-pressed="false" value="ordered" aria-label="list: ordered"><svg viewBox="0 0 18 18"><line className="ql-stroke" x1="7" x2="15" y1="4" y2="4"></line><line className="ql-stroke" x1="7" x2="15" y1="9" y2="9"></line><line className="ql-stroke" x1="7" x2="15" y1="14" y2="14"></line><line className="ql-stroke ql-thin" x1="2.5" x2="4.5" y1="5.5" y2="5.5"></line><path className="ql-fill" d="M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z"></path><path className="ql-stroke ql-thin" d="M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156"></path><path className="ql-stroke ql-thin" d="M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109"></path></svg></button><button type="button" className="ql-list" aria-pressed="false" value="bullet" aria-label="list: bullet"><svg viewBox="0 0 18 18"><line className="ql-stroke" x1="6" x2="15" y1="4" y2="4"></line><line className="ql-stroke" x1="6" x2="15" y1="9" y2="9"></line><line className="ql-stroke" x1="6" x2="15" y1="14" y2="14"></line><line className="ql-stroke" x1="3" x2="3" y1="4" y2="4"></line><line className="ql-stroke" x1="3" x2="3" y1="9" y2="9"></line><line className="ql-stroke" x1="3" x2="3" y1="14" y2="14"></line></svg></button></span><span className="ql-formats"><button type="button" className="ql-clean" aria-pressed="false" aria-label="clean"><svg className="" viewBox="0 0 18 18"><line className="ql-stroke" x1="5" x2="13" y1="3" y2="3"></line><line className="ql-stroke" x1="6" x2="9.35" y1="12" y2="3"></line><line className="ql-stroke" x1="11" x2="15" y1="11" y2="15"></line><line className="ql-stroke" x1="15" x2="11" y1="11" y2="15"></line><rect className="ql-fill" height="1" rx="0.5" ry="0.5" width="7" x="2" y="14"></rect></svg></button></span></div><div className="ql-container ql-snow"><div className="ql-editor ql-blank" contenteditable="true" data-placeholder="Write a message..."><p><br />></p></div><div className="ql-tooltip ql-hidden"><a className="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a><input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL" /><a className="ql-action"></a><a className="ql-remove"></a></div></div></div></div></div><div className="flex items-center justify-between bg-white px-3 pb-2"><div className="opacity-100"><button type="button" tabIndex="0" data-react-aria-pressable="true" className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] cursor-pointer outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 min-w-16 text-tiny gap-2 rounded-small [&amp;&gt;svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none data-[hover=true]:opacity-hover h-9 bg-[#0e793c] px-3 text-white">Award</button></div><div className="flex items-center gap-3"><button type="button" tabIndex="0" data-react-aria-pressable="true" aria-label="Attach file" className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] cursor-pointer outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-tiny gap-2 rounded-small !gap-0 transition-transform-colors-opacity motion-reduce:transition-none bg-transparent text-default-foreground data-[hover=true]:bg-default/40 w-8 h-6 min-w-6 p-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-paperclip h-4.5 w-4.5" aria-hidden="true"><path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"></path></svg></button><button data-disabled="true" type="button" disabled="" data-react-aria-pressable="true" className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] cursor-pointer outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 gap-2 rounded-small opacity-disabled pointer-events-none [&amp;&gt;svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none data-[hover=true]:opacity-hover h-9 min-w-26 bg-[#1f285d] px-4 text-sm leading-5 font-medium text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send h-3.5 w-3.5" aria-hidden="true" focusable="false"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path></svg>Send</button></div></div></div></div></div></div></div></div></div>
      )}
    </div>
  );
}
