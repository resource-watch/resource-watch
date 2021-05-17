import { PureComponent } from 'react';
import PropTypes from 'prop-types';

// lib
import {
  Media,
} from 'lib/media';

// components
import ExploreDatasetsSort from './explore-datasets-sort';
import ExploreDatasetsMode from './explore-datasets-mode';

class ExploreDatasetsHeaderComponent extends PureComponent {
  static propTypes = {
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }

  getTotalDatasets = () => {
    const {
      page,
      limit,
      total,
    } = this.props;

    const from = (page === 1) ? page : ((page - 1) * limit) + 1;
    let to = (page === 1) ? page * limit : ((page - 1) * limit) + limit;

    if (to > total) to = total;

    if (total < limit) return `${total}`;

    return `${from}-${to} / ${total}`;
  }

  render() {
    return (
      <div className="c-explore-datasets-header">
        <div className="total">
          {this.getTotalDatasets()}
          {' '}
          datasets
        </div>

        <div className="actions">
          <ExploreDatasetsSort />

          <Media
            greaterThanOrEqual="md"
          >
            <ExploreDatasetsMode />
          </Media>
        </div>
      </div>
    );
  }
}

export default ExploreDatasetsHeaderComponent;
