import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import CollectionsIndex from 'components/app/myrw/collections/pages/index';
import CollectionsEdit from 'components/app/myrw/collections/pages/edit';

function CollectionsTab(props) {
  const { tab, subtab, id, user } = props;
  return (
    <div className="c-collections-tab">
      {user.token && !subtab &&
        <CollectionsIndex tab={tab} subtab={subtab} id={id} user={user} />
      }

      {user.token && subtab &&
        <CollectionsEdit tab={tab} subtab={subtab} user={user} />
      }

    </div>
  );
}

CollectionsTab.propTypes = {
  user: PropTypes.object,
  tab: PropTypes.string,
  id: PropTypes.string,
  subtab: PropTypes.string
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(CollectionsTab);
