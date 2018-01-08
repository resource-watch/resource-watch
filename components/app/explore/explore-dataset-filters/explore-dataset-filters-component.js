import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import TreeSelector from 'components/ui/tree-selector/tree-selector';
import { findTagInSelectorTree } from 'utils/explore/TreeUtil';

// Constants
import PLACEHOLDERS_DATASET_FILTERS from './explore-dataset-filters-constants';

class ExploreDatasetFilters extends PureComponent {
  render() {
    const { exploreDatasetFilters, showFilters } = this.props;
    const { filters, data } = exploreDatasetFilters;
    const { topics, dataTypes, geographies } = filters;

    const newTopics = topics ?
      topics.map(t => findTagInSelectorTree(data.topics, t)) : {};
    const newGeographies = geographies ?
      geographies.map(t => findTagInSelectorTree(data.geographies, t)) : {};
    const newDataTypes = dataTypes ?
      dataTypes.map(t => findTagInSelectorTree(data.dataTypes, t)) : {};
    const selectedTags = [...newTopics, ...newGeographies, ...newDataTypes];
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
                    onClick={() => this.props.removeTagFilter(t)}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
            <div className="clear-filters-container">
              {selectedTags.length > 0 &&
                <div
                  className="tag clear-filters"
                  role="button"
                  tabIndex={-1}
                  onClick={() => this.props.clearFilters()}
                >
                  Clear filters
                </div>
              }
            </div>
          </div>
        }
        {showFilters &&
          <div className="filters-container">
            {Object.keys(this.props.data).map(key =>
              (
                <TreeSelector
                  key={key}
                  data={this.props.data[key]}
                  placeholderText={PLACEHOLDERS_DATASET_FILTERS[key]}
                  onChange={(currentNode, selectedNodes) => {
                    const filterValues = selectedNodes.map(v => v.value);
                    this.props.onSetDatasetFilter({ [key]: filterValues });
                  }}
                />
              )
            )}
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  exploreDatasetFilters: state.exploreDatasetFilters
});

ExploreDatasetFilters.propTypes = {
  data: PropTypes.object.isRequired,
  onSetDatasetFilter: PropTypes.func.isRequired,
  showFilters: PropTypes.bool,
  // Store
  exploreDatasetFilters: PropTypes.object.isRequired,
  clearFilters: PropTypes.func.isRequired,
  removeTagFilter: PropTypes.func.isRequired
};

ExploreDatasetFilters.defaultProps = {
  data: {},
  showFilters: false
};

export default connect(mapStateToProps, null)(ExploreDatasetFilters);
