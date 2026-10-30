import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext(null);
const INITIAL_UNREAD = [1, 2, 4, 5, 6, 7, 8];

export function NotificationProvider({ children }) {
  const [unreadIds, setUnreadIds] = useState(INITIAL_UNREAD);
  return <NotificationContext.Provider value={{
    unreadIds,
    unreadCount: unreadIds.length,
    markAllRead: () => setUnreadIds([]),
    markRead: (id) => setUnreadIds(ids => ids.filter(value => value !== id)),
  }}>{children}</NotificationContext.Provider>;
}
export const useNotifications = () => useContext(NotificationContext);
