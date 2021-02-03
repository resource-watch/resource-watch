import React from 'react';
import { useRouter } from 'next/router';

// components
import AreasIndex from './tabs/index';
import AreasNew from './tabs/new';
import AreasAlerts from './tabs/alerts';

const AreasTabs = () => {
  const router = useRouter();
  const {
    query: {
      id,
      subtab,
    },
  } = router;

  return (
    <>
      {!id && (<AreasIndex />)}
      {id && id === 'new' && (<AreasNew />)}
      {id && id !== 'new' && (subtab === 'alerts') && (<AreasAlerts id={id} />)}
    </>
  );
};

export default AreasTabs;
