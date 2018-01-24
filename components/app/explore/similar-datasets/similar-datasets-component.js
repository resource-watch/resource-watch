import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import DatasetList from 'components/app/explore/DatasetList';

class SimilarDatasets extends PureComponent {
  render() {
    const { similarDatasets } = this.props;

    return (
      <div className="c-similar-datasets">
        <h3>Similar datasets</h3>
        {similarDatasets && similarDatasets.length > 0 &&
        <DatasetList
          active={[]}
          list={similarDatasets}
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
  similarDatasets: PropTypes.array.isRequired
};

export default SimilarDatasets;
