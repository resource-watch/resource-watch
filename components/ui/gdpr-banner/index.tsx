import React, { useState, useCallback } from 'react';

// component
import GDPRBanner from './component';

// utils
import { getGDPRAccepted, setGDPRAccepted } from './helpers';

const GDPRBannerContainer = (): JSX.Element => {
  const [gdprAcceptance, setGDPRAcceptance] = useState(getGDPRAccepted());
  const memoizedCallback = useCallback(() => {
    setGDPRAccepted();
  }, []);

  const handleGDPR = () => {
    setGDPRAcceptance(true);
    memoizedCallback();
  };

  return !gdprAcceptance ? <GDPRBanner handleGDPR={handleGDPR} /> : null;
};

export default GDPRBannerContainer;
