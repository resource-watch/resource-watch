import React from 'react';


class MyRWActivity extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      starredDashboards: [],
      starredInsights: []
    };
  }

  render() {
    const { starredDashboards, starredInsights } = this.state;

    return (
      <div className="c-myrw-activity">
        Activity
      </div>
    );
  }
}

export default MyRWActivity;
