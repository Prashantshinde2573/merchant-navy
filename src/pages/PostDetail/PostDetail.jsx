import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePosts } from '../../context/PostContext';
import { ApplyModal } from '../../components/ApplyModal/ApplyModal';
import { PostContentWithTranslation } from '../../components/PostTranslation/PostTranslation';
import './PostDetail.css';

export function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPost, hasApplied, applyToPost } = usePosts();
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeSection, setActiveSection] = useState('attachments');

  // Fallback to 'home-post-7' if no ID provided (matches merchant-navy 11 default)
  const postId = id || 'home-post-7';
  const post = getPost(postId);
  const isApplied = hasApplied(post.id);

  const handleApply = (message) => {
    applyToPost(post.id, message);
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -140; // account for sticky headers
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="relative min-h-[calc(100vh-56px)] post-detail-container">
        {/* Sticky Sub-Header */}
        <div className="border-default-100 bg-content1 sticky top-14 z-40 border-b shadow-sm post-detail-header-wrap">
          <div className="mx-auto flex h-23 max-w-300 items-center justify-between px-6 post-detail-header">
            {/* Left Header: Back button + Vendor info */}
            <div className="relative flex items-center gap-4 post-detail-header-left">
              <button
                type="button"
                tabIndex="0"
                onClick={() => navigate(-1)}
                aria-label="Go back"
                className="z-0 group inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] cursor-pointer outline-solid outline-transparent border-medium text-tiny gap-2 rounded-small px-0 !gap-0 transition-colors bg-transparent text-foreground min-w-8 hover:opacity-hover absolute -left-17.5 h-9 w-9 border-blue-100 post-detail-back-btn"
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

              <span
                tabIndex="-1"
                className="flex relative justify-center items-center box-border overflow-hidden align-middle z-0 outline-solid outline-transparent text-tiny bg-[#e4e4e7] text-zinc-700 font-bold rounded-full h-12 w-12 shrink-0"
              >
                <span
                  aria-label={post.vendorName}
                  className="font-bold text-center text-inherit text-base"
                  role="img"
                >
                  {post.vendorAvatar || post.vendorName?.charAt(0) || 'V'}
                </span>
              </span>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg leading-7 font-semibold text-content1-foreground">{post.vendorName}</h2>
                  {post.isVerified && (
                    <img
                      alt="Verified"
                      loading="lazy"
                      width="11"
                      height="14"
                      decoding="async"
                      className="inline-block"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAcCAMAAABS8b9vAAAAIVBMVEVMaXETn1ASoVASoVASoVASolASn1ATolAUolAToVASoVBHIBmZAAAACnRSTlMAHN7vfJQwv0BYLK2A+AAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAJlJREFUKJG10kESxCAIBMABVJT/P3hLNKIx151LKl1ERQLMUFJuhDNVxXpyDaM0zMPZP6Gk9oo2wlYYEXyp2T+Ym3wwE4pczAQQB0vlQ81ZSn/d1NCfUgDSTcXZHaGmyLZ8qWXUdYhQa6B5heyHeZYG0t167iveN+7zucrTmGUsOnZ5Rnx4b3akbD47e9VHrftsNr3/K8rMgT/KXRA3B7J1ZQAAAABJRU5ErkJggg=="
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {post.isUrgent && (
                    <div className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap px-1 h-7 text-small rounded-small text-default-foreground bg-danger-100">
                      <span className="flex-1 px-2 text-danger-600 font-semibold text-[13px]">Urgent</span>
                    </div>
                  )}
                  {post.isUrgent && (
                    <div className="shrink-0 bg-divider border-none w-divider h-4" role="separator" />
                  )}
                  <p className="text-[13px] text-zinc-500">{post.timeAgo}</p>
                </div>
              </div>
            </div>

            {/* Right Header: Budget + Apply/Applied button + Actions */}
            <div className="flex items-center gap-4 post-detail-header-right">
              <div className="flex flex-col gap-0.5 text-right sm:text-left">
                <p className="text-content2-foreground text-lg leading-7 font-semibold">{post.budget}</p>
                <p className="text-[13px] text-zinc-500">{post.dateRange}</p>
              </div>

              <div className="shrink-0 bg-divider border-none w-divider mx-2 h-10 hidden sm:block" role="separator" />

              {/* Apply / Applied Action Button */}
              {isApplied ? (
                <button
                  type="button"
                  disabled
                  className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap subpixel-antialiased overflow-hidden h-12 text-medium gap-3 rounded-small bg-green-600 text-white min-w-31 px-4 font-semibold cursor-default"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check mr-1"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Applied
                </button>
              ) : (
                <button
                  type="button"
                  tabIndex="0"
                  onClick={() => setIsApplyOpen(true)}
                  className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] cursor-pointer outline-solid outline-transparent h-12 text-medium gap-3 rounded-small transition-colors bg-primary text-primary-foreground hover:opacity-hover min-w-31 px-4"
                >
                  Apply
                </button>
              )}

              {/* Bookmark Button */}
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

              {/* Actions Ellipsis Menu */}
              <button
                type="button"
                tabIndex="0"
                aria-label="Service request actions"
                className="group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal overflow-hidden tap-highlight-transparent cursor-pointer outline-solid outline-transparent text-small gap-2 rounded-medium px-0 !gap-0 transition-colors bg-transparent text-default-foreground hover:bg-default/40 min-w-10 w-10 h-10"
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

        {/* Main Content Grid */}
        <div className="mx-auto max-w-308 px-6 py-6 post-detail-content-wrap">
          <div className="flex gap-6 post-detail-grid">
            {/* Left Content Column */}
            <div className="w-226 flex-1 post-detail-left">
              <div className="space-y-4">
                {/* Attachments Section */}
                <div
                  className="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 outline-solid outline-transparent shadow-neutral-sm rounded-large border border-blue-50 p-5"
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
                  className="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 outline-solid outline-transparent shadow-neutral-sm rounded-large border border-blue-50 p-5"
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
                            {post.ports.map((port, idx) => (
                              <div
                                key={idx}
                                className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap text-small text-default-700 h-7 rounded px-2 border border-transparent bg-[#D4D4D866]"
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
                            {post.services.map((service, idx) => (
                              <div
                                key={idx}
                                className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap text-small text-default-700 h-7 rounded px-2 border border-transparent bg-[#D4D4D866]"
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
                  className="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 outline-solid outline-transparent shadow-neutral-sm rounded-large border border-blue-50 p-5"
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
            </div>

            {/* Right Sidebar Column */}
            <div className="hidden w-64 lg:block post-detail-sidebar">
              <div className="sticky top-43 flex flex-col gap-3">
                {/* On This Page Nav */}
                <div
                  className="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 outline-solid outline-transparent shadow-neutral-sm rounded-large border border-blue-50 p-4"
                  tabIndex="-1"
                >
                  <div className="relative flex w-full flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased p-0">
                    <h3 className="text-tiny mb-2 text-zinc-500">On this page</h3>
                    <nav className="space-y-2">
                      <button
                        type="button"
                        onClick={() => scrollToSection('attachments')}
                        className={`block w-full cursor-pointer rounded-md px-2 py-0.5 text-left text-sm leading-5 font-medium transition-colors ${
                          activeSection === 'attachments'
                            ? 'text-[#1F285D] font-semibold bg-blue-25'
                            : 'hover:bg-blue-25 text-[#0F172B99] hover:text-zinc-900'
                        }`}
                      >
                        Attachments
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollToSection('ports-services')}
                        className={`block w-full cursor-pointer rounded-md px-2 py-0.5 text-left text-sm leading-5 font-medium transition-colors ${
                          activeSection === 'ports-services'
                            ? 'text-[#1F285D] font-semibold bg-blue-25'
                            : 'hover:bg-blue-25 text-[#0F172B99] hover:text-zinc-900'
                        }`}
                      >
                        Ports &amp; Services
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollToSection('scope-of-work')}
                        className={`block w-full cursor-pointer rounded-md px-2 py-0.5 text-left text-sm leading-5 font-medium transition-colors ${
                          activeSection === 'scope-of-work'
                            ? 'text-[#1F285D] font-semibold bg-blue-25'
                            : 'hover:bg-blue-25 text-[#0F172B99] hover:text-zinc-900'
                        }`}
                      >
                        Scope of Work
                      </button>
                    </nav>
                  </div>
                </div>

                {/* Posted By Card */}
                <div
                  className="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 outline-solid outline-transparent shadow-neutral-sm rounded-large border border-blue-50 p-4"
                  tabIndex="-1"
                >
                  <div className="relative flex w-full flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased p-0">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[12px] leading-4 font-normal text-[#71717a]">Posted by</p>
                        <p className="text-[14px] leading-5 font-semibold text-[#18181b]">{post.vendorName}</p>
                      </div>
                      <button
                        type="button"
                        tabIndex="0"
                        aria-label="View vendor profile"
                        className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent cursor-pointer outline-solid outline-transparent text-tiny gap-2 rounded-large px-0 !gap-0 transition-opacity text-foreground hover:opacity-hover h-8 w-8 min-w-8 border border-[#d0d4e1] bg-white"
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
                          className="lucide lucide-id-card text-[#3f3f46]"
                          aria-hidden="true"
                        >
                          <path d="M16 10h2" />
                          <path d="M16 14h2" />
                          <path d="M6.17 15a3 3 0 0 1 5.66 0" />
                          <circle cx="9" cy="11" r="2" />
                          <rect x="2" y="5" width="20" height="14" rx="2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* ID & Views */}
                <div className="flex flex-col gap-3 pt-2">
                  <p className="text-tiny text-zinc-500">ID: {post.postIdCode}</p>
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
                    <p className="text-tiny text-zinc-500">{post.viewsCount} Views</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Apply Modal */}
      <ApplyModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        onApply={handleApply}
        post={post}
      />
    </>
  );
}
