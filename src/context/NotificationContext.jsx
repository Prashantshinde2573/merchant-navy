import React, { createContext, useContext, useState } from 'react';

import {useAuth} from './AuthContext';
import {useCompanyWorkflow} from '../hooks/useCompanyWorkflow';

const NotificationContext = createContext(null);
const INITIAL_UNREAD = [1, 2, 4, 5, 6, 7, 8];

export function NotificationProvider({ children }) {
  const {currentUser}=useAuth();
  const workflow=useCompanyWorkflow(currentUser);
  const workflowEvents=workflow.applications.flatMap(app=>(app.events||[]).filter(event=>event.recipient===currentUser).map(event=>({...event,applicationId:app.id,postId:app.postId,threadId:app.threadId})));
  const [unreadIds, setUnreadIds] = useState(INITIAL_UNREAD);
  return <NotificationContext.Provider value={{
    unreadIds,
    workflowEvents,
    unreadCount: unreadIds.length+workflowEvents.filter(event=>!event.read).length,
    markAllRead: () => {setUnreadIds([]);workflow.markRead();},
    markRead: (id) => {setUnreadIds(ids => ids.filter(value => value !== id));workflow.markRead([id]);},
  }}>{children}</NotificationContext.Provider>;
}
export const useNotifications = () => useContext(NotificationContext);
