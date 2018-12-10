import React, { PureComponent } from 'react';

class UserReport extends PureComponent {
  onClick = () => {
    // eslint-disable-next-line no-underscore-dangle
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') window._urq.push(['Feedback_Open']);
  }

  render() {
    return (
      <button
        className="c-user-report"
        onClick={this.onClick}
      >
        Feedback
      </button>
    );
  }
}

export default UserReport;
