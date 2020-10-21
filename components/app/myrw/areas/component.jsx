import React from 'react';
import { useRouter } from 'next/router';

// components
import AreasIndex from 'components/app/myrw/areas/pages/index';
import AreasNew from 'components/app/myrw/areas/pages/new';
import AreasEdit from 'components/app/myrw/areas/pages/edit';
import AreasAlerts from 'components/app/myrw/areas/pages/alerts';

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
      {id && id !== 'new' && (subtab !== 'alerts') && (<AreasEdit id={id} />)}
      {id && id !== 'new' && (subtab === 'alerts') && (<AreasAlerts id={id} />)}
    </>
  );
};

export default AreasTabs;
