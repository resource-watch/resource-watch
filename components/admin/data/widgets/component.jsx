import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

// components
import WidgetsNew from 'components/admin/data/widgets/pages/new';
import WidgetsShow from 'components/admin/data/widgets/pages/show';

export default function WidgetsTab({
  user,
}) {
  const {
    query: {
      params,
    },
  } = useRouter();
  const id = params?.[1] || null;

  return (
    <div className="c-widgets-tab">
      {(user.token && id) && (id === 'new') && (<WidgetsNew />)}
      {(user.token && id) && (id !== 'new') && (<WidgetsShow />)}
    </div>
  );
}

WidgetsTab.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
};
