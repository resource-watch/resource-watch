import React from 'react';
import PropTypes from 'prop-types';

// Utils
import { USERREPORT_BLACKLIST } from 'utils/user-report';

export default class UserReport extends React.Component {
  static propTypes = {
    routes: PropTypes.object
  }

  shouldComponentUpdate() {
    // This component doesn't need to re-render because
    // everything is static
    return false;
  }

  render() {
    const { pathname } = this.props.routes;
    if (USERREPORT_BLACKLIST.includes(pathname)) {
      return null;
    }

    return (
      <button
        className="c-user-report"
        onClick={() => window !== 'undefined' && window._urq.push(['Feedback_Open'])}
      >
        Feedback
      </button>
    );
  }
}
