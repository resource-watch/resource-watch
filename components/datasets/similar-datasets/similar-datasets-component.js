import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import DatasetList from 'components/app/explore/DatasetList';
import Spinner from 'components/ui/Spinner';

class SimilarDatasets extends PureComponent {
  static defaultProps = {
    active: []
  };

  static propTypes = {
    active: PropTypes.array,
    // Callbacks
    onTagSelected: PropTypes.func,
    // Store
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired
  };

  render() {
    const { loading, data, active } = this.props;

    return (
      <div className="c-similar-datasets">
        <Spinner isLoading={loading} className="-light" />

        {!loading && !data.length &&
          <p>No data available</p>
        }

        {!!data.length &&
          <DatasetList
            active={active}
            list={data}
            mode="grid"
            showActions={false}
            showFavorite
            onTagSelected={this.props.onTagSelected}
          />
        }
      </div>
    );
  }
}

export default SimilarDatasets;
