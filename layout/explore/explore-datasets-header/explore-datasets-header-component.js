import React from 'react';
import PropTypes from 'prop-types';

import ExploreDatasetsSort from './explore-datasets-sort';
import ExploreDatasetsMode from './explore-datasets-mode';

class ExploreDatasetsHeaderComponent extends React.Component {
  static propTypes = {
    total: PropTypes.number
  };

  render() {
    const {
      total
    } = this.props;

    return (
      <div className="c-explore-datasets-header">
        <div className="total">
          {total} datasets
        </div>

        <div className="actions">
          <ExploreDatasetsSort />

          <ExploreDatasetsMode />
        </div>
      </div>
    );
  }
}

export default ExploreDatasetsHeaderComponent;
