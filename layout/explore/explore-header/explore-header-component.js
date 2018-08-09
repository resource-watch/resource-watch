/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
// Components
import DatasetSearch from 'components/datasets/search';
// Utils
import { logEvent } from 'utils/analytics';

class ExploreHeaderComponent extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    tab: PropTypes.string,
    tags: PropTypes.array,
    options: PropTypes.object,
    selected: PropTypes.object,
    search: PropTypes.string,
    sortSelected: PropTypes.string,
    shouldAutoUpdateSortDirection: PropTypes.bool,

    // ACTIONS
    fetchDatasets: PropTypes.func,
    setDatasetsPage: PropTypes.func,
    setFiltersOpen: PropTypes.func,
    setFiltersTab: PropTypes.func,
    setFiltersSearch: PropTypes.func,
    setFiltersSelected: PropTypes.func,
    setSortSelected: PropTypes.func,
    setSortDirection: PropTypes.func,
    toggleFiltersSelected: PropTypes.func,
    resetFiltersSelected: PropTypes.func,
    resetFiltersSort: PropTypes.func
  }

  onChangeSearch = (search) => {
    if (search.length === 0 && this.props.sortSelected === 'relevance') {
      this.props.resetFiltersSort();
    }
    this.props.setFiltersSearch(search);
    if (search.length > 0 && this.props.shouldAutoUpdateSortDirection) {
      this.props.setSortSelected('relevance');
      this.props.setSortDirection(-1);
    }
    this.fetchDatasets();
    logEvent('Explore Menu', 'search', search);
  }

  onToggleSelected = (payload) => {
    this.props.toggleFiltersSelected(payload);
    this.fetchDatasets();
  }

  onChangeSelected = (payload = []) => {
    const { tab } = this.props;

    this.props.setFiltersSelected({ key: tab, list: payload });

    this.fetchDatasets();
    logEvent('Explore Menu', `filter ${tab}`, payload.join(','));
  }

  onResetSelected = () => {
    this.props.resetFiltersSelected();
    if (this.props.sortSelected === 'relevance') {
      this.props.resetFiltersSort();
    }
    this.fetchDatasets();
    logEvent('Explore Menu', 'Clear filters', 'click');
  }

  fetchDatasets() {
    this.props.setDatasetsPage(1);
    this.props.fetchDatasets();
  }

  render() {
    const {
      open,
      options,
      tab,
      tags,
      search,
      selected
    } = this.props;

    return (
      <div className="c-explore-header" >
        <h1 >Explore</h1 >
        {/* <p>Identify patterns between data sets on the map or download data for analysis.</p> */}

        <div className="explore-header-container" >
          <DatasetSearch
            open={open}
            tab={tab}
            list={tags}
            search={search}
            options={options}
            selected={selected}
            onChangeOpen={this.props.setFiltersOpen}
            onChangeTab={this.props.setFiltersTab}
            onChangeSearch={this.onChangeSearch}
            onToggleSelected={this.onToggleSelected}
            onChangeSelected={this.onChangeSelected}
            onResetSelected={this.onResetSelected}
          />
        </div >
      </div >
    );
  }
}

export default ExploreHeaderComponent;
