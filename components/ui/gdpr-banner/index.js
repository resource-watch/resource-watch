import React, { useState, useCallback } from 'react';

// component
import GDPRBanner from './component';

// utils
import { getGDPRAccepted, setGDPRAccepted } from './helpers';

const GDPRBannerContainer = () => {
  const [gdprAcceptance, setGDPRAcceptance] = useState(getGDPRAccepted());
  const memoizedCallback = useCallback(
    () => { setGDPRAccepted(); },
    [gdprAcceptance],
  );

  const handleGDPR = () => {
    setGDPRAcceptance(true);
    memoizedCallback();
  };

  return !gdprAcceptance ? <GDPRBanner handleGDPR={handleGDPR} /> : null;
};

export default GDPRBannerContainer;
