import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

// components
import LayersNew from 'components/admin/data/layers/pages/new';
import LayersShow from 'components/admin/data/layers/pages/show';

export default function LayersTab({
  user,
}) {
  const {
    query: {
      params,
    },
  } = useRouter();
  const id = params?.[1] || null;

  return (
    <div className="c-layers-tab">
      {(user.token && id) && (id === 'new') && (<LayersNew />)}
      {(user.token && id) && (id !== 'new') && (<LayersShow />)}
    </div>
  );
}

LayersTab.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
};
