import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import DatasetList from 'components/app/explore/DatasetList';
import Spinner from 'components/ui/Spinner';

class SimilarDatasets extends PureComponent {
  render() {
    const { data, loading } = this.props;

    return (
      <div className="c-similar-datasets">
        <Spinner isLoading={loading} className="-light" />
        <h3>Similar datasets</h3>
        {data && data.length > 0 &&
          <DatasetList
            active={[]}
            list={data}
            mode="grid"
            showActions={false}
            showFavorite={false}
            onTagSelected={this.props.onTagSelected}
          />
        }
      </div>
    );
  }
}

SimilarDatasets.propTypes = {
  // Callbacks
  onTagSelected: PropTypes.func,
  // Store
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
};

export default SimilarDatasets;
