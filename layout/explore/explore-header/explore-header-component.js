/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

// Components
import DatasetSearch from 'components/datasets/search';

class ExploreHeaderComponent extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    tab: PropTypes.string,
    options: PropTypes.object,
    selected: PropTypes.object,
    search: PropTypes.string,

    // ACTIONS
    fetchDatasets: PropTypes.func,
    setDatasetsPage: PropTypes.func,
    setFiltersOpen: PropTypes.func,
    setFiltersTab: PropTypes.func,
    setFiltersSearch: PropTypes.func,
    toggleFiltersSelected: PropTypes.func,
    resetFiltersSelected: PropTypes.func
  }

  onChangeSearch = (search) => {
    this.props.setFiltersSearch(search);
    this.fetchDatasets();
  }

  onChangeSelected = (payload) => {
    this.props.toggleFiltersSelected(payload);
    this.fetchDatasets();
  }

  onResetSelected = () => {
    this.props.resetFiltersSelected();
    this.fetchDatasets();
  }

  fetchDatasets = debounce(() => {
    this.props.setDatasetsPage(1);
    this.props.fetchDatasets();
  }, 250);

  render() {
    const {
      open,
      options,
      tab,
      search,
      selected
    } = this.props;

    return (
      <div className="c-explore-header">
        <h1>Explore</h1>
        {/* <p>Identify patterns between data sets on the map or download data for analysis.</p> */}

        <div className="explore-header-container">
          <DatasetSearch
            open={open}
            tab={tab}
            search={search}
            options={options}
            selected={selected}
            onChangeOpen={this.props.setFiltersOpen}
            onChangeTab={this.props.setFiltersTab}
            onChangeSearch={this.onChangeSearch}
            onChangeSelected={this.onChangeSelected}
            onResetSelected={this.onResetSelected}
          />
        </div>
      </div>
    );
  }
}

export default ExploreHeaderComponent;
