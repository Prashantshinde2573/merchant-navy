import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/Layout/AppLayout';

import { Login } from '../pages/Login/Login';
import { Home } from '../pages/Home/Home';
import { MyPosts } from '../pages/MyPosts/MyPosts';
import { PostDetail } from '../pages/PostDetail/PostDetail';
import { MyPostDetail } from '../pages/MyPostDetail/MyPostDetail';
import { MyMerchants } from '../pages/MyMerchants/MyMerchants';
import { Notifications } from '../pages/Notifications/Notifications';
import { Chat } from '../pages/Chat/Chat';
import { Wins } from '../pages/Wins/Wins';
import { Help } from '../pages/Help/Help';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected App Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="my-posts" element={<MyPosts />} />
        <Route path="my-posts/details" element={<MyPostDetail />} />
        <Route path="my-posts/:id" element={<MyPostDetail />} />
        <Route path="posts/:id" element={<PostDetail />} />
        <Route path="post/:id" element={<PostDetail />} />
        <Route path="service-requests/:id" element={<PostDetail />} />
        <Route path="my-merchants" element={<MyMerchants />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="chats" element={<Chat />} />
        <Route path="chat" element={<Chat />} />
        <Route path="wins" element={<Wins />} />
        <Route path="help" element={<Help />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
