import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

// Components
import DatasetList from 'components/datasets/list';
import Paginator from 'components/ui/Paginator';

class ExploreDatasetsComponent extends React.Component {
  static propTypes = {
    list: PropTypes.array,
    mode: PropTypes.string,
    page: PropTypes.number,
    total: PropTypes.number,
    limit: PropTypes.number,

    // Actions
    fetchDatasets: PropTypes.func,
    setDatasetsPage: PropTypes.func
  };

  fetchDatasets = debounce(() => {
    this.props.setDatasetsPage(1);
    this.props.fetchDatasets();
  }, 300);

  render() {
    const {
      list, mode, page, limit, total
    } = this.props;

    return (
      <div className="c-explore-datasets">
        <DatasetList
          list={list}
          mode={mode}
          grid={{
            small: 'small-12',
            medium: 'medium-6'
            // large: 'xxlarge-6',
            // xlarge: 'xxlarge-4',
            // xxlarge: 'xxlarge-4'
          }}
          showActions
          onTagSelected={this.handleTagSelected}
        />
        <Paginator
          options={{
            page,
            limit,
            size: total
          }}
          onChange={(p) => {
            this.props.setDatasetsPage(p);
            // Scroll to the top of the list
            document.getElementsByClassName('sidebar-content')[0].scrollTop = 0;
          }}
        />
      </div>
    );
  }
}

export default ExploreDatasetsComponent;
