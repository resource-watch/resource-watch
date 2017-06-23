import React from 'react';

// Components
import Title from 'components/ui/Title';


class MyRWProfile extends React.Component {
  render() {
    const subtab = this.props.subtab || 'activity';

    return (
      <div className="c-myrw-profile">
        <div className="l-container">
          {subtab === 'activity' &&
            <Title className="-primary -huge" >
              Activity
            </Title>
          }


          {subtab === 'edit' &&
            <Title className="-primary -huge" >
              Edit
            </Title>
          }
        </div>
      </div>
    );
  }
}

MyRWProfile.propTypes = {
  subtab: React.PropTypes.string
};

export default MyRWProfile;
