import React from 'react';
import PropTypes from 'prop-types';

// Components
import ProfilesForm from 'components/app/myrw/profiles/form/ProfilesForm';

function ProfilesIndex(props) {
  const { user } = props;

  return (
    <div className="c-partners-index">
      <ProfilesForm
        application={[process.env.APPLICATIONS]}
        authorization={user.token}
      />
    </div>
  );
}

ProfilesIndex.propTypes = {
  user: PropTypes.object.isRequired
};

export default ProfilesIndex;
