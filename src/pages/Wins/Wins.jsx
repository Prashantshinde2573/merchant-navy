import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Wins.css';

const WINS_ITEMS = [
  {
    id: 'win-1',
    companyName: 'Indra Shipping Co.',
    avatarUrl: '/images/profile_avatar.webp',
    awardedDate: '28 Apr 2026',
    completedDate: '28 Apr 2026',
    status: 'completed',
    title: 'Multiple port services required for MV Indravati (45,000 DWT bulk carrier) arriving Visakhapatnam. Vendors with VPT authorisation and valid certifications only. Quotations invited for one or more serv...',
    serviceRequestId: 'xDxYWnPEWNLr6Fmxze5yh',
    serviceQuality: 5,
    timeliness: 5,
    communication: 5,
    port: 'Visakhapatnam',
    services: 'Freshwater Supply, Fuel Supply (VLSFO/HSFO), Crew Transport (Local), Garbage Collection & Disposal (MARPOL), Ship Chandlery (General)',
    amount: '$ 2,700'
  }
];

export function Wins() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWins = WINS_ITEMS.filter((win) => {
    if (activeTab === 'in-progress') return win.status === 'in-progress';
    if (activeTab === 'completed') return win.status === 'completed';
    return true;
  }).filter((win) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      win.companyName.toLowerCase().includes(q) ||
      win.title.toLowerCase().includes(q) ||
      win.port.toLowerCase().includes(q) ||
      win.services.toLowerCase().includes(q)
    );
  });

  const renderStars = (count = 5) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`lucide lucide-star ${
          i < count ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
        }`}
        aria-hidden="true"
      >
        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
      </svg>
    ));
  };

  return (
    <div className="wins-page-wrapper">
      <div className="mx-auto w-full max-w-5xl px-6 py-5">
        {/* Header section */}
        <div className="mb-6 wins-header-section">
          <h1 className="text-content1-foreground mb-2 text-2xl leading-8 font-semibold">
            Jobs awarded to your company
          </h1>
          <p className="text-base leading-6 font-normal text-zinc-500">
            Deliver. Mark complete. Build reputation.
          </p>
        </div>

        {/* Tabs & Controls row */}
        <div className="mb-6 flex items-center justify-between wins-toolbar-row">
          {/* Tabs */}
          <div data-slot="base" className="inline-flex w-auto wins-tabs-container">
            <div
              data-slot="tabList"
              className="relative flex h-fit items-center flex-nowrap overflow-x-scroll scrollbar-hide gap-2 bg-transparent p-0 rounded-none"
              role="tablist"
              aria-orientation="horizontal"
            >
              {/* All Tab */}
              <button
                data-key="all"
                data-selected={activeTab === 'all'}
                data-slot="tab"
                tabIndex={activeTab === 'all' ? 0 : -1}
                role="tab"
                onClick={() => setActiveTab('all')}
                className={`z-0 flex group relative justify-center items-center cursor-pointer transition-opacity tap-highlight-transparent text-small rounded-none px-3 py-3 h-auto border-b-2 ${
                  activeTab === 'all'
                    ? 'border-red-500 text-primary font-semibold'
                    : 'border-transparent text-blue-600 font-normal hover:opacity-80'
                }`}
                type="button"
              >
                <div className="relative z-10 whitespace-nowrap transition-colors" data-slot="tabContent">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm leading-5 font-semibold">All</span>
                    <span className="text-tiny flex h-4 min-w-4 items-center justify-center rounded-full border border-zinc-100 bg-red-50 px-1 text-red-600 text-[11px] font-semibold">
                      1
                    </span>
                  </div>
                </div>
              </button>

              {/* In Progress Tab */}
              <button
                data-key="in-progress"
                data-selected={activeTab === 'in-progress'}
                data-slot="tab"
                tabIndex={activeTab === 'in-progress' ? 0 : -1}
                role="tab"
                onClick={() => setActiveTab('in-progress')}
                className={`z-0 flex group relative justify-center items-center cursor-pointer transition-opacity tap-highlight-transparent text-small rounded-none px-3 py-3 h-auto border-b-2 ${
                  activeTab === 'in-progress'
                    ? 'border-red-500 text-primary font-semibold'
                    : 'border-transparent text-blue-600 font-normal hover:opacity-80'
                }`}
                type="button"
              >
                <div className="relative z-10 whitespace-nowrap transition-colors" data-slot="tabContent">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm leading-5 font-semibold">In Progress</span>
                    <span className="text-tiny flex h-4 min-w-4 items-center justify-center rounded-full border border-zinc-100 bg-red-50 px-1 text-red-600 text-[11px] font-semibold">
                      0
                    </span>
                  </div>
                </div>
              </button>

              {/* Completed Tab */}
              <button
                data-key="completed"
                data-selected={activeTab === 'completed'}
                data-slot="tab"
                tabIndex={activeTab === 'completed' ? 0 : -1}
                role="tab"
                onClick={() => setActiveTab('completed')}
                className={`z-0 flex group relative justify-center items-center cursor-pointer transition-opacity tap-highlight-transparent text-small rounded-none px-3 py-3 h-auto border-b-2 ${
                  activeTab === 'completed'
                    ? 'border-red-500 text-primary font-semibold'
                    : 'border-transparent text-blue-600 font-normal hover:opacity-80'
                }`}
                type="button"
              >
                <div className="relative z-10 whitespace-nowrap transition-colors" data-slot="tabContent">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm leading-5 font-medium">Completed</span>
                    <span className="text-tiny flex h-4 min-w-4 items-center justify-center rounded-full border border-zinc-100 bg-red-50 px-1 text-red-600 text-[11px] font-semibold">
                      1
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Search and Expiry button */}
          <div className="flex items-center gap-3 wins-controls-container">
            {/* Search Input */}
            <div className="group flex flex-col relative justify-end w-64 wins-search-box">
              <div className="h-full flex flex-col">
                <div
                  className="relative w-full inline-flex tap-highlight-transparent flex-row items-center shadow-xs px-3 gap-3 h-10 min-h-10 rounded-large transition-background bg-content1 border border-blue-100 bg-white"
                  style={{ cursor: 'text' }}
                >
                  <div className="inline-flex w-full items-center h-full box-border">
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
                      className="lucide lucide-search text-zinc-400 shrink-0"
                      aria-hidden="true"
                    >
                      <path d="m21 21-4.34-4.34"></path>
                      <circle cx="11" cy="11" r="8"></circle>
                    </svg>
                    <input
                      className="w-full font-normal bg-transparent outline-none placeholder:text-zinc-400 text-small text-zinc-800 ps-1.5 pe-1.5 text-sm"
                      aria-label="Search..."
                      placeholder="Search..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Expiry first Button */}
            <button
              type="button"
              className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden border px-4 min-w-20 h-10 text-small gap-2 rounded-medium bg-transparent text-foreground border-blue-200 hover:bg-blue-50 cursor-pointer wins-filter-btn text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-funnel text-zinc-400"
                aria-hidden="true"
              >
                <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path>
              </svg>
              Expiry first
            </button>
          </div>
        </div>

        {/* Cards List */}
        <div className="flex flex-col gap-4">
          {filteredWins.length > 0 ? (
            filteredWins.map((win) => (
              <div
                key={win.id}
                className="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 shadow-medium rounded-large shadow-neutral-sm w-full border border-blue-50 bg-white"
              >
                <div className="relative flex w-full flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased gap-4 p-7 wins-card-body">
                  {/* Top row: Company details + Completed date */}
                  <div className="flex flex-wrap items-start justify-between gap-3 wins-card-header">
                    <div className="flex gap-3 items-center">
                      <span className="flex relative justify-center items-center box-border overflow-hidden align-middle z-0 text-tiny bg-blue-100 text-blue-900 shadow-neutral-sm h-12 w-12 shrink-0 rounded-lg font-bold text-lg">
                        {win.avatarUrl ? (
                          <img
                            className="flex object-cover w-full h-full rounded-lg"
                            alt={win.companyName}
                            src={win.avatarUrl}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          'I'
                        )}
                      </span>
                      <div className="flex min-w-0 flex-col gap-1">
                        <h3 className="text-base font-semibold text-[#18181b] leading-tight">
                          {win.companyName}
                        </h3>
                        <p className="text-xs text-zinc-500">Awarded on {win.awardedDate}</p>
                      </div>
                    </div>
                    <p className="text-emerald-600 shrink-0 text-sm leading-5 font-medium">
                      Completed on {win.completedDate}
                    </p>
                  </div>

                  {/* Description / Requirement */}
                  <div>
                    <p className="text-[15px] leading-[1.4] tracking-[-0.1px] text-[#27272a]">
                      {win.title}
                      <Link
                        className="ml-1 text-[#696f93] hover:text-zinc-700 font-medium"
                        to={`/service-requests/${win.serviceRequestId}`}
                      >
                        ...more
                      </Link>
                    </p>
                  </div>

                  {/* Rating parameters */}
                  <div className="flex flex-wrap gap-6 wins-ratings-row">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm leading-5 font-normal text-zinc-500">Service Quality</p>
                      <div className="flex gap-0.5">{renderStars(win.serviceQuality)}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm leading-5 font-normal text-zinc-500">Timeliness</p>
                      <div className="flex gap-0.5">{renderStars(win.timeliness)}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm leading-5 font-normal text-zinc-500">Communication</p>
                      <div className="flex gap-0.5">{renderStars(win.communication)}</div>
                    </div>
                  </div>

                  {/* Port & Services */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded bg-blue-50">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-anchor text-primary"
                          aria-hidden="true"
                        >
                          <path d="M12 6v16"></path>
                          <path d="m19 13 2-1a9 9 0 0 1-18 0l2 1"></path>
                          <path d="M9 11h6"></path>
                          <circle cx="12" cy="4" r="2"></circle>
                        </svg>
                      </div>
                      <p className="text-sm leading-5 font-normal text-zinc-700">{win.port}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded bg-blue-50">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-settings text-primary"
                          aria-hidden="true"
                        >
                          <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </div>
                      <p className="text-sm leading-5 font-normal text-zinc-700">{win.services}</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <hr className="shrink-0 bg-gray-200 border-none w-full h-[1px] opacity-50" role="separator" />

                  {/* Footer: Price & View Details */}
                  <div className="flex flex-wrap items-center justify-between gap-3 wins-card-footer">
                    <div className="text-lg leading-7 font-semibold text-[#27272a]">{win.amount}</div>
                    <div className="flex items-center gap-3">
                      <Link
                        className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap subpixel-antialiased overflow-hidden tap-highlight-transparent cursor-pointer border px-4 min-w-20 gap-2 rounded-medium bg-transparent hover:bg-blue-50 text-primary h-10 border-blue-200 text-sm font-medium"
                        to={`/service-requests/${win.serviceRequestId}`}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-large p-12 text-center border border-blue-50 shadow-sm">
              <div className="flex justify-center mb-3 text-zinc-400">
                <span className="material-symbols-outlined text-5xl">award_star</span>
              </div>
              <h3 className="text-base font-semibold text-zinc-800 mb-1">No awards found</h3>
              <p className="text-sm text-zinc-500">There are no jobs matching your selection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
