import React from 'react';

// Components
import Title from 'components/ui/Title';


class MyRWDashboards extends React.Component {
  render() {
    const subtab = this.props.subtab || 'starred';

    return (
      <div className="c-myrw-dashboards">
        <div className="l-container">
          {subtab === 'starred' &&
            <Title className="-primary -huge" >
              Starred
            </Title>
          }


          {subtab === 'my-dashboards' &&
            <Title className="-primary -huge" >
              My Dashboards
            </Title>
          }
        </div>
      </div>
    );
  }
}

MyRWDashboards.propTypes = {
  subtab: React.PropTypes.string
};

export default MyRWDashboards;
