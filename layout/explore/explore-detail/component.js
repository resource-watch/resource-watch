import React from 'react';
import PropTypes from 'prop-types';

// Components
import ExploreDetailHeader from './explore-detail-header';

class ExploreDetailComponent extends React.Component {
  static propTypes = { dataset: PropTypes.object.isRequired };


  render() {
    const { dataset: { id, data } } = this.props;

    return (
      <div className="c-explore-detail">
        <ExploreDetailHeader />
      </div>
    );
  }
}

export default ExploreDetailComponent;
