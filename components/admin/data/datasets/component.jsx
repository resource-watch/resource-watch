import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
// components
import DatasetNew from 'components/admin/data/datasets/pages/new';
import DatasetShow from 'components/admin/data/datasets/pages/show';

export default function DatasetsTab({
  user,
}) {
  const {
    query: {
      params,
    },
  } = useRouter();
  const id = params?.[1];

  return (
    <div className="c-datasets-tab">
      {(id && id === 'new') && user.token && (<DatasetNew />)}
      {(id && id !== 'new') && user.token && (<DatasetShow />)}
    </div>
  );
}

DatasetsTab.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
};
