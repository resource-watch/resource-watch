/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

// Components
import DatasetSearch from 'components/datasets/search';

class ExploreHeaderComponent extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    tab: PropTypes.string,
    options: PropTypes.object,
    selected: PropTypes.object,

    // ACTIONS
    fetchDatasets: PropTypes.func,
    setDatasetsPage: PropTypes.func,
    setFiltersOpen: PropTypes.func,
    setFiltersTab: PropTypes.func,
    toggleFiltersSelected: PropTypes.func,
    resetFiltersSelected: PropTypes.func
  }

  onChangeSelected = (payload) => {
    this.props.toggleFiltersSelected(payload);
    this.fetchDatasets();
  }

  onResetSelected = () => {
    this.props.resetFiltersSelected();
    this.fetchDatasets();
  }

  fetchDatasets = () => {
    this.props.setDatasetsPage(1);
    this.props.fetchDatasets();
  };

  render() {
    const {
      open,
      options,
      tab,
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
            options={options}
            selected={selected}
            onChangeOpen={this.props.setFiltersOpen}
            onChangeTab={this.props.setFiltersTab}
            onChangeSelected={this.onChangeSelected}
            onResetSelected={this.onResetSelected}
            onChangeSearch={null}
          />
        </div>
      </div>
    );
  }
}

export default ExploreHeaderComponent;
