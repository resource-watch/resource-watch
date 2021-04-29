import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

// components
import DashboardsForm from 'components/dashboards/form/DashboardsForm';

export default function DashboardsNew({
  user,
}) {
  const router = useRouter();

  return (
    <div className="c-dashboards-new">
      <DashboardsForm
        user={user}
        onSubmit={() => { router.push('/admin/dashboards'); }}
      />
    </div>
  );
}

DashboardsNew.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
};
