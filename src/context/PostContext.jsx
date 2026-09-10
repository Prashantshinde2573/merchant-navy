import React, { createContext, useContext, useState, useEffect } from 'react';
import { POSTS_DATA, DEFAULT_POST } from '../data/postsData';

const PostContext = createContext();

const STORAGE_KEY = 'merchant_navy_applied_posts';

export function PostProvider({ children }) {
  const [appliedPosts, setAppliedPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Failed to load applied posts from localStorage:', e);
      return {};
    }
  });

  const applyToPost = (postId, message = '') => {
    setAppliedPosts((prev) => {
      const updated = {
        ...prev,
        [postId]: {
          applied: true,
          appliedAt: new Date().toISOString(),
          message
        }
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save applied posts to localStorage:', e);
      }
      return updated;
    });
  };

  const hasApplied = (postId) => {
    return !!appliedPosts[postId]?.applied || !!POSTS_DATA[postId]?.isApplied;
  };

  const getPost = (postId) => {
    return POSTS_DATA[postId] || {
      ...DEFAULT_POST,
      id: postId,
      postIdCode: `#${postId}`
    };
  };

  return (
    <PostContext.Provider value={{ appliedPosts, applyToPost, hasApplied, getPost }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
}
