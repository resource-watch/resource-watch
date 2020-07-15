const MAINTENANCE_BANNER_KEY = 'rw_maintenance_banner_accepted';

export const getMaintenanceBannerAccepted = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(MAINTENANCE_BANNER_KEY) === 'true';
  }
  return true;
};

export const setMaintenanceBannerAccepted = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(MAINTENANCE_BANNER_KEY, 'true');
  }
};
