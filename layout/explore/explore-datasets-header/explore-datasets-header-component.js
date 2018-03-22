import React from 'react';
import PropTypes from 'prop-types';

// Responsive
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';

// Components
import ExploreDatasetsSort from './explore-datasets-sort';
import ExploreDatasetsMode from './explore-datasets-mode';

class ExploreDatasetsHeaderComponent extends React.Component {
  static propTypes = {
    total: PropTypes.number,
    responsive: PropTypes.object
  };

  render() {
    const {
      total,
      responsive
    } = this.props;

    return (
      <div className="c-explore-datasets-header">
        <div className="total">
          {total} datasets
        </div>

        <div className="actions">
          <ExploreDatasetsSort />

          {/* Desktop map */}
          <MediaQuery
            minDeviceWidth={breakpoints.medium}
            values={{ deviceWidth: responsive.fakeWidth }}
          >
            <ExploreDatasetsMode />
          </MediaQuery>
        </div>
      </div>
    );
  }
}

export default ExploreDatasetsHeaderComponent;
