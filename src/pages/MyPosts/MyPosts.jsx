import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MyPosts.css';

export function MyPosts() {
  const navigate = useNavigate();

  return (
    <>
      <div className="mx-auto w-full max-w-5xl px-6 py-6">
        <div className="mb-6">
          <div className="inline-flex flex-col items-start justify-start gap-1.5">
            <div className="inline-flex items-center justify-start gap-2">
              <div className="text-content1-foreground justify-center font-sans text-2xl leading-8 font-semibold">Ship - your ask</div>
            </div>
            <div className="inline-flex items-center justify-start gap-2.5">
              <div className="justify-center font-sans text-base leading-6 font-normal text-zinc-500">Keep your requests moving, from live to awarded.</div>
            </div>
          </div>
        </div>

        <div className="relative mb-6">
          <div className="flex items-center justify-between border-b border-blue-100">
            <div data-slot="base" className="inline-flex w-full">
              <div data-slot="tabList" className="relative flex h-fit items-center flex-nowrap overflow-x-scroll scrollbar-hide gap-2 bg-transparent p-0 rounded-none" role="tablist" aria-orientation="horizontal">
                <button data-key="all" data-selected="true" data-slot="tab" tabIndex="0" role="tab" className="z-0 w-full flex group relative justify-center items-center cursor-pointer transition-opacity tap-highlight-transparent text-small rounded-none px-3 py-3 h-auto border-b-2 border-transparent data-[selected=true]:border-red-500" type="button">
                  <div className="relative z-10 whitespace-nowrap transition-colors group-data-[selected=true]:text-primary text-blue-600" data-slot="tabContent">
                    <div className="flex items-center gap-1.5"><span className="text-sm font-semibold">All</span><span className="flex h-4 min-w-4 items-center justify-center rounded-full border border-zinc-100 bg-red-50 px-1 text-xs">4</span></div>
                  </div>
                </button>
                <button data-key="live" data-slot="tab" tabIndex="-1" role="tab" className="z-0 w-full flex group relative justify-center items-center cursor-pointer transition-opacity tap-highlight-transparent text-small rounded-none px-3 py-3 h-auto border-b-2 border-transparent" type="button">
                  <div className="relative z-10 whitespace-nowrap transition-colors group-data-[selected=true]:text-primary text-blue-600" data-slot="tabContent">
                    <div className="flex items-center gap-1.5"><span className="text-sm font-semibold">Live</span><span className="flex h-4 min-w-4 items-center justify-center rounded-full border border-zinc-100 bg-red-50 px-1 text-xs">2</span></div>
                  </div>
                </button>
                <button data-key="awarded" data-slot="tab" tabIndex="-1" role="tab" className="z-0 w-full flex group relative justify-center items-center cursor-pointer transition-opacity tap-highlight-transparent text-small rounded-none px-3 py-3 h-auto border-b-2 border-transparent" type="button">
                  <div className="relative z-10 whitespace-nowrap transition-colors group-data-[selected=true]:text-primary text-blue-600" data-slot="tabContent">
                    <div className="flex items-center gap-1.5"><span className="text-sm">Awarded</span></div>
                  </div>
                </button>
                <button data-key="rate-now" data-slot="tab" tabIndex="-1" role="tab" className="z-0 w-full flex group relative justify-center items-center cursor-pointer transition-opacity tap-highlight-transparent text-small rounded-none px-3 py-3 h-auto border-b-2 border-transparent" type="button">
                  <div className="relative z-10 whitespace-nowrap transition-colors group-data-[selected=true]:text-primary text-blue-600" data-slot="tabContent">
                    <div className="flex items-center gap-1.5"><span className="text-sm">Rate Now</span></div>
                  </div>
                </button>
                <button data-key="history" data-slot="tab" tabIndex="-1" role="tab" className="z-0 w-full flex group relative justify-center items-center cursor-pointer transition-opacity tap-highlight-transparent text-small rounded-none px-3 py-3 h-auto border-b-2 border-transparent" type="button">
                  <div className="relative z-10 whitespace-nowrap transition-colors group-data-[selected=true]:text-primary text-blue-600" data-slot="tabContent">
                    <div className="flex items-center gap-1.5"><span className="text-sm">History</span><span className="flex h-4 min-w-4 items-center justify-center rounded-full border border-zinc-100 bg-red-50 px-1 text-xs">1</span></div>
                  </div>
                </button>
                <button data-key="drafts" data-slot="tab" tabIndex="-1" role="tab" className="z-0 w-full flex group relative justify-center items-center cursor-pointer transition-opacity tap-highlight-transparent text-small rounded-none px-3 py-3 h-auto border-b-2 border-transparent" type="button">
                  <div className="relative z-10 whitespace-nowrap transition-colors group-data-[selected=true]:text-primary text-blue-600" data-slot="tabContent">
                    <div className="flex items-center gap-1.5"><span className="text-sm">Drafts</span><span className="flex h-4 min-w-4 items-center justify-center rounded-full border border-zinc-100 bg-red-50 px-1 text-xs">1</span></div>
                  </div>
                </button>
              </div>
            </div>

            <div className="absolute top-0 right-0">
              <div className="group flex flex-col relative justify-end w-[220px]">
                <div className="h-full flex flex-col">
                  <div className="relative w-full inline-flex flex-row items-center px-3 gap-3 rounded-small h-9 bg-white border border-blue-100 shadow-sm" style={{"cursor": "text"}}>
                    <div className="inline-flex w-full items-center h-full box-border">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search text-zinc-400"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>
                      <input className="w-full font-normal bg-transparent outline-none px-1.5 text-[13px]" placeholder="Search..." type="text" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex flex-col gap-3">
            {/* Card 1 */}
            <div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 shadow-medium rounded-large shadow-neutral-sm w-full border border-blue-50">
              <div className="relative flex w-full flex-auto flex-col h-auto break-words text-left overflow-y-auto gap-4 p-7">
                <div><div className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap px-1 text-tiny rounded-full text-default-700 bg-danger-100 h-7"><span className="flex-1 px-1 text-danger-600 font-semibold text-[13px]">Urgent</span></div></div>
                <div><p className="text-[15px] leading-[1.4] tracking-[-0.1px] text-zinc-800">Multiple port services required for MV Indravati (45,000 DWT bulk carrier) arriving Visakhapatnam. Vendors with VPT authorisation and valid certifications only. Quotations invited ...<Link className="ml-1 text-zinc-500 hover:text-zinc-700" to="/my-posts/my-post-1">more</Link></p></div>
                <div className="flex flex-col gap-2">
                  <div className="mt-3 flex w-full min-w-0 items-center gap-2"><span className="material-symbols-outlined mt-0.5 shrink-0 text-sm leading-none text-zinc-500">anchor</span><span className="min-w-0 flex-1 text-sm leading-5 break-words text-zinc-500">Chennai</span></div>
                  <div className="mt-3 flex w-full min-w-0 items-center gap-2"><span className="material-symbols-outlined mt-0.5 shrink-0 text-sm leading-none text-zinc-500">settings</span><span className="min-w-0 flex-1 text-sm leading-5 break-words text-zinc-500">Canal Transit Agency Support</span></div>
                </div>
                <hr className="shrink-0 bg-divider border-none w-full h-divider my-2 opacity-50" role="separator" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4"></div>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] leading-4.5 text-zinc-500">Posted 8d ago</span>
                      <div className="shrink-0 border-none w-divider bg-layout-divider h-3 opacity-50" role="separator"></div>
                      <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base text-zinc-500">visibility</span><span className="text-[13px] leading-4.5 text-zinc-500">5 Views</span></div>
                      <div className="shrink-0 border-none w-divider bg-layout-divider h-3 opacity-50" role="separator"></div>
                      <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base text-zinc-500">people</span><span className="text-[13px] leading-4.5 text-zinc-500">1 Applied</span></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden border-medium px-4 min-w-20 h-10 text-small gap-2 rounded-medium bg-transparent text-primary border-blue-200 hover:bg-blue-50" to="/my-posts/my-post-1">View Details</Link>
                      <button type="button" className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden border-medium px-4 min-w-20 h-10 text-small gap-2 rounded-medium bg-transparent border-red-500 text-red-500 hover:bg-red-50">Mark Close</button>
                      <button type="button" className="group relative inline-flex items-center justify-center min-w-8 w-8 h-8 rounded-small text-zinc-500 hover:bg-gray-100"><span className="material-symbols-outlined">more_vert</span></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 shadow-medium rounded-large shadow-neutral-sm w-full border border-blue-50">
              <div className="relative flex w-full flex-auto flex-col h-auto break-words text-left overflow-y-auto gap-4 p-7">
                <div><div className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap px-1 text-tiny rounded-full text-default-700 bg-danger-100 h-7"><span className="flex-1 px-1 text-danger-600 font-semibold text-[13px]">Urgent</span></div></div>
                <div><p className="text-[15px] leading-[1.4] tracking-[-0.1px] text-zinc-800">Multiple port services required for MV Indravati (45,000 DWT bulk carrier) arriving Visakhapatnam. Vendors with VPT authorisation and valid certifications only. Quotations invited ...<Link className="ml-1 text-zinc-500 hover:text-zinc-700" to="/my-posts/my-post-2">more</Link></p></div>
                <div className="flex flex-col gap-2">
                  <div className="mt-3 flex w-full min-w-0 items-center gap-2"><span className="material-symbols-outlined mt-0.5 shrink-0 text-sm leading-none text-zinc-500">anchor</span><span className="min-w-0 flex-1 text-sm leading-5 break-words text-zinc-500">Visakhapatnam</span></div>
                  <div className="mt-3 flex w-full min-w-0 items-center gap-2"><span className="material-symbols-outlined mt-0.5 shrink-0 text-sm leading-none text-zinc-500">settings</span><span className="min-w-0 flex-1 text-sm leading-5 break-words text-zinc-500">Freshwater Supply, Garbage Collection & Disposal (MARPOL)<span className="text-primary ml-1 cursor-pointer font-medium">+1</span></span></div>
                </div>
                <hr className="shrink-0 bg-divider border-none w-full h-divider my-2 opacity-50" role="separator" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4"><p className="text-content2-foreground text-lg leading-7 font-semibold">$5K - 5.5K</p></div>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] leading-4.5 text-zinc-500">Posted 27d ago</span>
                      <div className="shrink-0 border-none w-divider bg-layout-divider h-3 opacity-50" role="separator"></div>
                      <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base text-zinc-500">visibility</span><span className="text-[13px] leading-4.5 text-zinc-500">2 Views</span></div>
                      <div className="shrink-0 border-none w-divider bg-layout-divider h-3 opacity-50" role="separator"></div>
                      <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base text-zinc-500">people</span><span className="text-[13px] leading-4.5 text-zinc-500">0 Applied</span></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden border-medium px-4 min-w-20 h-10 text-small gap-2 rounded-medium bg-transparent text-primary border-blue-200 hover:bg-blue-50" to="/my-posts/my-post-2">View Details</Link>
                      <button type="button" className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden border-medium px-4 min-w-20 h-10 text-small gap-2 rounded-medium bg-transparent border-red-500 text-red-500 hover:bg-red-50">Mark Close</button>
                      <button type="button" className="group relative inline-flex items-center justify-center min-w-8 w-8 h-8 rounded-small text-zinc-500 hover:bg-gray-100"><span className="material-symbols-outlined">more_vert</span></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 shadow-medium rounded-large shadow-neutral-sm w-full border border-blue-50">
              <div className="relative flex w-full flex-auto flex-col h-auto break-words text-left overflow-y-auto gap-4 p-7">
                <div><div className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap px-1 text-tiny rounded-full text-default-700 bg-danger-100 h-7"><span className="flex-1 px-1 text-danger-600 font-semibold text-[13px]">Urgent</span></div></div>
                <div><p className="text-[15px] leading-[1.4] tracking-[-0.1px] text-zinc-800">Multiple port services required for MV Indravati (45,000 DWT bulk carrier) arriving Visakhapatnam. Vendors with VPT authorisation and valid certifications only. Quotations invited ...<Link className="ml-1 text-zinc-500 hover:text-zinc-700" to="/my-posts/my-post-3">more</Link></p></div>
                <div className="flex flex-col gap-2">
                  <div className="mt-3 flex w-full min-w-0 items-center gap-2"><span className="material-symbols-outlined mt-0.5 shrink-0 text-sm leading-none text-zinc-500">anchor</span><span className="min-w-0 flex-1 text-sm leading-5 break-words text-zinc-500">Chennai, Cochin<span className="text-primary ml-1 cursor-pointer font-medium">+23</span></span></div>
                  <div className="mt-3 flex w-full min-w-0 items-center gap-2"><span className="material-symbols-outlined mt-0.5 shrink-0 text-sm leading-none text-zinc-500">settings</span><span className="min-w-0 flex-1 text-sm leading-5 break-words text-zinc-500">Canal Transit Agency Support, Cash to Master (CTM) Coordination<span className="text-primary ml-1 cursor-pointer font-medium">+10</span></span></div>
                </div>
                <hr className="shrink-0 bg-divider border-none w-full h-divider my-2 opacity-50" role="separator" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4"><p className="text-content2-foreground text-lg leading-7 font-semibold">$100 - 500</p></div>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] leading-4.5 text-zinc-500">Posted 116d ago</span>
                      <div className="shrink-0 border-none w-divider bg-layout-divider h-3 opacity-50" role="separator"></div>
                      <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base text-zinc-500">visibility</span><span className="text-[13px] leading-4.5 text-zinc-500">7 Views</span></div>
                      <div className="shrink-0 border-none w-divider bg-layout-divider h-3 opacity-50" role="separator"></div>
                      <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base text-zinc-500">people</span><span className="text-[13px] leading-4.5 text-zinc-500">1 Applied</span></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden border-medium px-4 min-w-20 h-10 text-small gap-2 rounded-medium bg-transparent text-primary border-blue-200 hover:bg-blue-50" to="/my-posts/my-post-3">View Details</Link>
                      <button type="button" className="group relative inline-flex items-center justify-center min-w-8 w-8 h-8 rounded-small text-zinc-500 hover:bg-gray-100"><span className="material-symbols-outlined">more_vert</span></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 shadow-medium rounded-large shadow-neutral-sm w-full border border-blue-50">
              <div className="relative flex w-full flex-auto flex-col h-auto break-words text-left overflow-y-auto gap-4 p-7">
                <div><p className="text-[15px] leading-[1.4] tracking-[-0.1px] text-zinc-800">Underwater hull cleaning and propeller polishing required for MV Indravati (45,000 DWT bulk carrier) arriving Visakhapatnam. Certified divers with IMCA-standard equipment only. Quo...<Link className="ml-1 text-zinc-500 hover:text-zinc-700" to="/my-posts/my-post-4">more</Link></p></div>
                <div className="flex flex-col gap-2">
                  <div className="mt-3 flex w-full min-w-0 items-center gap-2"><span className="material-symbols-outlined mt-0.5 shrink-0 text-sm leading-none text-zinc-500">anchor</span><span className="min-w-0 flex-1 text-sm leading-5 break-words text-zinc-500">Algiers, Annaba<span className="text-primary ml-1 cursor-pointer font-medium">+7</span></span></div>
                  <div className="mt-3 flex w-full min-w-0 items-center gap-2"><span className="material-symbols-outlined mt-0.5 shrink-0 text-sm leading-none text-zinc-500">settings</span><span className="min-w-0 flex-1 text-sm leading-5 break-words text-zinc-500">Canal Transit Agency Support, Cash to Master (CTM) Coordination<span className="text-primary ml-1 cursor-pointer font-medium">+10</span></span></div>
                </div>
                <hr className="shrink-0 bg-divider border-none w-full h-divider my-2 opacity-50" role="separator" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4"></div>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] leading-4.5 text-zinc-500">Posted 143d ago</span>
                      <div className="shrink-0 border-none w-divider bg-layout-divider h-3 opacity-50" role="separator"></div>
                      <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base text-zinc-500">visibility</span><span className="text-[13px] leading-4.5 text-zinc-500">2 Views</span></div>
                      <div className="shrink-0 border-none w-divider bg-layout-divider h-3 opacity-50" role="separator"></div>
                      <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base text-zinc-500">people</span><span className="text-[13px] leading-4.5 text-zinc-500">0 Applied</span></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden border-medium px-4 min-w-20 h-10 text-small gap-2 rounded-medium bg-transparent text-primary border-blue-200 hover:bg-blue-50" to="/my-posts/my-post-4">View Details</Link>
                      <button type="button" className="group relative inline-flex items-center justify-center min-w-8 w-8 h-8 rounded-small text-zinc-500 hover:bg-gray-100"><span className="material-symbols-outlined">more_vert</span></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
