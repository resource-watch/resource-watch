import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { getTopics, setFilters } from 'redactions/admin/topics';

// Selectors
import getFilteredTopics from 'selectors/admin/topics';

// Components
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';
import SearchInput from 'components/ui/SearchInput';

// Table components
import EditAction from './actions/EditAction';
import DeleteAction from './actions/DeleteAction';

// TDs
import NameTD from './td/NameTD';
import PublishedTD from './td/PublishedTD';
import PreviewTD from './td/PreviewTD';

class TopicsTable extends React.Component {
  static defaultProps = {
    columns: [],
    actions: {},
    // Store
    topics: [],
    filteredTopics: []
  };

  static propTypes = {
    authorization: PropTypes.string,
    // Store
    loading: PropTypes.bool.isRequired,
    topics: PropTypes.array.isRequired,
    filteredTopics: PropTypes.array.isRequired,
    error: PropTypes.string,

    // Actions
    getTopics: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    // ------------------- Bindings -----------------------
    this.onSearch = this.onSearch.bind(this);
    // ----------------------------------------------------
  }

  componentDidMount() {
    this.props.setFilters([]);
    this.props.getTopics();
  }

  /**
   * Event handler executed when the user search for a dataset
   * @param {string} { value } Search keywords
   */
  onSearch(value) {
    if (!value.length) {
      this.props.setFilters([]);
    } else {
      this.props.setFilters([{ key: 'name', value }]);
    }
  }

  /**
   * HELPERS
   * - getTopics
   * - getFilteredTopics
  */
  getTopics() {
    return this.props.topics;
  }

  getFilteredTopics() {
    return this.props.filteredTopics;
  }

  render() {
    return (
      <div className="c-topics-table">
        <Spinner className="-light" isLoading={this.props.loading} />

        {this.props.error && (
          <p>Error: {this.props.error}</p>
        )}

        <SearchInput
          input={{
            placeholder: 'Search topic'
          }}
          link={{
            label: 'New topic',
            route: 'admin_topics_detail',
            params: { tab: 'topics', id: 'new' }
          }}
          onSearch={this.onSearch}
        />

        {!this.props.error && (
          <CustomTable
            columns={[
              { label: 'Name', value: 'name', td: NameTD },
              { label: 'Preview', value: 'slug', td: PreviewTD },
              { label: 'Published', value: 'published', td: PublishedTD }
            ]}
            actions={{
              show: true,
              list: [
                { name: 'Edit', route: 'admin_topics_detail', params: { tab: 'topics', subtab: 'edit', id: '{{id}}' }, show: true, component: EditAction },
                { name: 'Remove', route: 'admin_topics_detail', params: { tab: 'topics', subtab: 'remove', id: '{{id}}' }, component: DeleteAction, componentProps: { authorization: this.props.authorization } }
              ]
            }}
            sort={{
              field: 'name',
              value: 1
            }}
            filters={false}
            data={this.getFilteredTopics()}
            pageSize={20}
            onRowDelete={() => this.props.getTopics()}
            pagination={{
              enabled: true,
              pageSize: 20,
              page: 0
            }}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.topics.topics.loading,
  topics: state.topics.topics.list,
  filteredTopics: getFilteredTopics(state),
  error: state.topics.topics.error
});
const mapDispatchToProps = {
  getTopics,
  setFilters
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicsTable);
