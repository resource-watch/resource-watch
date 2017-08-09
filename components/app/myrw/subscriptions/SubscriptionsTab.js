import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import SubscriptionsIndex from 'components/app/myrw/subscriptions/pages/index';
import SubscriptionsNew from 'components/app/myrw/subscriptions/pages/new';

function SubscriptionsTab(props) {
  const { tab, subtab, id, user } = props;

  return (
    <div className="c-subscriptions-tab">
      {!id && user.token &&
        <SubscriptionsIndex tab={tab} subtab={subtab} id={id} user={user} />
      }

      {id && id === 'new' && user.token &&
        <SubscriptionsNew tab={tab} subtab={subtab} id={id} user={user} />
      }
    </div>
  );
}

SubscriptionsTab.propTypes = {
  user: PropTypes.object,
  tab: PropTypes.string,
  id: PropTypes.string,
  subtab: PropTypes.string
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(SubscriptionsTab);
