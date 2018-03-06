import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import TopicsIndex from 'components/admin/topics/pages/index';
import TopicsNew from 'components/admin/topics/pages/new';
import TopicsShow from 'components/admin/topics/pages/show';

function TopicsTab(props) {
  const { tab, subtab, id, user } = props;

  return (
    <div className="c-topics-tab">
      {user.token && !id &&
        <TopicsIndex tab={tab} subtab={subtab} id={id} user={user} />
      }

      {user.token && id && id === 'new' &&
        <TopicsNew tab={tab} subtab={subtab} id={id} user={user} />
      }

      {user.token && id && id !== 'new' &&
        <TopicsShow tab={tab} subtab={subtab} id={id} user={user} />
      }
    </div>
  );
}

TopicsTab.propTypes = {
  user: PropTypes.object,
  tab: PropTypes.string,
  id: PropTypes.string,
  subtab: PropTypes.string
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(TopicsTab);
