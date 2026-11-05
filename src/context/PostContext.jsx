import React, { createContext, useContext, useState, useEffect } from 'react';
import { POSTS_DATA, DEFAULT_POST, DEFAULT_MY_POST } from '../data/postsData';
import { useAuth } from './AuthContext';
import { useCompanyWorkflow } from '../hooks/useCompanyWorkflow';
import { COMPANY_EMAIL, APPLICANT_EMAIL, demoCompany, ownerOfPost, compactBudget, quotePrice, workflowDate } from '../utils/companyWorkflow';
import { COMPANY_PROFILES } from '../data/companyProfiles';

const PostContext = createContext();

const STORAGE_CUSTOM_POSTS = 'merchant_navy_custom_posts';
const STORAGE_APPLICATIONS = 'merchant_navy_applications';
const STORAGE_REPORTS = 'merchant_navy_reports';

export function PostProvider({ children }) {
  const { currentUser } = useAuth();

  const [customPosts, setCustomPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_POSTS);
      const posts=saved ? JSON.parse(saved) : [];
      const originalPosts=posts.filter(post=>post.id!=='demo-requirement-marseille-fr');
      if(originalPosts.length!==posts.length)localStorage.setItem(STORAGE_CUSTOM_POSTS,JSON.stringify(originalPosts));
      return originalPosts;
    } catch (e) {
      console.error('Failed to load custom posts from localStorage:', e);
      return [];
    }
  });

  const workflow = useCompanyWorkflow(currentUser);
  const applications = workflow.applications;
  useEffect(() => {
    const sync = event => {
      if(event.key===STORAGE_CUSTOM_POSTS) { try {setCustomPosts(JSON.parse(event.newValue||'[]'));} catch {} }
      if(event.key==='merchant_navy_post_changes') { try {setPostChanges(JSON.parse(event.newValue||'{}'));} catch {} }
    };
    window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);
  },[]);

  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REPORTS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load reports from localStorage:', e);
      return [];
    }
  });

  const [postChanges, setPostChanges] = useState(() => {
    try { return JSON.parse(localStorage.getItem('merchant_navy_post_changes') || '{}'); } catch { return {}; }
  });
  const updatePost = (id, changes) => setPostChanges(previous => {
    const next = { ...previous, [id]: { ...previous[id], ...changes } };
    localStorage.setItem('merchant_navy_post_changes', JSON.stringify(next));
    return next;
  });

  // Create Post
  const createPost = (postData) => {
    const uniqueId = 'custom-post-' + Date.now();
    const randomCode = Math.random().toString(36).substring(2, 9).toUpperCase();

    const newPost = {
      id: uniqueId,
      postIdCode: `#${randomCode}`,
      vendorName: demoCompany(currentUser).name,
      vendorAvatar: demoCompany(currentUser).initials,
      vendorImage: demoCompany(currentUser).avatar,
      isVerified: true,
      ownerId: currentUser,
      timeAgo: 'Just now',
      budget: compactBudget(postData.minBudget,postData.maxBudget,postData.currency),
      currency: postData.currency || 'USD', minBudget: postData.minBudget ?? '', maxBudget: postData.maxBudget ?? '',
      scopeHtml: postData.scopeHtml || '', isAsap: Boolean(postData.isAsap),
      serviceDates: postData.serviceDates, serviceDate: postData.serviceDate, timeline: postData.timeline,
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
    const message = typeof applicationData === 'string' ? applicationData : applicationData?.message;
    workflow.dispatch('apply',{post:getPost(postId),message,fileName:applicationData?.fileName});
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

  const decoratePost = post => {
    const award=applications.find(app=>app.postId===post.id&&['awarded','completed'].includes(app.status));
    return {...post,...(post.minBudget!==undefined||post.maxBudget!==undefined?{budget:compactBudget(post.minBudget,post.maxBudget,post.currency)}:{}),ownerId:ownerOfPost(post),...(award?{status:award.status==='awarded'?'Awarded':award.review?'History':'Rate Now'}:{})};
  };
  // Get specific post by ID
  const getPost = (postId) => {
    if (!postId) return DEFAULT_POST;

    // 1. Check custom created posts
    const custom = customPosts.find(p => p.id === postId || p.postIdCode === postId || p.postIdCode === `#${postId}`);
    if (custom) return decoratePost({ ...custom, ...postChanges[custom.id] });

    // 2. Check static POSTS_DATA
    if (POSTS_DATA[postId]) return decoratePost({ ...POSTS_DATA[postId], ...postChanges[postId] });

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
      return [...userCustomPosts, { ...DEFAULT_MY_POST, status: 'Live' }, POSTS_DATA['n8zXLc4RjgxncUntWUAPQ']].map(post => decoratePost({ ...post, ...postChanges[post.id] })).filter(post => !post.deleted);
    }
    const fixtures=currentUser===COMPANY_EMAIL ? [...new Map(Object.values(POSTS_DATA).filter(post=>post.vendorName==='Indra Shipping Co.'&&post.id.startsWith('home-post')).map(post=>[post.id,post])).values()] : [];
    return [...userCustomPosts,...fixtures].map(post => decoratePost({ ...post, ...postChanges[post.id] })).filter(post => !post.deleted);
  };

  // Get applications received for a post
  const getApplicationsForPost = (postId) => {
    return applications.filter(a => a.postId === postId && (!a.ownerId || a.ownerId === currentUser));
  };

  const applicationRow = app => {
    const company=demoCompany(app.applicantId),profile=COMPANY_PROFILES[company.name],post=getPost(app.postId);
    const ports=post.ports||[],services=post.services||[];
    const portsMatched=ports.filter(p=>profile?.ports?.includes(p)).length,servicesMatched=services.filter(s=>profile?.services?.includes(s)).length;
    const total=ports.length+services.length;
    return {...app,merchantName:company.name,avatar:company.avatar,rating:profile?.rating||'—',reviewCount:`${profile?.reviews?.length||0} reviews`,matchPercent:total?Math.round((portsMatched+servicesMatched)/total*100):0,portMatch:`${portsMatched}/${ports.length}`,serviceMatch:`${servicesMatched}/${services.length}`,price:quotePrice(app.quote),validityDate:workflowDate(app.quote?.validUntil),appliedDate:workflowDate(app.appliedAt),scopeSummary:app.quote?.details||app.message,isAwarded:['awarded','completed'].includes(app.status),chatId:app.threadId,certifications:[],deliveryTime:'',paymentTerms:''};
  };
  return (
    <PostContext.Provider
      value={{
        customPosts: customPosts.map(post => decoratePost({ ...post, ...postChanges[post.id] })).filter(post => !post.deleted),
        updatePost,
        workflow,
        applicationRow,
        getWorkflowQuotation:id=>{const app=applications.find(app=>app.id===id&&app.quote&&(app.ownerId===currentUser||app.applicantId===currentUser));return app?applicationRow(app):null;},
        postChanges,
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

