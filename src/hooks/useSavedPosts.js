import { useState } from 'react';

const STORAGE_KEY = 'merchant_navy_saved_posts';
export function useSavedPosts() {
  const [savedIds, setSavedIds] = useState(() => {
    try { const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return Array.isArray(stored) ? stored.filter(id => typeof id === 'string') : []; }
    catch { return []; }
  });
  const toggleSavedPost = id => setSavedIds(previous => {
    const next = previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id];
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* Retain the bookmark for this session. */ }
    return next;
  });
  return { savedIds, toggleSavedPost };
}
