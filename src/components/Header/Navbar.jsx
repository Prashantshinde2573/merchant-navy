import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = location.pathname;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
    <nav className="flex z-40 w-full items-center justify-center data-[menu-open=true]:border-none sticky top-0 inset-x-0 backdrop-blur-lg data-[menu-open=true]:backdrop-blur-xl backdrop-saturate-150 bg-content1 border-default-100 shadow-neutral-sm h-14 border-b px-10" style={{"--navbar-height": "4rem"}} data-menu-open={isMenuOpen}>
      <header className="z-40 flex px-6 gap-4 w-full flex-row relative flex-nowrap items-center justify-between h-[var(--navbar-height)] max-w-[1280px]">
        <ul className="flex gap-4 h-full flex-row flex-nowrap items-center data-[justify=start]:justify-start data-[justify=start]:flex-grow data-[justify=start]:basis-0 data-[justify=center]:justify-center data-[justify=end]:justify-end data-[justify=end]:flex-grow data-[justify=end]:basis-0 md:hidden" data-justify="start">
          <button className="group flex items-center justify-center w-6 h-full rounded-small tap-highlight-transparent outline-solid outline-transparent cursor-pointer" type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="open navigation menu">
            <span className="sr-only">open navigation menu</span>
            <span className="material-symbols-outlined text-gray-700">{isMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </ul>

        <div className="flex basis-0 flex-row flex-grow flex-nowrap justify-start bg-transparent items-center no-underline text-medium whitespace-nowrap box-border shrink-0">
          <Link to="/home" className="flex items-center gap-2">
            <img alt="Merchant Navy" width="180" height="48" className="h-9 w-auto object-contain cursor-pointer" src="/images/logo.png" />
          </Link>
        </div>

        <ul className="h-full flex-row flex-nowrap items-center data-[justify=start]:justify-start data-[justify=start]:flex-grow data-[justify=start]:basis-0 data-[justify=center]:justify-center data-[justify=end]:justify-end data-[justify=end]:flex-grow data-[justify=end]:basis-0 hidden gap-1 md:flex" data-justify="center">
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

        <ul className="flex gap-4 h-full flex-row flex-nowrap items-center data-[justify=start]:justify-start data-[justify=start]:flex-grow data-[justify=start]:basis-0 data-[justify=center]:justify-center data-[justify=end]:justify-end data-[justify=end]:flex-grow data-[justify=end]:basis-0" data-justify="end">
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

          <li className="text-medium whitespace-nowrap box-border list-none data-[active=true]:font-semibold relative" ref={dropdownRef}>
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
              <div className="absolute right-0 top-12 w-44 bg-white rounded-2xl shadow-xl border border-gray-100/90 p-3.5 z-50 flex flex-col gap-2.5">
                <Link
                  to="/home"
                  onClick={() => setIsDropdownOpen(false)}
                  className="text-[15px] font-medium text-gray-800 hover:text-primary transition-colors px-1 py-0.5 text-left block w-full"
                >
                  Profile
                </Link>
                <Link
                  to="/help"
                  onClick={() => setIsDropdownOpen(false)}
                  className="text-[15px] font-medium text-gray-800 hover:text-primary transition-colors px-1 py-0.5 text-left block w-full"
                >
                  Settings
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-[15px] font-medium text-gray-800 hover:text-red-600 transition-colors px-1 py-0.5 text-left block w-full cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      </header>

      {isMenuOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-white border-b border-gray-200 p-4 shadow-lg z-50 flex flex-col gap-2">
          <Link to="/home" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-2 p-2.5 rounded-lg text-sm font-medium ${isHome ? "bg-blue-50 text-primary font-semibold" : "text-gray-700"}`}>
            <span className={`material-symbols-outlined ${isHome ? "material-symbols-fill" : ""}`}>home</span>Home
          </Link>
          <Link to="/my-posts" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-2 p-2.5 rounded-lg text-sm font-medium ${isMyPosts ? "bg-blue-50 text-primary font-semibold" : "text-gray-700"}`}>
            <span className={`material-symbols-outlined ${isMyPosts ? "material-symbols-fill" : ""}`}>docs</span>My Posts
          </Link>
          <Link to="/wins" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-2 p-2.5 rounded-lg text-sm font-medium ${isWins ? "bg-blue-50 text-primary font-semibold" : "text-gray-700"}`}>
            <span className={`material-symbols-outlined ${isWins ? "material-symbols-fill" : ""}`}>award_star</span>Wins
          </Link>
          <Link to="/my-merchants" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-2 p-2.5 rounded-lg text-sm font-medium ${isMerchants ? "bg-blue-50 text-primary font-semibold" : "text-gray-700"}`}>
            <span className={`material-symbols-outlined ${isMerchants ? "material-symbols-fill" : ""}`}>favorite</span>My Merchants
          </Link>
          <Link to="/notifications" onClick={() => setIsMenuOpen(false)} className={`flex items-center justify-between p-2.5 rounded-lg text-sm font-medium ${isNotif ? "bg-blue-50 text-primary font-semibold" : "text-gray-700"}`}>
            <div className="flex items-center gap-2"><span className={`material-symbols-outlined ${isNotif ? "material-symbols-fill" : ""}`}>notifications</span>Notifications</div>
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">7</span>
          </Link>
          <Link to="/chats" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-2 p-2.5 rounded-lg text-sm font-medium ${isChats ? "bg-blue-50 text-primary font-semibold" : "text-gray-700"}`}>
            <span className={`material-symbols-outlined ${isChats ? "material-symbols-fill" : ""}`}>chat</span>Chats
          </Link>
          <Link to="/help" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-2 p-2.5 rounded-lg text-sm font-medium ${isHelp ? "bg-blue-50 text-primary font-semibold" : "text-gray-700"}`}>
            <span className={`material-symbols-outlined ${isHelp ? "material-symbols-fill" : ""}`}>help</span>Support
          </Link>
          <div className="border-t border-gray-100 my-1 pt-1 flex flex-col gap-1">
            <Link to="/home" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <span className="material-symbols-outlined">person</span>Profile
            </Link>
            <Link to="/help" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <span className="material-symbols-outlined">settings</span>Settings
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 p-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 text-left w-full cursor-pointer">
              <span className="material-symbols-outlined">logout</span>Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
