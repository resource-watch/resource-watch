import {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

// components
import LayersForm from 'components/admin/data/layers/form/LayersForm';

export default function LayersShow({
  user,
}) {
  const {
    query: {
      params,
    },
  } = useRouter();
  const dataset = params?.[1] || null;

  const handleSubmit = useCallback(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="c-layers-show">
      {user.token
        && (
        <LayersForm
          id={dataset}
          application={[process.env.NEXT_PUBLIC_APPLICATIONS]}
          authorization={user.token}
          onSubmit={handleSubmit}
        />
        )}
    </div>
  );
}

LayersShow.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
};
