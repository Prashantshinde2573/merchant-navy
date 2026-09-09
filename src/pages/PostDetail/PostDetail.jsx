import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PostDetail.css';


const DUMMY_QUOTATIONS = [
  {
    id: "quote-1",
    merchantName: "Indra Shipping Co.",
    avatar: "/images/profile_avatar.webp",
    rating: "5.00",
    reviewCount: "18 reviews",
    matchPercent: 96,
    portMatch: "24/25",
    serviceMatch: "12/12",
    price: "$566.00",
    validityDate: "Jun 19, 2026",
    status: "Awarded",
    statusColor: "bg-[#0e793c] text-white",
    isRecommended: true
  },
  {
    id: "quote-2",
    merchantName: "Oceanic Marine Services Ltd.",
    avatar: "/images/profile_avatar.webp",
    rating: "4.85",
    reviewCount: "12 reviews",
    matchPercent: 88,
    portMatch: "20/25",
    serviceMatch: "11/12",
    price: "$520.00",
    validityDate: "Jun 24, 2026",
    status: "Accept Quote",
    statusColor: "bg-primary text-white",
    isRecommended: false
  },
  {
    id: "quote-3",
    merchantName: "Visakha Chandler & Bunkering Corp.",
    avatar: "/images/profile_avatar.webp",
    rating: "4.90",
    reviewCount: "9 reviews",
    matchPercent: 84,
    portMatch: "18/25",
    serviceMatch: "10/12",
    price: "$590.00",
    validityDate: "Jun 22, 2026",
    status: "Accept Quote",
    statusColor: "bg-primary text-white",
    isRecommended: false
  },
  {
    id: "quote-4",
    merchantName: "BlueWave Port Agency & Logistics",
    avatar: "/images/profile_avatar.webp",
    rating: "4.70",
    reviewCount: "5 reviews",
    matchPercent: 75,
    portMatch: "15/25",
    serviceMatch: "9/12",
    price: "$480.00",
    validityDate: "Jun 28, 2026",
    status: "Accept Quote",
    statusColor: "bg-primary text-white",
    isRecommended: false
  },
  {
    id: "quote-5",
    merchantName: "Eastern Seaboard Maritime Suppliers",
    avatar: "/images/profile_avatar.webp",
    rating: "4.60",
    reviewCount: "3 reviews",
    matchPercent: 62,
    portMatch: "10/25",
    serviceMatch: "7/12",
    price: "$615.00",
    validityDate: "Jun 15, 2026",
    status: "Accept Quote",
    statusColor: "bg-primary text-white",
    isRecommended: false
  }
];

