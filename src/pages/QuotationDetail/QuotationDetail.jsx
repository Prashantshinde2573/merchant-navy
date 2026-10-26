import React from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { getQuotationById } from '../../data/quotationsData';
import { POSTS_DATA, DEFAULT_MY_POST } from '../../data/postsData';
import './QuotationDetail.css';

export function QuotationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const quotation = getQuotationById(id) || getQuotationById('quote-1');
  const parentPostId = location.state?.fromPostId || quotation?.postId || 'my-post-1';
  const post = POSTS_DATA[parentPostId] || DEFAULT_MY_POST;

  const handleBack = () => {
    if (location.state?.fromPostId) {
      navigate(`/my-posts/${location.state.fromPostId}`);
    } else if (quotation?.postId) {
      navigate(`/my-posts/${quotation.postId}`);
    } else {
      navigate('/my-posts');
    }
  };

  if (!quotation) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12 text-center">
        <h2 className="text-xl font-semibold text-zinc-800">Quotation not found</h2>
        <button
          onClick={() => navigate('/my-posts')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm"
        >
          Back to My Posts
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-56px)] quotation-detail-container">
      {/* Sticky Sub-Header */}
      <div className="border-default-100 bg-content1 sticky top-14 z-40 border-b shadow-sm quotation-detail-header-wrap">
        <div className="mx-auto max-w-300 px-6 quotation-detail-header-inner">
          <div className="flex h-16 items-center justify-between quotation-detail-header-top">
            {/* Back Button + Title */}
            <div className="relative flex flex-1 items-start gap-3 quotation-detail-header-left">
              <button
                type="button"
                tabIndex="0"
                onClick={handleBack}
                aria-label="Go back to Post Details"
                className="z-0 group inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] cursor-pointer outline-solid outline-transparent border-medium text-tiny gap-2 rounded-small px-0 !gap-0 transition-colors bg-transparent text-foreground min-w-8 hover:opacity-hover absolute top-2 -left-17.5 h-9 w-9 border-blue-100 quotation-detail-back-btn"
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
                <div className="flex items-center gap-2">
                  <h2 className="text-content1-foreground truncate text-lg leading-7 font-semibold">
                    Quotation: {quotation.merchantName}
                  </h2>
                  {quotation.isRecommended && (
                    <span
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium text-[#1F285D] bg-blue-50 border border-blue-200/80 whitespace-nowrap shrink-0 select-none"
                      aria-label="Recommended by Merchant Navy"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-700 shrink-0"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="font-semibold text-[#1F285D]">Recommended by Merchant Navy</span>
                    </span>
                  )}
                </div>
                <p className="truncate text-sm leading-5 text-zinc-500">
                  <span className="font-medium">For Post:</span> {post.title || post.scopeOfWork}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 quotation-detail-header-actions">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  quotation.status === 'Awarded'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {quotation.status}
              </span>
              <Link
                to="/chats"
                className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap subpixel-antialiased overflow-hidden tap-highlight-transparent border-medium min-w-16 gap-2 rounded-small text-primary h-9 border-blue-200 px-4 text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                Open Thread
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mx-auto max-w-308 px-6 py-6 quotation-detail-content-wrap">
        <div className="flex gap-6 quotation-detail-grid">
          {/* Left Column */}
          <div className="w-226 flex-1 space-y-4 quotation-detail-left">
            {/* Merchant Overview Card */}
            <div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 shadow-neutral-sm rounded-large border border-blue-50 p-6 bg-white">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="flex relative justify-center items-center box-border overflow-hidden align-middle z-0 text-tiny bg-default text-default-foreground shadow-neutral-sm shrink-0 rounded-lg h-14 w-14">
                    <img
                      className="flex object-cover w-full h-full"
                      alt={quotation.merchantName}
                      src={quotation.avatar}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </span>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-zinc-900 leading-tight">
                        {quotation.merchantName}
                      </h3>
                      <span className="inline-block bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded border border-emerald-200">
                        Verified Vendor
                      </span>
                    </div>
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
                        className="lucide lucide-star text-amber-400"
                      >
                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                      </svg>
                      <span className="text-sm font-semibold text-zinc-800">{quotation.rating}</span>
                      <span className="text-xs text-zinc-500">({quotation.reviewCount})</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-zinc-500">Quoted Price</span>
                  <span className="text-2xl font-bold text-zinc-900">{quotation.price}</span>
                  <span className="text-xs text-zinc-500">Validity: {quotation.validityDate}</span>
                </div>
              </div>

              {/* Match Highlights */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div className="flex flex-col gap-0.5 bg-blue-25/50 p-3 rounded-lg border border-blue-50">
                  <span className="text-xs text-zinc-500">Requirement Match</span>
                  <span className="text-lg font-bold text-blue-900">{quotation.matchPercent}%</span>
                </div>
                <div className="flex flex-col gap-0.5 bg-blue-25/50 p-3 rounded-lg border border-blue-50">
                  <span className="text-xs text-zinc-500">Port Coverage</span>
                  <span className="text-lg font-bold text-zinc-800">{quotation.portMatch} Ports</span>
                </div>
                <div className="flex flex-col gap-0.5 bg-blue-25/50 p-3 rounded-lg border border-blue-50">
                  <span className="text-xs text-zinc-500">Services Supported</span>
                  <span className="text-lg font-bold text-zinc-800">{quotation.serviceMatch} Services</span>
                </div>
              </div>
            </div>

            {/* Scope & Terms Card */}
            <div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 shadow-neutral-sm rounded-large border border-blue-50 p-6 bg-white space-y-4">
              <h4 className="text-base font-semibold text-zinc-900">Quotation Details &amp; Terms</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-zinc-500">Estimated Delivery Time</span>
                  <span className="text-sm font-semibold text-zinc-800">{quotation.deliveryTime}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-zinc-500">Payment Terms</span>
                  <span className="text-sm font-semibold text-zinc-800">{quotation.paymentTerms}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 pt-2">
                <span className="text-xs text-zinc-500">Vendor Scope Summary</span>
                <p className="text-sm text-zinc-700 leading-relaxed">{quotation.scopeSummary}</p>
              </div>

              {quotation.certifications && quotation.certifications.length > 0 && (
                <div className="flex flex-col gap-2 pt-2">
                  <span className="text-xs text-zinc-500">Verified Certifications</span>
                  <div className="flex flex-wrap gap-2">
                    {quotation.certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-zinc-100 text-zinc-700 text-xs font-medium px-2.5 py-1 rounded-md border border-zinc-200"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Parent Post Reference */}
            <div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 shadow-neutral-sm rounded-large border border-blue-50 p-6 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold text-zinc-900">Original Post Information</h4>
                <button
                  onClick={handleBack}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  View Full Post →
                </button>
              </div>
              <div className="text-sm text-zinc-700 line-clamp-3">
                {post.scopeOfWork}
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {post.services?.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded border border-blue-100 font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden w-64 lg:block quotation-detail-sidebar">
            <div className="sticky top-43 flex flex-col gap-3">
              <div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 shadow-neutral-sm rounded-large border border-blue-50 p-4 bg-white">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-tiny text-zinc-500">Quotation ID</p>
                    <p className="text-sm font-semibold text-zinc-900">#{quotation.id.toUpperCase()}</p>
                  </div>
                  <hr className="shrink-0 border-none w-full h-divider bg-blue-200 opacity-50" role="separator" />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-tiny text-zinc-500">Quotation Status</p>
                    <p className="text-sm font-semibold text-zinc-900">{quotation.status}</p>
                  </div>
                  <hr className="shrink-0 border-none w-full h-divider bg-blue-200 opacity-50" role="separator" />
                  <div className="flex flex-col gap-2 pt-1">
                    <Link
                      to="/chats"
                      className="w-full py-2 bg-primary hover:bg-blue-800 text-white rounded-lg text-sm font-semibold text-center transition-colors shadow-xs"
                    >
                      Message Merchant
                    </Link>
                    <button
                      type="button"
                      onClick={handleBack}
                      className="w-full py-2 bg-transparent hover:bg-zinc-100 text-zinc-700 rounded-lg text-sm font-medium text-center border border-zinc-200 transition-colors"
                    >
                      Back to Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
