import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UpgradeBanner } from '../UpgradeBanner/UpgradeBanner';
import './Navbar.css';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAnnouncementsModal, setShowAnnouncementsModal] = useState(false);
  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const pathname = location.pathname;

  useEffect(() => {
    function handleClickOutside(event) {
      const insideDesktop = desktopDropdownRef.current && desktopDropdownRef.current.contains(event.target);
      const insideMobile = mobileDropdownRef.current && mobileDropdownRef.current.contains(event.target);
      if (!insideDesktop && !insideMobile) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isHome = pathname === '/home' || pathname === '/';
  const isMyPosts = pathname.startsWith('/my-posts');
  const isWins = pathname.startsWith('/wins');
  const isMerchants = pathname.startsWith('/my-merchants');
  const isNotif = pathname.startsWith('/notifications');
  const isChats = pathname.startsWith('/chats') || pathname.startsWith('/chat');
  const isHelp = pathname.startsWith('/help');

  return (
    <>
      <nav className="flex z-40 w-full items-center justify-center data-[menu-open=true]:border-none sticky top-0 inset-x-0 backdrop-blur-lg data-[menu-open=true]:backdrop-blur-xl backdrop-saturate-150 bg-content1 border-default-100 shadow-neutral-sm h-14 border-b px-10" style={{"--navbar-height": "4rem"}} data-menu-open={isMenuOpen}>
        {/* ==================== DESKTOP NAVBAR (>= 768px) - 100% UNCHANGED ==================== */}
        <header className="z-40 hidden md:flex px-6 gap-4 w-full flex-row relative flex-nowrap items-center justify-between h-[var(--navbar-height)] max-w-[1280px]">
          <div className="flex basis-0 flex-row flex-grow flex-nowrap justify-start bg-transparent items-center no-underline text-medium whitespace-nowrap box-border shrink-0">
            <Link to="/home" className="flex items-center gap-2">
              <img alt="Merchant Navy" width="180" height="48" className="h-9 w-auto object-contain cursor-pointer" src="/images/logo.png" />
            </Link>
          </div>

          <ul className="h-full flex-row flex-nowrap items-center data-[justify=center]:justify-center data-[justify=center]:basis-0 flex gap-1" data-justify="center">
            <Link to="/home" className={`whitespace-nowrap box-border list-none data-[active=true]:font-semibold flex items-center gap-1.5 text-sm leading-5 rounded-lg px-3 py-2.5 ${isHome ? "text-primary bg-blue-50 font-semibold" : "hover:bg-blue-25 font-medium text-blue-600"}`} data-active={isHome}>
              <span className={`material-symbols-outlined text-4.5 ${isHome ? "material-symbols-fill" : ""}`}>home</span>
              <span>Home</span>
            </Link>
            <Link to="/my-posts" className={`whitespace-nowrap box-border list-none data-[active=true]:font-semibold flex items-center gap-1.5 text-sm leading-5 rounded-lg px-3 py-2.5 ${isMyPosts ? "text-primary bg-blue-50 font-semibold" : "hover:bg-blue-25 font-medium text-blue-600"}`} data-active={isMyPosts}>
              <span className={`material-symbols-outlined text-4.5 ${isMyPosts ? "material-symbols-fill" : ""}`}>docs</span>
              <span>My Posts</span>
            </Link>
            <Link to="/wins" className={`whitespace-nowrap box-border list-none data-[active=true]:font-semibold flex items-center gap-1.5 text-sm leading-5 rounded-lg px-3 py-2.5 ${isWins ? "text-primary bg-blue-50 font-semibold" : "hover:bg-blue-25 font-medium text-blue-600"}`} data-active={isWins}>
              <span className={`material-symbols-outlined text-4.5 ${isWins ? "material-symbols-fill" : ""}`}>award_star</span>
              <span>Wins</span>
            </Link>
            <Link to="/my-merchants" className={`whitespace-nowrap box-border list-none data-[active=true]:font-semibold flex items-center gap-1.5 text-sm leading-5 rounded-lg px-3 py-2.5 ${isMerchants ? "text-primary bg-blue-50 font-semibold" : "hover:bg-blue-25 font-medium text-blue-600"}`} data-active={isMerchants}>
              <span className={`material-symbols-outlined text-4.5 ${isMerchants ? "material-symbols-fill" : ""}`}>favorite</span>
              <span>My Merchants</span>
            </Link>
          </ul>

          <ul className="flex gap-4 h-full flex-row flex-nowrap items-center data-[justify=end]:justify-end data-[justify=end]:flex-grow data-[justify=end]:basis-0" data-justify="end">
            <div className="flex items-center gap-2">
              <Link to="/notifications" className={`text-medium whitespace-nowrap box-border list-none data-[active=true]:font-semibold h-11 rounded-lg px-3 py-2.5 flex items-center ${isNotif ? "text-primary bg-blue-50 font-semibold" : "hover:bg-blue-25 font-medium text-blue-600"}`} title="Notifications" data-active={isNotif}>
                <div className="relative inline-flex shrink-0">
                  <span className={`material-symbols-outlined text-4.5 ${isNotif ? "material-symbols-fill" : ""}`}>notifications</span>
                  <span className="flex z-10 flex-wrap absolute box-border rounded-full whitespace-nowrap place-content-center origin-center items-center select-none font-regular scale-100 opacity-100 subpixel-antialiased text-small px-0 border-2 text-danger-foreground w-5 h-5 min-w-5 min-h-5 top-[10%] right-[10%] translate-x-1/2 -translate-y-1/2 bg-danger-500 border-danger-500 text-white text-[10px] font-bold justify-center items-center leading-none">7</span>
                </div>
              </Link>
              <Link to="/chats" className={`text-medium whitespace-nowrap box-border list-none data-[active=true]:font-semibold h-11 rounded-lg px-3 py-2.5 flex items-center ${isChats ? "text-primary bg-blue-50 font-semibold" : "hover:bg-blue-25 font-medium text-blue-600"}`} title="Chats" data-active={isChats}>
                <span className={`material-symbols-outlined text-4.5 ${isChats ? "material-symbols-fill" : ""}`}>chat</span>
              </Link>
              <Link to="/help" className={`text-medium whitespace-nowrap box-border list-none data-[active=true]:font-semibold h-11 rounded-lg px-3 py-2.5 flex items-center ${isHelp ? "text-primary bg-blue-50 font-semibold" : "hover:bg-blue-25 font-medium text-blue-600"}`} title="Support" data-active={isHelp}>
                <span className={`material-symbols-outlined text-4.5 ${isHelp ? "material-symbols-fill" : ""}`}>help</span>
              </Link>
            </div>

            <div className="shrink-0 bg-divider border-none w-divider mx-1 h-6" role="separator" data-orientation="vertical" aria-orientation="vertical"></div>

            <li className="text-medium whitespace-nowrap box-border list-none data-[active=true]:font-semibold relative" ref={desktopDropdownRef}>
              <div className="z-10 aria-expanded:scale-[0.97] aria-expanded:opacity-70 subpixel-antialiased cursor-pointer" data-slot="trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)} type="button" tabIndex="0">
                <div className="relative inline-flex shrink-0">
                  <span tabIndex="-1" className="flex relative justify-center items-center box-border overflow-hidden align-middle z-0 outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 w-10 h-10 text-tiny bg-default text-default-foreground rounded-medium">
                    <img className="flex object-cover w-full h-full transition-opacity !duration-500 opacity-100" alt="Profile" src="/images/profile_avatar.webp" />
                  </span>
                  <span className="flex z-10 flex-wrap absolute box-border rounded-full whitespace-nowrap place-content-center origin-center items-center select-none font-regular scale-100 opacity-100 subpixel-antialiased text-tiny border-2 border-background text-default-foreground bottom-[10%] right-[10%] translate-x-1/2 translate-y-1/2 p-0 bg-blue-100 color-blue-900">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"></path></svg>
                  </span>
                </div>
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-large shadow-medium shadow-neutral-sm border border-blue-50 p-3 z-50 flex flex-col gap-1 profile-dropdown-card">
                  <Link
                    to="/company-profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="text-[14px] font-medium text-gray-800 hover:text-primary transition-colors px-2.5 py-1.5 text-left block w-full rounded-md hover:bg-blue-50/50"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="text-[14px] font-medium text-gray-800 hover:text-primary transition-colors px-2.5 py-1.5 text-left block w-full rounded-md hover:bg-blue-50/50"
                  >
                    Settings
                  </Link>
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-[14px] font-medium text-red-600 hover:text-red-700 transition-colors px-2.5 py-1.5 text-left block w-full cursor-pointer rounded-md hover:bg-red-50/50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          </ul>
        </header>

        {/* ==================== MOBILE TOP NAVBAR (< 768px) ==================== */}
        <header className="z-40 flex md:hidden px-3 w-full flex-row relative items-center justify-between h-[var(--navbar-height)]">
          {/* LEFT: Hamburger Menu Icon */}
          <div className="flex items-center z-10">
            <button
              className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:bg-blue-25 transition-colors cursor-pointer"
              type="button"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                setIsDropdownOpen(false);
              }}
              aria-label="open navigation menu"
            >
              <span className="material-symbols-outlined text-2xl">{isMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>

          {/* CENTER: Merchant Navy Logo (Mathematically Centered Relative to Full Viewport) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex items-center justify-center z-10">
            <Link to="/home" className="flex items-center justify-center">
              <img
                alt="Merchant Navy"
                width="140"
                height="36"
                className="h-8 w-auto max-w-[130px] sm:max-w-[150px] object-contain cursor-pointer"
                src="/images/logo.png"
              />
            </Link>
          </div>

          {/* RIGHT: Profile Icon / Avatar */}
          <div className="flex items-center z-10">
            <li className="text-medium whitespace-nowrap box-border list-none data-[active=true]:font-semibold relative flex items-center" ref={mobileDropdownRef}>
              <div
                className="z-10 aria-expanded:scale-[0.97] aria-expanded:opacity-70 subpixel-antialiased cursor-pointer"
                data-slot="trigger"
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                  setIsMenuOpen(false);
                }}
                type="button"
                tabIndex="0"
                aria-label="Profile"
              >
                <div className="relative inline-flex shrink-0">
                  <span
                    tabIndex="-1"
                    className="flex relative justify-center items-center box-border overflow-hidden align-middle z-0 outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 w-10 h-10 text-tiny bg-default text-default-foreground rounded-medium"
                  >
                    <img
                      className="flex object-cover w-full h-full transition-opacity !duration-500 opacity-100"
                      alt="Profile"
                      src="/images/profile_avatar.webp"
                    />
                  </span>
                  <span className="flex z-10 flex-wrap absolute box-border rounded-full whitespace-nowrap place-content-center origin-center items-center select-none font-regular scale-100 opacity-100 subpixel-antialiased text-tiny border-2 border-background text-default-foreground bottom-[10%] right-[10%] translate-x-1/2 translate-y-1/2 p-0 bg-blue-100 color-blue-900">
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
                      className="lucide lucide-chevron-down"
                    >
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  </span>
                </div>
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 top-14 mt-1 w-48 bg-white rounded-large shadow-medium shadow-neutral-sm border border-blue-50 p-3 z-50 flex flex-col gap-1 profile-dropdown-card">
                  <Link
                    to="/company-profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="text-[14px] font-medium text-gray-800 hover:text-primary transition-colors px-2.5 py-1.5 text-left block w-full rounded-md hover:bg-blue-50/50"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="text-[14px] font-medium text-gray-800 hover:text-primary transition-colors px-2.5 py-1.5 text-left block w-full rounded-md hover:bg-blue-50/50"
                  >
                    Settings
                  </Link>
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-[14px] font-medium text-red-600 hover:text-red-700 transition-colors px-2.5 py-1.5 text-left block w-full cursor-pointer rounded-md hover:bg-red-50/50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          </div>
        </header>

        {/* ==================== MOBILE HAMBURGER MENU DROPDOWN ==================== */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-14 left-0 right-0 bg-white border-b border-gray-200 p-4 shadow-xl z-50 flex flex-col gap-1.5 max-h-[calc(100vh-120px)] overflow-y-auto">
            {/* 1. Home */}
            <Link
              to="/home"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium transition-colors ${isHome ? "bg-blue-50 text-primary font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
            >
              <span className={`material-symbols-outlined text-xl ${isHome ? "material-symbols-fill text-primary" : "text-gray-500"}`}>home</span>
              <span>Home</span>
            </Link>

            {/* 2. Wins */}
            <Link
              to="/wins"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium transition-colors ${isWins ? "bg-blue-50 text-primary font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
            >
              <span className={`material-symbols-outlined text-xl ${isWins ? "material-symbols-fill text-primary" : "text-gray-500"}`}>award_star</span>
              <span>Wins</span>
            </Link>

            {/* 3. Announcements */}
            <Link
              to="/announcements"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center justify-between p-2.5 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith('/announcements') ? "bg-blue-50 text-primary font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-xl ${pathname.startsWith('/announcements') ? "material-symbols-fill text-primary" : "text-gray-500"}`}>campaign</span>
                <span>Announcements</span>
              </div>
              <span className="bg-blue-50 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">New</span>
            </Link>

            {/* 4. Support / Help */}
            <Link
              to="/help"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium transition-colors ${isHelp ? "bg-blue-50 text-primary font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
            >
              <span className={`material-symbols-outlined text-xl ${isHelp ? "material-symbols-fill text-primary" : "text-gray-500"}`}>help</span>
              <span>Help & Support</span>
            </Link>

            {/* 5. Upgrade for More (Visual Red Promotional Banner at the VERY END) */}
            <div className="mt-2 w-full">
              <UpgradeBanner className="!max-w-full w-full" onUpgrade={() => setIsMenuOpen(false)} />
            </div>
          </div>
        )}
      </nav>

      {/* ==================== MOBILE FIXED BOTTOM NAVIGATION (< 768px) ==================== */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 backdrop-blur-lg backdrop-saturate-150 bg-content1 border-default-100 shadow-neutral-sm border-t h-[calc(3.5rem+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] box-border px-2 flex items-center justify-around">
        {/* 1. My Posts */}
        <Link
          to="/my-posts"
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors ${isMyPosts ? "text-primary font-semibold" : "text-gray-500 hover:text-blue-600 font-medium"}`}
        >
          <span className={`material-symbols-outlined text-[22px] leading-none ${isMyPosts ? "material-symbols-fill" : ""}`}>docs</span>
          <span className="text-[11px] leading-tight mt-1">My Posts</span>
        </Link>

        {/* 2. My Merchants */}
        <Link
          to="/my-merchants"
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors ${isMerchants ? "text-primary font-semibold" : "text-gray-500 hover:text-blue-600 font-medium"}`}
        >
          <span className={`material-symbols-outlined text-[22px] leading-none ${isMerchants ? "material-symbols-fill" : ""}`}>favorite</span>
          <span className="text-[11px] leading-tight mt-1">My Merchants</span>
        </Link>

        {/* 3. Notifications */}
        <Link
          to="/notifications"
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center relative transition-colors ${isNotif ? "text-primary font-semibold" : "text-gray-500 hover:text-blue-600 font-medium"}`}
        >
          <div className="relative inline-flex items-center justify-center">
            <span className={`material-symbols-outlined text-[22px] leading-none ${isNotif ? "material-symbols-fill" : ""}`}>notifications</span>
            <span className="flex z-10 absolute box-border rounded-full whitespace-nowrap place-content-center items-center select-none font-bold text-white text-[10px] w-4.5 h-4.5 min-w-4.5 min-h-4.5 -top-1 -right-2 bg-danger-500 border-2 border-white leading-none">7</span>
          </div>
          <span className="text-[11px] leading-tight mt-1">Notifications</span>
        </Link>

        {/* 4. Chat */}
        <Link
          to="/chats"
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors ${isChats ? "text-primary font-semibold" : "text-gray-500 hover:text-blue-600 font-medium"}`}
        >
          <span className={`material-symbols-outlined text-[22px] leading-none ${isChats ? "material-symbols-fill" : ""}`}>chat</span>
          <span className="text-[11px] leading-tight mt-1">Chat</span>
        </Link>
      </nav>

      {/* ==================== MOBILE ANNOUNCEMENTS MODAL ==================== */}
      {showAnnouncementsModal && (
        <div className="md:hidden fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl border border-blue-50 shadow-2xl p-5 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">campaign</span>
                <h3 className="font-semibold text-lg text-gray-900">Announcements</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAnnouncementsModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/60">
                <p className="text-xs font-normal text-zinc-500">admin@merchant.navy</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">Testing Announcement 1</p>
                <p className="text-[11px] text-zinc-400 mt-1">May 6, 2026</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAnnouncementsModal(false)}
              className="w-full py-2.5 bg-blue-50 text-primary font-semibold rounded-xl hover:bg-blue-100 transition-colors text-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