export function PostDetail() {
  const navigate = useNavigate();

  return (
    <>
      <div className="relative min-h-[calc(100vh-56px)]"><div className="border-default-100 bg-content1 sticky top-14 z-40 border-b shadow-sm"><div className="mx-auto max-w-300 px-6"><div className="flex h-16 items-center justify-between"><div className="relative flex flex-1 items-start gap-3"><a href="/my-posts"  type="button" tabIndex="0" data-react-aria-pressable="true" className="z-0 group inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] cursor-pointer outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 border-medium text-tiny gap-2 rounded-small px-0 !gap-0 transition-transform-colors-opacity motion-reduce:transition-none bg-transparent text-foreground min-w-8 data-[hover=true]:opacity-hover absolute top-2 -left-17.5 h-9 w-9 border-blue-100"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left" aria-hidden="true"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg></a><div className="flex max-w-150 flex-1 flex-col gap-0.5"><h2 className="text-content1-foreground truncate text-lg leading-7 font-semibold">Multiple port services required for MV Indravati (45,000 DWT bulk carrier) arriving Visakhapatnam. Vendors with VPT authorisation and valid certificat...more</h2><p className="truncate text-sm leading-5 text-zinc-500"><span className="font-medium">Services:</span> Canal Transit Agency Support, Cash to Master (CTM) Coordination, Courier / Mail & Documents Handling, Crew Change Coordination (Agency), Disbursement Account (DA) Management, Husbandry (General), Medical Call Coordination, Port Agency (Full Agency), Port Call Planning & Coordination, Protective Agency (OPA/CPA), Spares Clearance & Delivery Coordination, Supplier Booking Coordination</p></div></div><div className="flex items-center gap-5"><div className="flex items-center gap-3"><div className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap px-1 h-7 text-small rounded-small text-default-foreground bg-danger-100"><span className="flex-1 px-2 text-danger-600! text-modified-13-semibold font-semibold">Urgent</span></div></div><div className="shrink-0 bg-divider border-none w-divider h-5 opacity-50" role="separator" data-orientation="vertical" aria-orientation="vertical"></div><div className="flex items-center gap-4"><button type="button" tabIndex="0" data-react-aria-pressable="true" aria-label="Share post" className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] cursor-pointer outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-tiny gap-2 rounded-small px-0 !gap-0 transition-transform-colors-opacity motion-reduce:transition-none bg-transparent text-default-foreground data-[hover=true]:bg-default/40 min-w-8 w-8 h-8"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share2 lucide-share-2" aria-hidden="true"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line></svg></button><button type="button" tabIndex="0" data-react-aria-pressable="true" data-slot="trigger" id="react-aria7586308166-_r_1ma_" aria-haspopup="true" aria-expanded="false" className="group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] cursor-pointer outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-tiny gap-2 rounded-small px-0 !gap-0 transition-transform-colors-opacity motion-reduce:transition-none bg-transparent text-default-foreground data-[hover=true]:bg-default/40 min-w-8 w-8 h-8 z-10 aria-expanded:scale-[0.97] aria-expanded:opacity-70 subpixel-antialiased"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis-vertical" aria-hidden="true"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></button></div></div></div><div data-slot="base" className="inline-flex"><div data-slot="tabList" className="flex h-fit items-center flex-nowrap overflow-x-scroll scrollbar-hide gap-6 w-full relative rounded-none p-0 border-none bg-transparent" data-collection="react-aria7586308166-_r_1md_" id="react-aria7586308166-_r_1me_" role="tablist" aria-orientation="horizontal"><span data-slot="cursor" className="absolute z-0 will-change-[transform,width,height] invisible data-[initialized=true]:visible data-[animated=true]:transition-[left,top,width,height] data-[animated=true]:duration-250 data-[animated=true]:ease-out rounded-small bg-background dark:bg-default shadow-small hidden" data-animated="true" data-initialized="true" style={{"left": "324px", "top": "0px", "width": "120px", "height": "32px"}}></span><button data-key="scope" data-slot="tab" tabIndex="-1" data-collection="react-aria7586308166-_r_1md_" data-react-aria-pressable="true" id="react-aria7586308166-_r_1me_-tab-scope" aria-selected="false" role="tab" className="z-0 w-full py-1 flex group relative justify-center items-center cursor-pointer transition-opacity tap-highlight-transparent data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-30 outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 h-8 text-small rounded-none pb-3 pt-1 px-3 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] data-[hover-unselected=true]:opacity-100 border-b-2 border-transparent data-[selected=true]:border-red-500" type="button"><div className="relative z-10 whitespace-nowrap transition-colors text-default-500 group-data-[selected=true]:text-primary" data-slot="tabContent"><div className="flex items-center gap-1.5"><div className="text-sm leading-5 font-normal text-blue-600">Scope</div></div></div></button><button data-key="applied" data-slot="tab" tabIndex="-1" data-collection="react-aria7586308166-_r_1md_" data-react-aria-pressable="true" id="react-aria7586308166-_r_1me_-tab-applied" aria-selected="false" role="tab" className="z-0 w-full py-1 flex group relative justify-center items-center cursor-pointer transition-opacity tap-highlight-transparent data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-30 outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 h-8 text-small rounded-none pb-3 pt-1 px-3 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] data-[hover-unselected=true]:opacity-100 border-b-2 border-transparent data-[selected=true]:border-red-500" type="button"><div className="relative z-10 whitespace-nowrap transition-colors text-default-500 group-data-[selected=true]:text-primary" data-slot="tabContent"><div className="flex items-center gap-1.5"><span className="text-sm leading-5 font-normal text-blue-600">Applied</span></div></div></button><button data-key="discussion" data-slot="tab" tabIndex="-1" data-collection="react-aria7586308166-_r_1md_" data-react-aria-pressable="true" id="react-aria7586308166-_r_1me_-tab-discussion" aria-selected="false" role="tab" className="z-0 w-full py-1 flex group relative justify-center items-center cursor-pointer transition-opacity tap-highlight-transparent data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-30 outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 h-8 text-small rounded-none pb-3 pt-1 px-3 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] data-[hover-unselected=true]:opacity-100 border-b-2 border-transparent data-[selected=true]:border-red-500" type="button"><div className="relative z-10 whitespace-nowrap transition-colors text-default-500 group-data-[selected=true]:text-primary" data-slot="tabContent"><div className="flex items-center gap-1.5"><span className="text-sm leading-5 font-normal text-blue-600">In Discussion</span></div></div></button><button data-key="quotation" data-slot="tab" tabIndex="0" data-collection="react-aria7586308166-_r_1md_" data-react-aria-pressable="true" id="react-aria7586308166-_r_1me_-tab-quotation" aria-selected="true" role="tab" className="z-0 w-full py-1 flex group relative justify-center items-center cursor-pointer transition-opacity tap-highlight-transparent data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-30 outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 h-8 text-small rounded-none pb-3 pt-1 px-3 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] data-[hover-unselected=true]:opacity-100 border-b-2 border-transparent data-[selected=true]:border-red-500" type="button" data-selected="true"><div className="relative z-10 whitespace-nowrap transition-colors text-default-500 group-data-[selected=true]:text-primary" data-slot="tabContent"><div className="flex items-center gap-1.5"><span className="text-sm leading-5 text-primary font-semibold">Quotation</span><div className="relative max-w-fit inline-flex items-center justify-between box-border whitespace-nowrap text-tiny rounded-full text-default-700 h-4 min-w-4 px-1 bg-red-50 border border-zinc-100"><span className="flex-1 font-normal px-1 text-tiny text-default-foreground leading-4">{DUMMY_QUOTATIONS.length}</span></div></div></div></button></div></div></div></div><div className="mx-auto max-w-308 px-6 py-6"><div className="flex gap-6"><div className="w-226 flex-1"><div className="rounded-large shadow-neutral-sm border border-blue-50 bg-white p-6"><div className="flex flex-col relative gap-4 w-full"><div className="z-0 flex flex-col relative justify-between gap-4 bg-content1 overflow-auto rounded-large w-full p-0 shadow-none"><table aria-label="Quotations table" id="react-aria7586308166-_r_1n0_" role="grid" tabIndex="0" data-collection="react-aria7586308166-_r_1n1_" aria-describedby="" className="min-w-full h-auto table-auto w-full"><thead className="[&>tr]:first:rounded-lg after:content-[''] after:table-row after:h-[5px]" role="rowgroup"><tr role="row" className="group/tr outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 border-b border-divider last:border-0"><th tabIndex="-1" data-collection="react-aria7586308166-_r_1n1_" data-key="merchant" id="react-aria7586308166-_r_1n0_-merchant" role="columnheader" aria-colindex="1" data-react-aria-pressable="true" className="group/th px-3 h-10 align-middle whitespace-nowrap first:rounded-s-lg last:rounded-e-lg data-[sortable=true]:cursor-pointer data-[hover=true]:text-foreground-400 outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-start bg-blue-50 text-foreground-500 text-xs font-semibold uppercase first:rounded-l-lg last:rounded-r-lg" style={{"width": "310px"}}>MERCHANT NAME</th><th tabIndex="-1" data-collection="react-aria7586308166-_r_1n1_" data-key="match" id="react-aria7586308166-_r_1n0_-match" role="columnheader" aria-colindex="2" data-react-aria-pressable="true" className="group/th px-3 h-10 align-middle whitespace-nowrap first:rounded-s-lg last:rounded-e-lg data-[sortable=true]:cursor-pointer data-[hover=true]:text-foreground-400 outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-start bg-blue-50 text-foreground-500 text-xs font-semibold uppercase first:rounded-l-lg last:rounded-r-lg pl-4" style={{"width": "146px"}}>MATCH %</th><th tabIndex="-1" data-collection="react-aria7586308166-_r_1n1_" data-key="quoteValidity" id="react-aria7586308166-_r_1n0_-quoteValidity" role="columnheader" aria-colindex="3" data-react-aria-pressable="true" className="group/th px-3 h-10 align-middle whitespace-nowrap first:rounded-s-lg last:rounded-e-lg data-[sortable=true]:cursor-pointer data-[hover=true]:text-foreground-400 outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-start bg-blue-50 text-foreground-500 text-xs font-semibold uppercase first:rounded-l-lg last:rounded-r-lg" style={{"width": "180px"}}>QUOTE & VALIDITY</th><th tabIndex="-1" data-collection="react-aria7586308166-_r_1n1_" data-key="actions" id="react-aria7586308166-_r_1n0_-actions" role="columnheader" aria-colindex="4" data-react-aria-pressable="true" className="group/th px-3 h-10 align-middle whitespace-nowrap first:rounded-s-lg last:rounded-e-lg data-[sortable=true]:cursor-pointer data-[hover=true]:text-foreground-400 outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-start bg-blue-50 text-foreground-500 text-xs font-semibold uppercase first:rounded-l-lg last:rounded-r-lg">ACTIONS</th></tr></thead><tbody role="rowgroup" className="after:block">
  {DUMMY_QUOTATIONS.map((quote) => (
    <tr
      key={quote.id}
      data-first={quote.id === "quote-1"}
      role="row"
      tabIndex="-1"
      className="group/tr outline-solid outline-transparent border-b border-divider last:border-0 hover:bg-blue-25/40 transition-colors"
    >
      <td role="rowheader" className="px-3 relative align-middle whitespace-normal text-small font-normal text-start py-3.5">
        <div className="flex flex-col gap-1.5">
          {quote.isRecommended && (
            <div className="flex items-center">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                Recommended by Merchant Navy
              </span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <span tabIndex="-1" className="flex relative justify-center items-center box-border overflow-hidden align-middle z-0 outline-solid outline-transparent text-tiny bg-default text-default-foreground shadow-neutral-sm shrink-0 rounded-lg h-10 w-10">
              <img className="flex object-cover w-full h-full" alt={quote.merchantName} src={quote.avatar} />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-modified-15-semibold text-content1-foreground font-semibold">
                {quote.merchantName}
              </span>
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star text-warning" aria-hidden="true">
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
                <span className="text-sm leading-5 text-blue-600">
                  <span className="font-medium text-[#424976]">{quote.rating}</span>
                  <span> ({quote.reviewCount})</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </td>

      <td role="gridcell" className="px-3 relative align-middle whitespace-normal text-small font-normal text-start py-3.5">
        <div className="flex flex-col items-start justify-center gap-1">
          <div className="text-modified-15-semibold text-content1-foreground font-semibold">
            <span>{quote.matchPercent}</span>
            <span className="text-xs font-normal">%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-anchor text-content4-foreground" aria-hidden="true">
                <path d="M12 6v16"></path>
                <path d="m19 13 2-1a9 9 0 0 1-18 0l2 1"></path>
                <path d="M9 11h6"></path>
                <circle cx="12" cy="4" r="2"></circle>
              </svg>
              <span className="text-content4-foreground text-xs font-medium">{quote.portMatch}</span>
            </div>
            <div className="shrink-0 bg-divider border-none w-divider h-3 opacity-50" role="separator" data-orientation="vertical"></div>
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings text-content4-foreground" aria-hidden="true">
                <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span className="text-content4-foreground text-xs font-medium">{quote.serviceMatch}</span>
            </div>
          </div>
        </div>
      </td>

      <td role="gridcell" className="px-3 relative align-middle whitespace-normal text-small font-normal text-start py-3.5">
        <span className="text-small text-foreground">
          <div className="flex flex-col gap-0.5">
            <span className="text-modified-15-semibold text-content1-foreground font-semibold tracking-[-0.1px]">{quote.price}</span>
            <span className="text-[13px] leading-4.5 font-normal text-zinc-500">{quote.validityDate}</span>
          </div>
        </span>
      </td>

      <td role="gridcell" className="px-3 relative align-middle whitespace-normal text-small font-normal text-start py-3.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={"z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap subpixel-antialiased overflow-hidden tap-highlight-transparent min-w-16 text-tiny gap-2 rounded-small h-8 px-3 font-medium " + quote.statusColor}
          >
            {quote.status}
          </button>
          <a
            href="/chats"
            type="button"
            className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap subpixel-antialiased overflow-hidden tap-highlight-transparent border-medium min-w-16 text-tiny gap-2 rounded-small h-8 w-26.5 border-blue-200 px-3 font-medium text-[#1f285d] hover:bg-blue-50 transition-colors"
          >
            Open Thread
          </a>
          <button
            type="button"
            aria-label="More actions"
            className="group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal overflow-hidden tap-highlight-transparent rounded-small text-tiny text-default-foreground hover:bg-default/40 min-w-8 h-7 w-7 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis-vertical" aria-hidden="true">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody></table></div></div></div></div><div className="hidden w-64 lg:block"><div className="sticky top-43 flex flex-col gap-3"><div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large transition-transform-background motion-reduce:transition-none shadow-neutral-sm border border-blue-50 p-4" tabIndex="-1"><div className="relative flex w-full flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased gap-2 p-0"><div className="flex items-center justify-between"><p className="text-tiny text-zinc-500">Private Notes</p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info text-zinc-500" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg></div><div className="group flex flex-col data-[hidden=true]:hidden w-full" data-slot="base" data-filled="true" data-filled-within="true"><div data-slot="input-wrapper" className="relative w-full inline-flex tap-highlight-transparent flex-row items-center px-3 gap-3 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 h-10 min-h-10 rounded-medium !h-auto transition-background motion-reduce:transition-none !duration-150 outline-solid outline-transparent group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background py-2 bg-blue-25 shadow-sm" data-has-multiple-rows="true" style={{"cursor": "text"}}><div data-slot="inner-wrapper" className="inline-flex w-full h-full box-border items-start group-data-[has-label=true]:items-start"><textarea data-slot="input" className="w-full font-normal bg-transparent !outline-solid placeholder:text-foreground-500 focus-visible:outline-solid outline-transparent data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 data-[type=color]:rounded-none file:cursor-pointer file:bg-transparent file:border-0 autofill:bg-transparent bg-clip-text dark:autofill:[-webkit-text-fill-color:hsl(var(--heroui-foreground))] [&::-ms-reveal]:hidden text-small resize-none data-[hide-scroll=true]:scrollbar-hide group-data-[has-value=true]:text-default-foreground transition-height !duration-100 motion-reduce:transition-none text-foreground-500 [&::-webkit-scrollbar]:w-px [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-thumb]:rounded-full pe-0" aria-label="Add notes for this request…" placeholder="Add notes for this request…" tabIndex="0" id="react-aria7586308166-_r_1mo_" data-hide-scroll="true" title="" style={{"height": "80px !important"}}></textarea></div></div></div><div className="flex items-start gap-1 pt-3"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info mt-0.5 shrink-0 text-zinc-500" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg><p className="text-tiny leading-4 text-zinc-500">This note is saved with this request and visible only to you.</p></div></div></div><div className="flex flex-col gap-3 pt-2"><p className="text-tiny text-zinc-500">ID: #hFgU9ekBQNtdwVD3G76CM</p><hr className="shrink-0 bg-divider border-none w-full h-divider opacity-50" role="separator" data-orientation="horizontal" /><div className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye text-zinc-500" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg><p className="text-tiny text-zinc-500">7 Views</p></div></div></div></div></div></div></div>
    </>
  );
}
