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
    page: PropTypes.number,
    limit: PropTypes.number,
    total: PropTypes.number,
    responsive: PropTypes.object
  };

  getTotalDatasets = () => {
    const {
      page,
      limit,
      total
    } = this.props;

    const from = (page === 1) ? page : (page * limit) + 1;
    const to = (page === 1) ? page * limit : (page * limit) + limit;

    if (total < limit) {
      return `${total}`;
    }

    return `${from}-${to} / ${total}`;
  }

  render() {
    const {
      responsive
    } = this.props;

    return (
      <div className="c-explore-datasets-header">
        <div className="total">
          {this.getTotalDatasets()} datasets
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
