const GDPR_KEY = 'rw_GDPR_accepted';

export const getGDPRAccepted = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(GDPR_KEY) === 'true';
  }
  return true;
};

export const setGDPRAccepted = (): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(GDPR_KEY, 'true');
  }
};
