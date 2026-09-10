import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { usePosts } from '../../context/PostContext';
import { DEFAULT_MY_POST, POSTS_DATA } from '../../data/postsData';
import { getQuotationsForPost } from '../../data/quotationsData';
import { PostContentWithTranslation } from '../../components/PostTranslation/PostTranslation';
import './MyPostDetail.css';

export function MyPostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { getPost } = usePosts();
  
  const initialTab = searchParams.get('tab') || location.state?.tab || 'scope';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeSection, setActiveSection] = useState('attachments');
  const [privateNote, setPrivateNote] = useState('');

  useEffect(() => {
    const tabParam = searchParams.get('tab') || location.state?.tab;
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams, location.state]);

  // Fallback to DEFAULT_MY_POST (merchant-navy 13)
  const postId = id || 'my-post-1';
  const post = POSTS_DATA[postId] || getPost(postId) || DEFAULT_MY_POST;
  const quotations = getQuotationsForPost(post?.id || postId);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const isMobile = window.innerWidth < 768;
      const yOffset = isMobile ? -200 : -140;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="relative min-h-[calc(100vh-56px)] my-post-detail-container">
        {/* Sticky Sub-Header */}
        <div className="border-default-100 bg-white sticky top-14 z-40 border-b shadow-sm my-post-detail-header-wrap">
          <div className="mx-auto max-w-300 px-6 my-post-detail-header-inner">
            <div className="flex h-16 items-center justify-between my-post-detail-header-top">
              {/* Back button + Post Title & Services */}
              <div className="relative flex flex-1 items-start gap-3 my-post-detail-header-left">
                <button
                  type="button"
                  tabIndex="0"
                  onClick={() => navigate('/my-posts')}
                  aria-label="Go back to My Posts"
                  className="z-0 group inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] cursor-pointer outline-solid outline-transparent border-medium text-tiny gap-2 rounded-small px-0 !gap-0 transition-colors bg-transparent text-foreground min-w-8 hover:opacity-hover absolute top-2 -left-17.5 h-9 w-9 border-blue-100 my-post-detail-back-btn"
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
                    className="lucide lucide-arrow-left"
                    aria-hidden="true"
                  >
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                  </svg>
                </button>

                <div className="flex max-w-150 flex-1 flex-col gap-0.5 my-post-detail-header-text">
                  <h2 className="text-content1-foreground truncate text-lg leading-7 font-semibold my-post-detail-title">
                    {post.title || post.scopeOfWork}
                  </h2>
                  <p className="truncate text-sm leading-5 text-zinc-500 my-post-detail-services-sub">
                    <span className="font-medium">Services:</span> {post.services?.join(', ')}
                  </p>
                </div>
              </div>

              {/* Status pill & Actions */}
              <div className="flex items-center gap-5 my-post-detail-header-actions">
                <div className="flex items-center gap-3">
                  {post.isUrgent && (
                    <div className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap px-1 h-7 text-small rounded-small text-default-foreground bg-danger-100">
                      <span className="flex-1 px-2 text-danger-600 font-semibold text-[13px]">
                        Urgent
                      </span>
                    </div>
                  )}
                </div>

                <div className="shrink-0 bg-divider border-none w-divider h-5 opacity-50 hidden sm:block" role="separator" />

                <div className="flex items-center gap-4">
                  {/* Edit Post Button */}
                  <button
                    type="button"
                    tabIndex="0"
                    className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] cursor-pointer outline-solid outline-transparent border-medium min-w-16 gap-2 rounded-small text-primary h-9 border-blue-200 px-4 text-sm font-medium hover:bg-blue-50 transition-colors"
                  >
                    Edit Post
                  </button>

                  {/* Share Post Button */}
                  <button
                    type="button"
                    tabIndex="0"
                    aria-label="Share post"
                    className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent cursor-pointer outline-solid outline-transparent text-tiny gap-2 rounded-small px-0 !gap-0 transition-colors bg-transparent text-default-foreground hover:bg-default/40 min-w-8 w-8 h-8"
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
                      className="lucide lucide-share2"
                      aria-hidden="true"
                    >
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                    </svg>
                  </button>

                  {/* Ellipsis Menu Button */}
                  <button
                    type="button"
                    tabIndex="0"
                    aria-label="More actions"
                    className="group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal overflow-hidden tap-highlight-transparent cursor-pointer outline-solid outline-transparent text-tiny gap-2 rounded-small px-0 !gap-0 transition-colors bg-transparent text-default-foreground hover:bg-default/40 min-w-8 w-8 h-8"
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
                      className="lucide lucide-ellipsis-vertical"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Navigation List */}
            <div data-slot="base" className="inline-flex my-post-detail-tab-wrap">
              <div
                data-slot="tabList"
                className="flex h-fit items-center flex-nowrap overflow-x-scroll scrollbar-hide gap-6 w-full relative rounded-none p-0 border-none bg-transparent"
                role="tablist"
                aria-orientation="horizontal"
              >
                {/* Scope Tab */}
                <button
                  type="button"
                  role="tab"
                  onClick={() => handleTabChange('scope')}
                  aria-selected={activeTab === 'scope'}
                  data-selected={activeTab === 'scope'}
                  className="z-0 py-1 flex group relative justify-center items-center cursor-pointer transition-opacity tap-highlight-transparent outline-solid outline-transparent h-8 text-small rounded-none pb-3 pt-1 px-3 border-b-2 border-transparent data-[selected=true]:border-red-500"
                >
                  <div className="relative z-10 whitespace-nowrap transition-colors text-default-500 group-data-[selected=true]:text-primary">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm leading-5 ${activeTab === 'scope' ? 'text-primary font-semibold' : 'text-blue-600 font-normal'}`}>
                        Scope
                      </span>
                    </div>
                  </div>
                </button>

                {/* Applied Tab */}
                <button
                  type="button"
                  role="tab"
                  onClick={() => handleTabChange('applied')}
                  aria-selected={activeTab === 'applied'}
                  data-selected={activeTab === 'applied'}
                  className="z-0 py-1 flex group relative justify-center items-center cursor-pointer transition-opacity tap-highlight-transparent outline-solid outline-transparent h-8 text-small rounded-none pb-3 pt-1 px-3 border-b-2 border-transparent data-[selected=true]:border-red-500"
                >
                  <div className="relative z-10 whitespace-nowrap transition-colors text-default-500 group-data-[selected=true]:text-primary">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm leading-5 ${activeTab === 'applied' ? 'text-primary font-semibold' : 'text-blue-600 font-normal'}`}>
                        Applied
                      </span>
                      <div className="relative max-w-fit inline-flex items-center justify-between box-border whitespace-nowrap text-tiny rounded-full text-default-700 h-4 min-w-4 px-1 bg-red-50 border border-zinc-100">
                        <span className="flex-1 font-normal px-1 text-tiny text-default-foreground leading-4">
                          {post.appliedCount ?? 1}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* In Discussion Tab */}
                <button
                  type="button"
                  role="tab"
                  onClick={() => handleTabChange('discussion')}
                  aria-selected={activeTab === 'discussion'}
                  data-selected={activeTab === 'discussion'}
                  className="z-0 py-1 flex group relative justify-center items-center cursor-pointer transition-opacity tap-highlight-transparent outline-solid outline-transparent h-8 text-small rounded-none pb-3 pt-1 px-3 border-b-2 border-transparent data-[selected=true]:border-red-500"
                >
                  <div className="relative z-10 whitespace-nowrap transition-colors text-default-500 group-data-[selected=true]:text-primary">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm leading-5 ${activeTab === 'discussion' ? 'text-primary font-semibold' : 'text-blue-600 font-normal'}`}>
                        In Discussion
                      </span>
                    </div>
                  </div>
                </button>

                {/* Quotation Tab */}
                <button
                  type="button"
                  role="tab"
                  onClick={() => handleTabChange('quotation')}
                  aria-selected={activeTab === 'quotation'}
                  data-selected={activeTab === 'quotation'}
                  className="z-0 py-1 flex group relative justify-center items-center cursor-pointer transition-opacity tap-highlight-transparent outline-solid outline-transparent h-8 text-small rounded-none pb-3 pt-1 px-3 border-b-2 border-transparent data-[selected=true]:border-red-500"
                >
                  <div className="relative z-10 whitespace-nowrap transition-colors text-default-500 group-data-[selected=true]:text-primary">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm leading-5 ${activeTab === 'quotation' ? 'text-primary font-semibold' : 'text-blue-600 font-normal'}`}>
                        Quotation
                      </span>
                      <div className="relative max-w-fit inline-flex items-center justify-between box-border whitespace-nowrap text-tiny rounded-full text-default-700 h-4 min-w-4 px-1 bg-red-50 border border-zinc-100">
                        <span className="flex-1 font-normal px-1 text-tiny text-default-foreground leading-4">
                          {quotations.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="mx-auto max-w-308 px-6 py-6 my-post-detail-content-wrap">
          <div className="flex gap-6 my-post-detail-grid">
            {/* Left Content Column */}
            <div className="w-226 flex-1 my-post-detail-left">
              {activeTab === 'quotation' ? (
                /* Quotations Section Tab View */
                <div className="rounded-large shadow-neutral-sm border border-blue-50 bg-white p-6 my-post-detail-quotations-card">
                  <div className="flex flex-col relative gap-4 w-full">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-zinc-900">
                          Received Quotations ({quotations.length})
                        </h3>
                        <p className="text-xs text-zinc-500">
                          Compare received vendor quotes and award contracts.
                        </p>
                      </div>
                    </div>

                    {quotations.length > 0 ? (
                      <>
                        {/* Desktop View Table (>= 768px) - 100% untouched */}
                        <div className="desktop-quotations-table z-0 relative bg-content1 overflow-x-auto rounded-large w-full p-0 shadow-none">
                          <table
                            aria-label="Quotations table"
                            role="grid"
                            className="min-w-full h-auto table-auto w-full text-left"
                          >
                            <thead className="[&>tr]:first:rounded-lg after:content-[''] after:table-row after:h-[5px]" role="rowgroup">
                              <tr role="row" className="group/tr border-b border-divider last:border-0">
                                <th className="px-3 h-10 align-middle whitespace-nowrap bg-blue-50 text-foreground-500 text-xs font-semibold uppercase first:rounded-l-lg" style={{ minWidth: '220px', width: '36%' }}>
                                  MERCHANT NAME
                                </th>
                                <th className="px-3 h-10 align-middle whitespace-nowrap bg-blue-50 text-foreground-500 text-xs font-semibold uppercase pl-4" style={{ minWidth: '110px', width: '18%' }}>
                                  MATCH %
                                </th>
                                <th className="px-3 h-10 align-middle whitespace-nowrap bg-blue-50 text-foreground-500 text-xs font-semibold uppercase" style={{ minWidth: '130px', width: '20%' }}>
                                  QUOTE &amp; VALIDITY
                                </th>
                                <th className="px-3 h-10 align-middle whitespace-nowrap bg-blue-50 text-foreground-500 text-xs font-semibold uppercase last:rounded-r-lg" style={{ minWidth: '180px', width: '26%' }}>
                                  ACTIONS
                                </th>
                              </tr>
                            </thead>
                            <tbody role="rowgroup" className="after:block divide-y divide-gray-100">
                              {quotations.map((quote, idx) => (
                                <tr
                                  key={quote.id}
                                  data-first={idx === 0}
                                  role="row"
                                  className={`group/tr border-b border-divider last:border-0 hover:bg-blue-25/40 transition-colors relative ${quote.isRecommended ? 'recommended-quotation-row' : ''}`}
                                >
                                  {/* Merchant Name & Recommendation */}
                                  <td role="rowheader" className="px-3 relative align-middle whitespace-normal text-small font-normal text-start py-3.5">
                                    {quote.isRecommended && (
                                      <div className="recommended-row-accent" aria-hidden="true" />
                                    )}
                                    <div className="flex flex-col gap-2">
                                      {quote.isRecommended && (
                                        <div className="flex items-center">
                                          <div
                                            className="recommended-badge-pill"
                                            aria-label="Recommended by Merchant Navy"
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="13"
                                              height="13"
                                              viewBox="0 0 24 24"
                                              fill="#e5a500"
                                              className="shrink-0"
                                              aria-hidden="true"
                                            >
                                              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                                            </svg>
                                            <span>Recommended by Merchant Navy</span>
                                          </div>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-3">
                                        <span
                                          tabIndex="-1"
                                          className="flex relative justify-center items-center box-border overflow-hidden align-middle z-0 text-tiny bg-default text-default-foreground shadow-neutral-sm shrink-0 rounded-lg h-10 w-10"
                                        >
                                          <img
                                            className="flex object-cover w-full h-full"
                                            alt={quote.merchantName}
                                            src={quote.avatar}
                                            onError={(e) => {
                                              e.target.style.display = 'none';
                                            }}
                                          />
                                        </span>
                                        <div className="flex flex-col gap-0.5 min-w-0">
                                          <Link
                                            to={`/quotations/${quote.id}`}
                                            state={{ fromPostId: post.id }}
                                            className="text-modified-15-semibold text-content1-foreground font-semibold hover:text-primary transition-colors cursor-pointer truncate"
                                          >
                                            {quote.merchantName}
                                          </Link>
                                          <div className="flex items-center gap-1">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="14"
                                              height="14"
                                              viewBox="0 0 24 24"
                                              fill="currentColor"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              className="lucide lucide-star text-amber-400 shrink-0"
                                              aria-hidden="true"
                                            >
                                              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
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

                                  {/* Match % */}
                                  <td role="gridcell" className="px-3 relative align-middle whitespace-normal text-small font-normal text-start py-3.5">
                                    <div className="flex flex-col items-start justify-center gap-1">
                                      <div className="text-modified-15-semibold text-content1-foreground font-semibold">
                                        <span>{quote.matchPercent}</span>
                                        <span className="text-xs font-normal">%</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-anchor text-content4-foreground" aria-hidden="true">
                                            <path d="M12 6v16" />
                                            <path d="m19 13 2-1a9 9 0 0 1-18 0l2 1" />
                                            <path d="M9 11h6" />
                                            <circle cx="12" cy="4" r="2" />
                                          </svg>
                                          <span className="text-content4-foreground text-xs font-medium">{quote.portMatch}</span>
                                        </div>
                                        <div className="shrink-0 bg-divider border-none w-divider h-3 opacity-50" role="separator" data-orientation="vertical" />
                                        <div className="flex items-center gap-1">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings text-content4-foreground" aria-hidden="true">
                                            <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
                                            <circle cx="12" cy="12" r="3" />
                                          </svg>
                                          <span className="text-content4-foreground text-xs font-medium">{quote.serviceMatch}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Quote & Validity */}
                                  <td role="gridcell" className="px-3 relative align-middle whitespace-normal text-small font-normal text-start py-3.5">
                                    <span className="text-small text-foreground">
                                      <div className="flex flex-col gap-0.5">
                                        <span className="text-modified-15-semibold text-content1-foreground font-semibold tracking-[-0.1px]">{quote.price}</span>
                                        <span className="text-[13px] leading-4.5 font-normal text-zinc-500">{quote.validityDate}</span>
                                      </div>
                                    </span>
                                  </td>

                                  {/* Actions */}
                                  <td role="gridcell" className="px-3 relative align-middle whitespace-normal text-small font-normal text-start py-3.5">
                                    <div className="flex items-center gap-2">
                                      {quote.isAwarded && (
                                        <button
                                          type="button"
                                          disabled
                                          className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap subpixel-antialiased overflow-hidden tap-highlight-transparent min-w-16 text-tiny rounded-small h-8 px-3 font-medium bg-[#0e793c] text-white cursor-default"
                                        >
                                          Awarded
                                        </button>
                                      )}
                                      <Link
                                        to="/chats"
                                        className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap subpixel-antialiased overflow-hidden tap-highlight-transparent border border-blue-200 min-w-16 text-tiny rounded-small h-8 px-3 font-medium text-[#1f285d] hover:bg-blue-50 transition-colors"
                                      >
                                        Open Thread
                                      </Link>
                                      <button
                                        type="button"
                                        aria-label="More options"
                                        className="inline-flex items-center justify-center h-8 w-8 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors shrink-0 cursor-pointer"
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
                                          className="lucide lucide-ellipsis-vertical"
                                          aria-hidden="true"
                                        >
                                          <circle cx="12" cy="12" r="1" />
                                          <circle cx="12" cy="5" r="1" />
                                          <circle cx="12" cy="19" r="1" />
                                        </svg>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile View Vertical Cards (< 768px) - Zero Horizontal Scroll */}
                        <div className="mobile-quotations-cards">
                          {quotations.map((quote) => (
                            <div
                              key={quote.id}
                              className={`bg-white border ${quote.isRecommended ? 'border-blue-200 recommended-quotation-row' : 'border-blue-100/90'} rounded-xl p-4 shadow-sm flex flex-col gap-3 w-full box-border relative overflow-hidden`}
                            >
                              {/* Left Blue Accent Bar for Recommended */}
                              {quote.isRecommended && (
                                <div className="recommended-row-accent" aria-hidden="true" />
                              )}

                              {/* Recommendation badge */}
                              {quote.isRecommended && (
                                <div className="flex items-center">
                                  <div
                                    className="recommended-badge-pill"
                                    aria-label="Recommended by Merchant Navy"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="13"
                                      height="13"
                                      viewBox="0 0 24 24"
                                      fill="#e5a500"
                                      className="shrink-0"
                                      aria-hidden="true"
                                    >
                                      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                                    </svg>
                                    <span>Recommended by Merchant Navy</span>
                                  </div>
                                </div>
                              )}

                              {/* Merchant Info */}
                              <div className="flex items-start gap-3 min-w-0">
                                <span className="flex relative justify-center items-center box-border overflow-hidden align-middle z-0 bg-default text-default-foreground shadow-neutral-sm shrink-0 rounded-lg h-10 w-10">
                                  <img
                                    className="flex object-cover w-full h-full"
                                    alt={quote.merchantName}
                                    src={quote.avatar}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                </span>
                                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                                  <Link
                                    to={`/quotations/${quote.id}`}
                                    state={{ fromPostId: post.id }}
                                    className="text-[15px] font-semibold text-zinc-900 hover:text-primary transition-colors cursor-pointer leading-snug break-words"
                                  >
                                    {quote.merchantName}
                                  </Link>
                                  <div className="flex items-center gap-1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="13"
                                      height="13"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="lucide lucide-star text-amber-400 shrink-0"
                                      aria-hidden="true"
                                    >
                                      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                                    </svg>
                                    <span className="text-xs text-zinc-500">
                                      <span className="font-semibold text-zinc-800">{quote.rating}</span>
                                      <span> ({quote.reviewCount})</span>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Metrics Row: Match % & Quote/Validity */}
                              <div className="grid grid-cols-2 gap-2 bg-slate-50/80 rounded-lg p-2.5 border border-slate-100">
                                {/* Match % */}
                                <div className="flex flex-col gap-1 min-w-0">
                                  <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Match</span>
                                  <div className="text-sm font-bold text-zinc-900">
                                    {quote.matchPercent}<span className="text-xs font-normal text-zinc-500">%</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs text-zinc-600 flex-wrap">
                                    <span className="inline-flex items-center gap-0.5 text-[11px]">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-anchor text-zinc-400 shrink-0" aria-hidden="true"><path d="M12 6v16" /><path d="m19 13 2-1a9 9 0 0 1-18 0l2 1" /><path d="M9 11h6" /><circle cx="12" cy="4" r="2" /></svg>
                                      {quote.portMatch}
                                    </span>
                                    <span className="text-zinc-300">|</span>
                                    <span className="inline-flex items-center gap-0.5 text-[11px]">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings text-zinc-400 shrink-0" aria-hidden="true"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /><circle cx="12" cy="12" r="3" /></svg>
                                      {quote.serviceMatch}
                                    </span>
                                  </div>
                                </div>

                                {/* Quote & Validity */}
                                <div className="flex flex-col gap-1 min-w-0 border-l border-slate-200/60 pl-2.5">
                                  <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Quote</span>
                                  <div className="text-sm font-bold text-zinc-900 truncate">
                                    {quote.price}
                                  </div>
                                  <div className="text-[11px] text-zinc-500 truncate">
                                    {quote.validityDate}
                                  </div>
                                </div>
                              </div>

                              {/* Action Row */}
                              <div className="flex items-center justify-between gap-2 pt-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {quote.isAwarded && (
                                    <button
                                      type="button"
                                      disabled
                                      className="inline-flex items-center justify-center h-8 px-3 text-xs font-semibold rounded-md bg-[#0e793c] text-white cursor-default"
                                    >
                                      Awarded
                                    </button>
                                  )}
                                  <Link
                                    to="/chats"
                                    className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium rounded-md border border-blue-200 text-[#1f285d] hover:bg-blue-50 transition-colors"
                                  >
                                    Open Thread
                                  </Link>
                                </div>
                                <button
                                  type="button"
                                  aria-label="More options"
                                  className="inline-flex items-center justify-center h-8 w-8 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors shrink-0 cursor-pointer"
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
                                    className="lucide lucide-ellipsis-vertical"
                                    aria-hidden="true"
                                  >
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-100">
                        <span className="material-symbols-outlined text-4xl text-zinc-400 mb-2">request_quote</span>
                        <h4 className="text-sm font-semibold text-zinc-700">No Quotations Yet</h4>
                        <p className="text-xs text-zinc-500 mt-1">
                          No merchants have submitted quotations for this post yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Scope Tab / Default View */
                <div className="space-y-4">
                  {/* Attachments Section */}
                  <div
                    className="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 outline-solid outline-transparent shadow-neutral-sm rounded-large border border-blue-50 p-5 my-post-detail-card"
                    tabIndex="-1"
                    id="attachments"
                  >
                    <div className="flex z-10 w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large p-0 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-700">attach_file</span>
                        <h3 className="text-content2-foreground text-base leading-6 font-semibold">
                          Attachments
                        </h3>
                      </div>
                    </div>
                    <div className="relative flex w-full flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased p-0">
                      <p className="text-sm leading-5 text-zinc-500">No attachments available</p>
                    </div>
                  </div>

                  {/* Ports & Services Section */}
                  <div
                    className="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 outline-solid outline-transparent shadow-neutral-sm rounded-large border border-blue-50 p-5 my-post-detail-card"
                    tabIndex="-1"
                    id="ports-services"
                  >
                    <div className="relative flex w-full flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased p-0">
                      <div className="space-y-3">
                        {/* Port Locations */}
                        <div className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-zinc-500">anchor</span>
                          <div className="flex flex-1 flex-col gap-3">
                            <h4 className="text-content2-foreground text-base leading-6 font-semibold">
                              Port Locations
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {post.ports?.map((port, idx) => (
                                <div
                                  key={idx}
                                  className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap text-small text-default-700 h-7 rounded px-2 border border-[#E0E0E0] bg-white my-post-detail-pill"
                                >
                                  <span className="flex-1 px-1 text-[14px] font-medium leading-5 text-[#3f3f46]">
                                    {port}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <hr className="shrink-0 bg-divider border-none w-full h-divider my-4" role="separator" />

                        {/* Services Required */}
                        <div className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-zinc-500">settings</span>
                          <div className="flex flex-1 flex-col gap-3">
                            <h4 className="text-content2-foreground text-base leading-6 font-semibold">
                              Services Required
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {post.services?.map((service, idx) => (
                                <div
                                  key={idx}
                                  className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap text-small text-default-700 h-7 rounded px-2 border border-[#E0E0E0] bg-white my-post-detail-pill"
                                >
                                  <span className="flex-1 px-1 text-[14px] font-medium leading-5 text-[#3f3f46]">
                                    {service}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scope of Work Section */}
                  <div
                    className="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 outline-solid outline-transparent shadow-neutral-sm rounded-large border border-blue-50 p-5 my-post-detail-card"
                    tabIndex="-1"
                    id="scope-of-work"
                  >
                    <div className="flex z-10 w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large p-0 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-700">description</span>
                        <h3 className="text-content2-foreground text-base leading-6 font-semibold">
                          Scope of Work
                        </h3>
                      </div>
                    </div>
                    <div className="relative flex w-full flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased p-0 wrap-break-word whitespace-break-spaces">
                      <div className="prose text-content1-foreground text-modified-15 max-w-none">
                        <PostContentWithTranslation postId={post.id} text={post.scopeOfWork} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar Column */}
            <div className="hidden w-64 lg:block my-post-detail-sidebar">
              <div className="sticky top-43 flex flex-col gap-3">
                {/* Budget & Service Date Card */}
                <div
                  className="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 outline-solid outline-transparent shadow-neutral-sm rounded-large border border-blue-50 p-4"
                  tabIndex="-1"
                >
                  <div className="relative flex w-full flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased gap-3 p-0">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-tiny text-zinc-500">Budget</p>
                      {post.budget && (
                        <p className="text-content2-foreground text-base leading-6 font-semibold">
                          {post.budget}
                        </p>
                      )}
                    </div>
                    <hr className="shrink-0 border-none w-full h-divider bg-blue-200 opacity-50" role="separator" />
                    <div className="flex flex-col gap-0.5">
                      <p className="text-tiny text-zinc-500">Service Date</p>
                      <p className="text-content2-foreground text-base leading-6 font-semibold">
                        {post.serviceDate || 'ASAP'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* On This Page Nav */}
                <div
                  className="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 outline-solid outline-transparent shadow-neutral-sm rounded-large border border-blue-50 p-4"
                  tabIndex="-1"
                >
                  <div className="relative flex w-full flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased gap-2 p-0">
                    <h3 className="text-tiny text-zinc-500">On this page</h3>
                    <nav className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('scope');
                          scrollToSection('attachments');
                        }}
                        className={`w-full cursor-pointer rounded px-2 py-0.5 text-left text-sm leading-5 font-medium transition-colors ${
                          activeTab === 'scope' && activeSection === 'attachments'
                            ? 'text-[#1F285D] font-semibold bg-blue-25'
                            : 'hover:bg-blue-25 text-[#0F172B99] hover:text-zinc-900'
                        }`}
                      >
                        Attachments
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('scope');
                          scrollToSection('ports-services');
                        }}
                        className={`w-full cursor-pointer rounded px-2 py-0.5 text-left text-sm leading-5 font-medium transition-colors ${
                          activeTab === 'scope' && activeSection === 'ports-services'
                            ? 'text-[#1F285D] font-semibold bg-blue-25'
                            : 'hover:bg-blue-25 text-[#0F172B99] hover:text-zinc-900'
                        }`}
                      >
                        Ports &amp; Services
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('scope');
                          scrollToSection('scope-of-work');
                        }}
                        className={`w-full cursor-pointer rounded px-2 py-0.5 text-left text-sm leading-5 font-medium transition-colors ${
                          activeTab === 'scope' && activeSection === 'scope-of-work'
                            ? 'text-[#1F285D] font-semibold bg-blue-25'
                            : 'hover:bg-blue-25 text-[#0F172B99] hover:text-zinc-900'
                        }`}
                      >
                        Scope of Work
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('quotation')}
                        className={`w-full cursor-pointer rounded px-2 py-0.5 text-left text-sm leading-5 font-medium transition-colors ${
                          activeTab === 'quotation'
                            ? 'text-[#1F285D] font-semibold bg-blue-25'
                            : 'hover:bg-blue-25 text-[#0F172B99] hover:text-zinc-900'
                        }`}
                      >
                        Quotations ({quotations.length})
                      </button>
                    </nav>
                  </div>
                </div>

                {/* Private Notes Card */}
                <div
                  className="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 outline-solid outline-transparent shadow-neutral-sm rounded-large border border-blue-50 p-4"
                  tabIndex="-1"
                >
                  <div className="relative flex w-full flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased gap-2 p-0">
                    <div className="flex items-center justify-between">
                      <p className="text-tiny text-zinc-500">Private Notes</p>
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
                        className="lucide lucide-info text-zinc-500"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                    </div>
                    <div className="group flex flex-col w-full">
                      <div className="relative w-full inline-flex tap-highlight-transparent flex-row items-center px-3 gap-3 h-10 min-h-10 rounded-medium !h-auto py-2 bg-blue-25 shadow-sm">
                        <textarea
                          className="w-full font-normal bg-transparent outline-none text-small resize-none text-foreground-500 placeholder:text-foreground-500"
                          aria-label="Add notes for this request…"
                          placeholder="Add notes for this request…"
                          rows={3}
                          value={privateNote}
                          onChange={(e) => setPrivateNote(e.target.value)}
                          style={{ height: '80px' }}
                        />
                      </div>
                    </div>
                    <div className="flex items-start gap-1 pt-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-info mt-0.5 shrink-0 text-zinc-500"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                      <p className="text-tiny leading-4 text-zinc-500">
                        This note is saved with this request and visible only to you.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ID & Views */}
                <div className="flex flex-col gap-3 pt-2">
                  <p className="text-tiny text-zinc-500">ID: {post.postIdCode || '#JG3u7khRt9AHywFcWT9jU'}</p>
                  <hr className="shrink-0 bg-divider border-none w-full h-divider opacity-50" role="separator" />
                  <div className="flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-eye text-zinc-500"
                      aria-hidden="true"
                    >
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <p className="text-tiny text-zinc-500">{post.viewsCount ?? 6} Views</p>
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
