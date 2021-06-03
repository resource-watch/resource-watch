import { useRouter } from 'next/router';

// components
import AreasIndex from './tabs/index';
import AreasNew from './tabs/new';
import AreasAlerts from './tabs/alerts';

const AreasTabs = () => {
  const {
    query: {
      params,
    },
  } = useRouter();
  const id = params?.[1] || null;
  const subtab = params?.[2] || null;

  return (
    <>
      {!id && (<AreasIndex />)}
      {id && id === 'new' && (<AreasNew />)}
      {id && id !== 'new' && (subtab === 'alerts') && (<AreasAlerts id={id} />)}
    </>
  );
};

export default AreasTabs;
