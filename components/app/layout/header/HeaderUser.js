import React from 'react';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import { Link } from 'routes';

export default function HeaderUser(props) {
  const { user } = props;

  if (!isEmpty(user)) {
    const activeNotificationClassName = classnames({
      '-active': !!user.notifications
    });

    const avatar = (user.avatar) ? `url(${user.avatar})` : 'none';

    return (
      <div className="c-avatar" style={{ backgroundImage: avatar }}>
        <Link route="myrw">
          <a>
            {!user.avatar && <span className="avatar-letter">{user.email.split('')[0]}</span>}
            {user.notifications && <span className={`avatar-notifications ${activeNotificationClassName}`}>{user.notifications}</span>}
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
