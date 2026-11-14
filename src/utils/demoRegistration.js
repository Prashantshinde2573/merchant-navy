const accountsKey = 'merchant_navy_registered_accounts';
const signupKey = 'merchant_navy_pending_registration';

export function registeredAccount(email) {
  return JSON.parse(localStorage.getItem(accountsKey) || '{}')[email];
}

export function saveRegisteredAccount(email, profile) {
  const accounts = JSON.parse(localStorage.getItem(accountsKey) || '{}');
  localStorage.setItem(accountsKey, JSON.stringify({ ...accounts, [email]: profile }));
}

export function readRegistration() {
  return JSON.parse(sessionStorage.getItem(signupKey) || 'null');
}

export function saveRegistration(draft) {
  sessionStorage.setItem(signupKey, JSON.stringify(draft));
}

export function clearRegistration() {
  sessionStorage.removeItem(signupKey);
}
