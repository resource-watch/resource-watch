import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';


// Components
import WidgetsIndex from 'components/admin/widgets/pages/index';
import WidgetsNew from 'components/admin/widgets/pages/new';
import WidgetsShow from 'components/admin/widgets/pages/show';

function WidgetsTab(props) {
  const { tab, subtab, id, user, dataset } = props;

  return (
    <div className="c-widgets-tab">
      {user.token && !id &&
        <WidgetsIndex tab={tab} subtab={subtab} id={id} user={user} />
      }

      {user.token && id && id === 'new' &&
        <WidgetsNew tab={tab} subtab={subtab} id={id} user={user} dataset={dataset} />
      }

      {user.token && id && id !== 'new' &&
        <WidgetsShow tab={tab} subtab={subtab} id={id} user={user} />
      }
    </div>
  );
}

WidgetsTab.propTypes = {
  tab: PropTypes.string,
  id: PropTypes.string,
  subtab: PropTypes.string,
  user: PropTypes.object,
  dataset: PropTypes.string
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(WidgetsTab);
