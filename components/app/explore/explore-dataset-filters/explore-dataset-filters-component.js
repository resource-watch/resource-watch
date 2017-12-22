import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import TreeSelector from 'components/ui/tree-selector/tree-selector';

// Utils
import { logEvent } from 'utils/analytics';

// Constants
import PLACEHOLDERS_DATASET_FILTERS from './explore-dataset-filters-constants';

class ExploreDatasetFilters extends PureComponent {
  render() {
    const selectedTags = [];
    console.log('this.props', this.props);

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
              <div className="c-tree-selector -explore topics-selector">
                <TreeSelector
                  showDropdown
                  placeholderText={PLACEHOLDERS_DATASET_FILTERS.topics}
                  data={this.topicsTree || { label: '', value: '', children: [] }}
                  onChange={(currentNode, selectedNodes) => {
                    this.filters.topics = selectedNodes.map(val => val.value);
                    const deselect = !selectedNodes.includes(currentNode);

                    if (deselect) {
                      this.topicsTree.forEach(child => this.selectElementsFromTree(
                        child, [currentNode.value], deselect));
                    } else {
                      this.topicsTree.forEach(child => this.selectElementsFromTree(
                        child, this.filters.topics, deselect));
                    }

                    logEvent('Explore', 'Filter Topic', this.filters.topics.join(','));

                    this.applyFilters();
                  }}
                />
              </div>
            </div>
            <div className="column small-12">
              <div className="c-tree-selector -explore geographies-selector ">
                {geographiesTree &&
                  <TreeSelector
                    data={this.geographiesTree || { label: '', value: '', children: [] }}
                    placeholderText={PLACEHOLDERS_DATASET_FILTERS.geographies}
                    onChange={(currentNode, selectedNodes) => {
                      this.filters.geographies = selectedNodes.map(val => val.value);
                      const deselect = !selectedNodes.includes(currentNode);

                      if (deselect) {
                        this.geographiesTree.forEach(child => this.selectElementsFromTree(
                          child, [currentNode.value], deselect));
                      } else {
                        this.geographiesTree.forEach(child => this.selectElementsFromTree(
                          child, this.filters.geographies, deselect));
                      }

                      logEvent('Explore', 'Filter Geography', this.filters.geographies.join(','));

                      this.applyFilters();
                    }}
                  />
                }
              </div>
            </div>
            <div className="column small-12">
              <div className="c-tree-selector -explore data-types-selector">
                {dataTypeTree &&
                  <TreeSelector
                    data={this.dataTypeTree || { label: '', value: '', children: [] }}
                    placeholderText={PLACEHOLDERS_DATASET_FILTERS.dataTypes}
                    onChange={(currentNode, selectedNodes) => {
                      this.filters.dataType = selectedNodes.map(val => val.value);
                      const deselect = !selectedNodes.includes(currentNode);

                      if (deselect) {
                        this.dataTypeTree.forEach(child => this.selectElementsFromTree(
                          child, [currentNode.value], deselect));
                      } else {
                        this.dataTypeTree.forEach(child => this.selectElementsFromTree(
                          child, this.filters.dataType, deselect));
                      }

                      logEvent('Explore', 'Filter Data Type', this.filters.dataType.join(','));

                      this.applyFilters();
                    }}
                  />
                }
              </div>
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
