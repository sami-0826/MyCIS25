const PASSCODE_STORAGE_KEY = 'mycis25_admin_passcode';
const SESSION_STORAGE_KEY = 'mycis25_admin_session_auth';
const DEFAULT_PASSCODE = 'cis25admin';

export function getAdminPasscode(): string {
  try {
    const saved = localStorage.getItem(PASSCODE_STORAGE_KEY);
    return saved && saved.trim().length > 0 ? saved : DEFAULT_PASSCODE;
  } catch {
    return DEFAULT_PASSCODE;
  }
}

export function setAdminPasscode(newPasscode: string): boolean {
  try {
    if (!newPasscode || newPasscode.trim().length < 4) {
      return false;
    }
    localStorage.setItem(PASSCODE_STORAGE_KEY, newPasscode.trim());
    return true;
  } catch {
    return false;
  }
}

export function verifyAdminPasscode(input: string): boolean {
  const current = getAdminPasscode();
  return input.trim() === current;
}

export function checkIsAdminSessionAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdminSessionAuthenticated(authenticated: boolean): void {
  try {
    if (authenticated) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
    } else {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}
