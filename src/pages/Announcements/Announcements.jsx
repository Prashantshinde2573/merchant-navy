import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Announcements.css';

export function Announcements() {
  const [searchQuery, setSearchQuery] = useState('');

  const announcements = [
    {
      id: 'wad5c6MC3puyjcRvLhWvG',
      author: 'admin@merchant.navy',
      title: 'Testing Announcement 1',
      timeAgo: '4 months ago',
    },
  ];

  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="announcements-page-wrapper bg-blue-25 min-h-[calc(100vh-56px)]">
      <div className="mx-auto w-full max-w-4xl px-6 py-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl leading-8 font-semibold text-[#18181b]">
            All Announcements
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex h-9 w-full sm:w-[220px] items-center rounded-md border border-[#dfe2eb] bg-white px-3 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-search mr-1.5 shrink-0 text-zinc-500"
                aria-hidden="true"
              >
                <path d="m21 21-4.34-4.34"></path>
                <circle cx="11" cy="11" r="8"></circle>
              </svg>
              <input
                placeholder="Search..."
                className="w-full bg-transparent text-[13px] leading-4.5 text-zinc-800 placeholder:text-zinc-500 focus:outline-none"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="flex h-9 items-center gap-1.5 rounded-lg border border-[#dfe2eb] bg-white px-3 text-[13px] font-medium text-[#3f3f46] transition-colors hover:bg-zinc-50 cursor-pointer shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-funnel text-zinc-500"
                aria-hidden="true"
              >
                <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path>
              </svg>
              Recently Posted
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
          {filteredAnnouncements.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 px-6 sm:px-8 py-4 transition-colors hover:bg-zinc-50 border-b border-zinc-100 last:border-b-0 cursor-pointer"
            >
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <p className="text-xs leading-4 font-normal text-zinc-600 truncate">
                  {item.author}
                </p>
                <p className="text-sm leading-5 font-medium text-[#27272a] break-words">
                  {item.title}
                </p>
              </div>
              <span className="mt-0.5 shrink-0 text-[11px] leading-4.5 text-zinc-500">
                {item.timeAgo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Announcements;
