import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import TreeSelector from 'components/ui/tree-selector/tree-selector';

// Utils
import { logEvent } from 'utils/analytics';

// Constants
import PLACEHOLDERS_DATASET_FILTERS from './explore-dataset-filters-constants';

class ExploreDatasetFilters extends PureComponent {
  renderFilters() {
    const { data } = this.props;

    const filters = Object.keys(data).map(key =>
      (<TreeSelector
        key={key}
        data={data[key]}
        placeholderText={PLACEHOLDERS_DATASET_FILTERS[key]}
        onChange={(currentNode, selectedNodes) => this.onChange(selectedNodes, key)}
      />)
    );

    return (
      <div className="filters-container">
        {filters}
      </div>
    );
  }

  render() {
    const selectedTags = [];
    return (
      <div className="c-explore-dataset-filters">
        {selectedTags.length > 0 &&
          <div className="filters-sum-up">
            <div className="filters-text">
              Filtered by:
            </div>
            <div className="selected-tags-container">
              {selectedTags.map(t => (
                <div
                  key={t.value}
                  className="tag"
                >
                  {t.label}
                  <button
                    className="tag-remove"
                    onClick={() => this.handleRemoveTag(t)}
                  >
                    x
                  </button>
                </div>
              ))}
              {selectedTags.length > 0 &&
                <div
                  className="tag clear-filters"
                  role="button"
                  tabIndex={-1}
                  onClick={this.handleClearFilters}
                >
                  Clear filters
                </div>
              }
            </div>
          </div>
        }
        <div className="filters-container">
          <div className="row">
            <div className="column small-12">
              {this.renderFilters()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ExploreDatasetFilters.propTypes = {
  data: PropTypes.object,
  onSetDatasetFilter: PropTypes.func
};

ExploreDatasetFilters.defaultProps = {
  data: {}
};

export default ExploreDatasetFilters;
