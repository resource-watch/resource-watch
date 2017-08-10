import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import WidgetsIndex from 'components/app/myrw/widgets/pages/index';
import WidgetsNew from 'components/app/myrw/widgets/pages/new';

function WidgetsTab(props) {
  const { tab, subtab, id, user } = props;
  return (
    <div className="c-subscriptions-tab">
      {!id && user.token &&
        <WidgetsIndex tab={tab} subtab={subtab} id={id} />
      }

      {id && id === 'new' && user.token &&
        <WidgetsNew tab={tab} subtab={subtab} id={id} />
      }
    </div>
  );
}

WidgetsTab.propTypes = {
  user: PropTypes.object,
  tab: PropTypes.string,
  id: PropTypes.string,
  subtab: PropTypes.string
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(WidgetsTab);
