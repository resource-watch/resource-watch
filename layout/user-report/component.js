import React from 'react';

export default class UserReport extends React.Component {
  shouldComponentUpdate() {
    // This component doesn't need to re-render because
    // everything is static
    return false;
  }

  render() {
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
