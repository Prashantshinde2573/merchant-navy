import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePosts } from '../../context/PostContext';
import { DEFAULT_MY_POST, POSTS_DATA } from '../../data/postsData';
import { PostContentWithTranslation } from '../../components/PostTranslation/PostTranslation';
import './MyPostDetail.css';

export function MyPostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPost } = usePosts();
  const [activeTab, setActiveTab] = useState('scope');
  const [activeSection, setActiveSection] = useState('attachments');
  const [privateNote, setPrivateNote] = useState('');

  // Fallback to DEFAULT_MY_POST (merchant-navy 13)
  const postId = id || 'my-post-1';
  const post = POSTS_DATA[postId] || getPost(postId) || DEFAULT_MY_POST;

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -140;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="relative min-h-[calc(100vh-56px)] my-post-detail-container">
        {/* Sticky Sub-Header */}
        <div className="border-default-100 bg-content1 sticky top-14 z-40 border-b shadow-sm my-post-detail-header-wrap">
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

                <div className="flex max-w-150 flex-1 flex-col gap-0.5">
                  <h2 className="text-content1-foreground truncate text-lg leading-7 font-semibold">
                    {post.title || post.scopeOfWork}
                  </h2>
                  <p className="truncate text-sm leading-5 text-zinc-500">
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
            <div data-slot="base" className="inline-flex w-full">
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
                  onClick={() => setActiveTab('scope')}
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
                  onClick={() => setActiveTab('applied')}
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
                  onClick={() => setActiveTab('discussion')}
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
                  onClick={() => setActiveTab('quotation')}
                  aria-selected={activeTab === 'quotation'}
                  data-selected={activeTab === 'quotation'}
                  className="z-0 py-1 flex group relative justify-center items-center cursor-pointer transition-opacity tap-highlight-transparent outline-solid outline-transparent h-8 text-small rounded-none pb-3 pt-1 px-3 border-b-2 border-transparent data-[selected=true]:border-red-500"
                >
                  <div className="relative z-10 whitespace-nowrap transition-colors text-default-500 group-data-[selected=true]:text-primary">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm leading-5 ${activeTab === 'quotation' ? 'text-primary font-semibold' : 'text-blue-600 font-normal'}`}>
                        Quotation
                      </span>
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
                            {post.ports?.map((port, idx) => (
                              <div
                                key={idx}
                                className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap text-small text-default-700 h-7 rounded px-2 border border-[#E0E0E0] bg-white"
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
                                className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap text-small text-default-700 h-7 rounded px-2 border border-[#E0E0E0] bg-white"
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
                        onClick={() => scrollToSection('attachments')}
                        className={`w-full cursor-pointer rounded px-2 py-0.5 text-left text-sm leading-5 font-medium transition-colors ${
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
                        className={`w-full cursor-pointer rounded px-2 py-0.5 text-left text-sm leading-5 font-medium transition-colors ${
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
                        className={`w-full cursor-pointer rounded px-2 py-0.5 text-left text-sm leading-5 font-medium transition-colors ${
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
