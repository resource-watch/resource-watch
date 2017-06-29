import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { Link } from 'routes';

export default function HeaderUser(props) {
  const { user } = props;

  console.log(user);

  if (!isEmpty(user)) {
    return (
      <div className="c-avatar" style={{ backgroundImage: `url(${user.avatar})` }}>
        <Link route="myrw">
          <a>
            <span className="avatar-notifications">{user.notifications}</span>
          </a>
        </Link>
      </div>
    );
  }

  if (isEmpty(user)) {
    return (
      <a href="/login">
        Log in
      </a>
    );
  }

  return null;
}

HeaderUser.defaultProps = {
  user: {}
};

HeaderUser.propTypes = {
  user: React.PropTypes.object
};
