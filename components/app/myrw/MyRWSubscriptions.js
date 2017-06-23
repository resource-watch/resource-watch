import React from 'react';

// Components
import Title from 'components/ui/Title';


class MyRWSubscriptions extends React.Component {
  render() {
    return (
      <div className="c-page-section">
        <div className="l-container">
          <Title className="-primary -huge" >
            Subscriptions
          </Title>
        </div>
      </div>
    );
  }
}

MyRWSubscriptions.propTypes = {
};

export default MyRWSubscriptions;
