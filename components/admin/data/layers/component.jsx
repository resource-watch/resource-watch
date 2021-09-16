import { useRouter } from 'next/router';

// hooks
import {
  useMe,
} from 'hooks/user';

// components
import LayersNew from 'components/admin/data/layers/pages/new';
import LayersShow from 'components/admin/data/layers/pages/show';

export default function LayersTab() {
  const {
    query: {
      params,
    },
  } = useRouter();
  const {
    data: user,
  } = useMe();
  const id = params?.[1] || null;

  return (
    <div className="c-layers-tab">
      {(user?.token && id) && (id === 'new') && (<LayersNew />)}
      {(user?.token && id) && (id !== 'new') && (<LayersShow />)}
    </div>
  );
}
