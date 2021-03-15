import React, { useState, useCallback } from 'react';

// component
import MaintenaceBanner from './component';

// utils
import { getMaintenanceBannerAccepted, setMaintenanceBannerAccepted } from './helpers';

const MaintenaceBannerContainer = () => {
  const [maintenanceBannerAccepted, setMaintenanceBannerAcceptance] = useState(getMaintenanceBannerAccepted());
  const memoizedCallback = useCallback(
    () => { setMaintenanceBannerAccepted(); },
    [],
  );

  const handleMaintenanceBanner = () => {
    setMaintenanceBannerAcceptance(true);
    memoizedCallback();
  };

  return !maintenanceBannerAccepted
    ? (
      <MaintenaceBanner
        handleMaintenanceBanner={handleMaintenanceBanner}
        timeText="Monday 27th April 2020 (10:00 to 16:00 CET)"
      />
    ) : null;
};

export default MaintenaceBannerContainer;
