import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';


// Components
import ProfilesIndex from 'components/app/myrw/profiles/pages/index';

function ProfileTab(props) {
  const { tab, subtab, id, user } = props;

  return (
    <div className="c-profiles-tab">
      {!id && user.token &&
        <ProfilesIndex tab={tab} subtab={subtab} id={id} user={user} />
      }
    </div>
  );
}

ProfileTab.propTypes = {
  user: PropTypes.object,
  tab: PropTypes.string,
  id: PropTypes.string,
  subtab: PropTypes.string
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(ProfileTab);
