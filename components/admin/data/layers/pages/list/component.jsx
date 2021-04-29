import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

// components
import LayersTable from 'components/admin/data/layers/table';

export default function LayersIndex({
  user,
}) {
  const {
    query: {
      params,
    },
  } = useRouter();

  const dataset = params?.[1] || null;

  return (
    <div className="c-layers-index">
      <LayersTable
        application={[process.env.NEXT_PUBLIC_APPLICATIONS]}
        dataset={dataset}
        authorization={user.token}
      />
    </div>
  );
}

LayersIndex.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
};
