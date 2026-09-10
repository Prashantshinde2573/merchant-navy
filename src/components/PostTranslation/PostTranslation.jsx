import React, { useState, useRef, useEffect } from 'react';
import { translateText, AVAILABLE_LANGUAGES, LANGUAGE_MAP } from '../../services/translationService';
import './PostTranslation.css';

/**
 * PostContentWithTranslation
 * 
 * Renders post content with an inline, slick language selector popup and translation functionality.
 * Preserves original content, supports per-post independent state, search filtering,
 * outside-click & escape-key closing, and viewport-aware positioning.
 */
export function PostContentWithTranslation({ postId, text, className = "text-modified-15 text-content2-foreground line-clamp-3" }) {
  const [isTranslated, setIsTranslated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [targetLangName, setTargetLangName] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popupRef.current && 
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsPopupOpen(false);
      }
    }

    // Close on Escape key press
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsPopupOpen(false);
      }
    }

    if (isPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      // Auto-focus search input on open
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPopupOpen]);

  // Filter languages based on user search query
  const filteredLanguages = AVAILABLE_LANGUAGES.filter((lang) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q)
    );
  });

  const handleOpenPopup = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setSearchQuery('');
    setIsPopupOpen(!isPopupOpen);
  };

  const handleSelectLanguage = async (e, langCode, langName) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setIsPopupOpen(false);
    setIsLoading(true);
    setHasError(false);
    setTargetLangName(langName);

    try {
      const result = await translateText(text, 'auto', langCode);
      if (result && result.success && result.translatedText) {
        setTranslatedText(result.translatedText);
        setIsTranslated(true);
      } else {
        setHasError(true);
      }
    } catch (err) {
      console.error('Translation failed:', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowOriginal = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setIsTranslated(false);
  };

  return (
    <div className="post-translation-wrapper w-full relative">
      {/* Post Text: Displays translatedText when active, otherwise original text */}
      <p className={className}>
        {isTranslated && translatedText ? translatedText : text}
      </p>

      {/* Action Row */}
      <div 
        className="post-translation-action-row mt-1.5 flex items-center gap-2 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* State 1: Original -> Trigger Popup */}
        {!isTranslated && !isLoading && !hasError && (
          <button
            ref={buttonRef}
            type="button"
            onClick={handleOpenPopup}
            className="post-translate-btn inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none"
            aria-haspopup="true"
            aria-expanded={isPopupOpen}
            aria-label="Select language to translate post"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-languages shrink-0"
              aria-hidden="true"
            >
              <path d="m5 8 6 6" />
              <path d="m4 14 6-6 2-3" />
              <path d="M2 5h12" />
              <path d="M7 2h1" />
              <path d="m22 22-5-10-5 10" />
              <path d="M14 18h6" />
            </svg>
            <span>Translate</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-150 ${isPopupOpen ? 'rotate-180' : ''}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        )}

        {/* State 2: Translating / Loading State */}
        {isLoading && (
          <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 font-normal select-none">
            <svg
              className="animate-spin text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Translating...</span>
          </span>
        )}

        {/* State 3: Translated -> Revert to Original */}
        {isTranslated && !isLoading && (
          <div className="inline-flex items-center gap-1.5 text-xs">
            <span className="text-zinc-500 font-normal">
              {targetLangName ? `Translated to ${targetLangName}` : 'Translated'}
            </span>
            <span className="text-zinc-300">•</span>
            <button
              type="button"
              onClick={handleShowOriginal}
              className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer bg-transparent border-0 p-0 outline-none hover:underline underline-offset-2"
              aria-label="Show original text"
            >
              Show original
            </button>
            <span className="text-zinc-300">•</span>
            <button
              type="button"
              onClick={handleOpenPopup}
              className="text-zinc-400 hover:text-zinc-600 font-normal cursor-pointer bg-transparent border-0 p-0 outline-none hover:underline"
              aria-label="Translate to another language"
            >
              Change language
            </button>
          </div>
        )}

        {/* State 4: Error State */}
        {hasError && !isLoading && (
          <div className="inline-flex items-center gap-1.5 text-xs text-danger-500">
            <span>Translation failed</span>
            <span className="text-zinc-300">•</span>
            <button
              type="button"
              onClick={handleOpenPopup}
              className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer bg-transparent border-0 p-0 outline-none hover:underline"
              aria-label="Retry translation"
            >
              Try again
            </button>
          </div>
        )}

        {/* Language Selection Popup */}
        {isPopupOpen && (
          <div
            ref={popupRef}
            onClick={(e) => e.stopPropagation()}
            className="language-popup-card absolute z-50 top-full left-0 mt-1.5 w-60 bg-white rounded-large shadow-medium border border-blue-50 py-2 text-foreground animate-in fade-in zoom-in-95 duration-100"
            role="dialog"
            aria-label="Language selection"
          >
            {/* Header / Title */}
            <div className="px-3 pb-1.5 pt-0.5 flex items-center justify-between border-b border-zinc-100">
              <span className="text-xs font-semibold text-zinc-700">Translate to</span>
              <span className="text-[11px] text-zinc-400 font-normal">Select language</span>
            </div>

            {/* Search Input */}
            <div className="px-2.5 pt-2 pb-1" onClick={(e) => e.stopPropagation()}>
              <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-md px-2 py-1 focus-within:border-blue-500 focus-within:bg-white transition-colors">
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
                  className="text-zinc-400 shrink-0 mr-1.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Search language..."
                  className="w-full bg-transparent border-0 p-0 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery('');
                    }}
                    className="text-zinc-400 hover:text-zinc-600 p-0.5 ml-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Language List */}
            <div 
              className="language-list-container max-h-48 overflow-y-auto px-1 pt-1 scrollbar-thin"
              onClick={(e) => e.stopPropagation()}
            >
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={(e) => handleSelectLanguage(e, lang.code, lang.name)}
                    className="w-full text-left px-2.5 py-1.5 rounded-md text-xs hover:bg-blue-50 flex items-center justify-between text-zinc-700 hover:text-blue-700 transition-colors group cursor-pointer border-0 bg-transparent"
                  >
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-[11px] text-zinc-400 group-hover:text-blue-500">{lang.nativeName}</span>
                  </button>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-zinc-400">
                  No languages found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
