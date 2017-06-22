import React from 'react';
import { Link } from 'routes';

export default function HeaderUser(props) {
  const { user } = props;
  return (
    <div className="c-avatar" style={{ backgroundImage: `url(${user.avatar})` }}>
      <Link route="home">
        <a>
          <span className="avatar-notifications">{user.notifications}</span>
        </a>
      </Link>
    </div>
  );
}

HeaderUser.defaultProps = {
  user: {
    avatar: '/static/images/user/avatar.png',
    notifications: 20
  }
};

HeaderUser.propTypes = {
  user: React.PropTypes.object
};
