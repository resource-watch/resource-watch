const GDPR_KEY = 'GDPR_accepted';

export const getGDPRAccepted = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(GDPR_KEY) === 'true';
  }
  return true;
};

export const setGDPRAccepted = (value) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(GDPR_KEY, value);
  }
};
