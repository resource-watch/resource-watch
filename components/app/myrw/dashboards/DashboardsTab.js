import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';


// Components
import DashboardsIndex from 'components/app/myrw/dashboards/pages/index';
import DashboardsNew from 'components/app/myrw/dashboards/pages/new';
import DashboardsShow from 'components/app/myrw/dashboards/pages/show';

function DashboardsTab(props) {
  const { tab, subtab, id, user } = props;

  return (
    <div className="c-dashboards-tab">
      {user.token && !id &&
        <DashboardsIndex tab={tab} subtab={subtab} id={id} user={user} />
      }

      {user.token && id && id === 'new' &&
        <DashboardsNew tab={tab} subtab={subtab} id={id} user={user} />
      }

      {user.token && id && id !== 'new' &&
        <DashboardsShow tab={tab} subtab={subtab} id={id} user={user} />
      }
    </div>
  );
}

DashboardsTab.propTypes = {
  user: PropTypes.object,
  tab: PropTypes.string,
  id: PropTypes.string,
  subtab: PropTypes.string
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(DashboardsTab);
