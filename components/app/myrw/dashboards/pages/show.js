import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

// Redux
import { connect } from 'react-redux';

// Components
import DashboardsForm from 'components/dashboards/form/DashboardsForm';

function DashboardsShow(props) {
  const { id, user } = props;
  const router = useRouter();

  return (
    <div className="c-dashboards-show">
      <DashboardsForm
        id={id}
        basic
        user={user}
        onSubmit={() => { router.push('/myrw/dashboards'); }}
        mode="edit"
      />
    </div>
  );
}

DashboardsShow.propTypes = {
  id: PropTypes.string,
  // Store
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(DashboardsShow);
