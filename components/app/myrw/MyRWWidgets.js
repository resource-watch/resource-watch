import React from 'react';

// Components
import Title from 'components/ui/Title';


class MyRWWidgets extends React.Component {
  render() {
    const subtab = this.props.subtab || 'starred';

    return (
      <div className="c-myrw-widgets">
        <div className="l-container">
          {subtab === 'starred' &&
            <Title className="-primary -huge" >
              Starred
            </Title>
          }


          {subtab === 'my-widgets' &&
            <Title className="-primary -huge" >
              My Widgets
            </Title>
          }
        </div>
      </div>
    );
  }
}

MyRWWidgets.propTypes = {
  subtab: React.PropTypes.string
};

export default MyRWWidgets;
