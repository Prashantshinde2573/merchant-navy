import React, { createContext, useContext, useState, useEffect } from 'react';
import { POSTS_DATA, DEFAULT_POST, DEFAULT_MY_POST } from '../data/postsData';
import { useAuth } from './AuthContext';

const PostContext = createContext();

const STORAGE_CUSTOM_POSTS = 'merchant_navy_custom_posts';
const STORAGE_APPLICATIONS = 'merchant_navy_applications';
const STORAGE_REPORTS = 'merchant_navy_reports';

export function PostProvider({ children }) {
  const { currentUser } = useAuth();

  const [customPosts, setCustomPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_POSTS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load custom posts from localStorage:', e);
      return [];
    }
  });

  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_APPLICATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load applications from localStorage:', e);
      return [];
    }
  });

  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REPORTS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load reports from localStorage:', e);
      return [];
    }
  });

  // Create Post
  const createPost = (postData) => {
    const uniqueId = 'custom-post-' + Date.now();
    const randomCode = Math.random().toString(36).substring(2, 9).toUpperCase();

    const newPost = {
      id: uniqueId,
      postIdCode: `#${randomCode}`,
      vendorName: currentUser === 'shivhare.yuvraj@gmail.com' ? 'Bluesea Marine Works Pvt Ltd.' : (currentUser?.split('@')[0] || 'My Company'),
      vendorAvatar: 'BM',
      isVerified: true,
      ownerId: currentUser,
      timeAgo: 'Just now',
      budget: postData.budget || 'Open for quotations',
      dateRange: postData.isAsap || postData.urgent ? 'ASAP' : (postData.serviceDates || postData.timeline || 'ASAP'),
      isUrgent: !!postData.isAsap || !!postData.urgent,
      viewsCount: 0,
      attachments: postData.files || [],
      ports: postData.ports && postData.ports.length > 0 ? postData.ports : ['Visakhapatnam'],
      services: postData.services && postData.services.length > 0 ? postData.services : ['Husbandry (General)'],
      scopeOfWork: postData.scopeOfWork || postData.details || postData.title || '',
      title: postData.title || (postData.scopeOfWork ? postData.scopeOfWork.split('\n')[0] : 'Requirement'),
      status: postData.status || 'Live',
      createdAt: new Date().toISOString()
    };

    setCustomPosts((prev) => {
      const updated = [newPost, ...prev];
      try {
        localStorage.setItem(STORAGE_CUSTOM_POSTS, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save custom posts:', e);
      }
      return updated;
    });

    return newPost;
  };

  // Apply to Post
  const applyToPost = (postId, applicationData) => {
    const message = typeof applicationData === 'string' ? applicationData : (applicationData?.message || '');
    const fileName = applicationData?.fileName || '';

    setApplications((prev) => {
      // Prevent duplicate
      const alreadyExists = prev.some(a => a.postId === postId && a.applicantId === currentUser);
      if (alreadyExists) return prev;

      const newApp = {
        id: 'app-' + Date.now(),
        postId,
        applicantId: currentUser,
        applicantName: currentUser === 'shivhare.yuvraj@gmail.com' ? 'Bluesea Marine Works Pvt Ltd.' : (currentUser?.split('@')[0] || 'Applicant'),
        message,
        fileName,
        status: 'Applied',
        appliedAt: new Date().toISOString()
      };

      const updated = [newApp, ...prev];
      try {
        localStorage.setItem(STORAGE_APPLICATIONS, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save applications:', e);
      }
      return updated;
    });
  };

  // Check if current user has applied to a post
  const hasApplied = (postId, user = currentUser) => {
    if (!postId) return false;
    const userApp = applications.find(a => a.postId === postId && a.applicantId === user);
    if (userApp) return true;

    // Check initial mock data if user is default user
    if (user === 'shivhare.yuvraj@gmail.com' && (POSTS_DATA[postId]?.isApplied || postId === 'home-post-1')) {
      return true;
    }
    return false;
  };

  // Report a Post
  const reportPost = (postId, details) => {
    setReports((prev) => {
      const newReport = {
        id: 'rep-' + Date.now(),
        postId,
        reporterId: currentUser,
        details,
        createdAt: new Date().toISOString()
      };
      const updated = [newReport, ...prev];
      try {
        localStorage.setItem(STORAGE_REPORTS, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save report:', e);
      }
      return updated;
    });
  };

  // Get specific post by ID
  const getPost = (postId) => {
    if (!postId) return DEFAULT_POST;

    // 1. Check custom created posts
    const custom = customPosts.find(p => p.id === postId || p.postIdCode === postId || p.postIdCode === `#${postId}`);
    if (custom) return custom;

    // 2. Check static POSTS_DATA
    if (POSTS_DATA[postId]) return POSTS_DATA[postId];

    // 3. Check fallback
    return {
      ...DEFAULT_POST,
      id: postId,
      postIdCode: `#${postId}`
    };
  };

  // Get user's own posts for My Posts page
  const getMyPosts = () => {
    const userCustomPosts = customPosts.filter(p => p.ownerId === currentUser);

    // If logged in as default user, include the initial default my post
    if (currentUser === 'shivhare.yuvraj@gmail.com') {
      return [...userCustomPosts, DEFAULT_MY_POST];
    }
    return userCustomPosts;
  };

  // Get applications received for a post
  const getApplicationsForPost = (postId) => {
    return applications.filter(a => a.postId === postId);
  };

  return (
    <PostContext.Provider
      value={{
        customPosts,
        createPost,
        applications,
        applyToPost,
        hasApplied,
        reports,
        reportPost,
        getPost,
        getMyPosts,
        getApplicationsForPost
      }}
    >
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

