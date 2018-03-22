import React from 'react';
import PropTypes from 'prop-types';

// Components
import DatasetSearch from 'components/datasets/search';

class ExploreHeaderComponent extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    tab: PropTypes.string,
    options: PropTypes.object,

    // ACTIONS
    setFiltersOpen: PropTypes.func,
    setFiltersTab: PropTypes.func
  }

  render() {
    const { open, options, tab } = this.props;

    return (
      <div className="c-explore-header">
        <h1>Explore</h1>
        {/* <p>Identify patterns between data sets on the map or download data for analysis.</p> */}

        <div className="explore-header-container">
          <DatasetSearch
            open={open}
            tab={tab}
            options={options}
            onChangeOpen={this.props.setFiltersOpen}
            onChangeSearch={null}
            onChangeSelected={null}
            onChangeTab={this.props.setFiltersTab}
          />
        </div>
      </div>
    );
  }
}

export default ExploreHeaderComponent;
