// Authentication belongs to a browser tab; workflow data is shared by origin.
export const readDemoSession = storage => ({isAuthenticated:storage.getItem('isAuthenticated')==='true',currentUser:storage.getItem('currentUser')||'shivhare.yuvraj@gmail.com'});
export const saveDemoSession = (storage,email) => {storage.setItem('currentUser',email.trim().toLowerCase());storage.setItem('isAuthenticated','true');};
export const clearDemoSession = storage => {storage.removeItem('isAuthenticated');storage.removeItem('currentUser');};
