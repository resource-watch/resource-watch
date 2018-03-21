import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import DatasetList from 'components/datasets/list';
import Spinner from 'components/ui/Spinner';

class SimilarDatasets extends PureComponent {
  static propTypes = {
    // Store
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired
  };

  render() {
    const { loading, data } = this.props;

    return (
      <div className="c-similar-datasets">
        <Spinner isLoading={loading} className="-light" />

        {!loading && !data.length &&
          <p>No data available</p>
        }

        {!!data.length &&
          <DatasetList
            list={data}
            mode="grid"
          />
        }
      </div>
    );
  }
}

export default SimilarDatasets;
