import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import DashboardsIndex from 'components/admin/dashboards/pages/index';
import DashboardsNew from 'components/admin/dashboards/pages/new';
import DashboardsShow from 'components/admin/dashboards/pages/show';

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

export default withRedux(initStore, mapStateToProps, null)(DashboardsTab);
