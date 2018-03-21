import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

// Components
import SearchInput from 'components/ui/SearchInput';

class ExploreHeaderComponent extends React.Component {
  static propTypes = {
    search: PropTypes.string,

    // Actions
    fetchDatasets: PropTypes.func,
    setDatasetsPage: PropTypes.func,
    setFiltersSearch: PropTypes.func
  };

  onSearch = (search) => {
    this.props.setFiltersSearch(search);
    this.fetchDatasets();
  }

  fetchDatasets = debounce(() => {
    this.props.setDatasetsPage(1);
    this.props.fetchDatasets();
  }, 300);

  render() {
    const { search } = this.props;

    return (
      <div className="c-explore-header">
        <h1>Explore</h1>

        <div className="explore-header-container">
          <SearchInput
            onSearch={this.onSearch}
            input={{
              defaultValue: search,
              placeholder: 'Search dataset'
            }}
            escapeText={false}
          />
        </div>
      </div>
    );
  }
}

export default ExploreHeaderComponent;
