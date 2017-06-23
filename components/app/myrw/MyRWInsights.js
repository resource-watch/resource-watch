import React from 'react';

// Components
import Title from 'components/ui/Title';


class MyRWInsights extends React.Component {
  render() {
    const subtab = this.props.subtab || 'starred';

    return (
      <div className="c-myrw-insights">
        <div className="l-container">
          {subtab === 'starred' &&
            <Title className="-primary -huge" >
              Starred
            </Title>
          }


          {subtab === 'my-insights' &&
            <Title className="-primary -huge" >
              My Insights
            </Title>
          }
        </div>
      </div>
    );
  }
}

MyRWInsights.propTypes = {
  subtab: React.PropTypes.string
};

export default MyRWInsights;
