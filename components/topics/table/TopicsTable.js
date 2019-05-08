import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { getAllTopics, setFilter } from 'modules/topics/actions';

// Components
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';
import SearchInput from 'components/ui/SearchInput';

// selectors
import { getAllFilteredTopics } from './selectors';

// Table components
import EditAction from './actions/EditAction';
import DeleteAction from './actions/DeleteAction';

// TDs
import NameTD from './td/name';
import PublishedTD from './td/published';
import PreviewTD from './td/preview';
import RoleTD from './td/role';

class TopicsTable extends PureComponent {
  static propTypes = {
    authorization: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    topics: PropTypes.array.isRequired,
    error: PropTypes.any,
    getAllTopics: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired
  };

  static defaultProps = { error: null }

  /**
   * Event handler executed when the user search for a topic
   * @param {string} { value } Search keywords
   */
  onSearch = (value) => {
    if (!value.length) {
      this.props.setFilter({ key: 'all', value: [] });
    } else {
      this.props.setFilter({ key: 'all', value: [{ key: 'name', value }] });
    }
  }

  render() {
    const {
      topics,
      loading,
      error,
      authorization
    } = this.props;

    return (
      <div className="c-topics-table">
        {loading &&
          <Spinner className="-light" isLoading={loading} />}

        {error && (
          <p>Error: {error}</p>
        )}

        <SearchInput
          input={{ placeholder: 'Search topic' }}
          link={{
            label: 'New topic',
            route: 'admin_topics_detail',
            params: { tab: 'topics', id: 'new' }
          }}
          onSearch={this.onSearch}
        />

        {!error && (
          <CustomTable
            columns={[
              { label: 'Name', value: 'name', td: NameTD },
              { label: 'Role', value: 'role', td: RoleTD },
              { label: 'Preview', value: 'slug', td: PreviewTD },
              { label: 'Published', value: 'published', td: PublishedTD }
            ]}
            actions={{
              show: true,
              list: [
                { name: 'Edit', route: 'admin_topics_detail', params: { tab: 'topics', subtab: 'edit', id: '{{id}}' }, show: true, component: EditAction },
                { name: 'Remove', route: 'admin_topics_detail', params: { tab: 'topics', subtab: 'remove', id: '{{id}}' }, component: DeleteAction, componentProps: { authorization } }
              ]
            }}
            sort={{
              field: 'name',
              value: 1
            }}
            filters={false}
            data={topics}
            pageSize={20}
            onRowDelete={() => this.props.getAllTopics()}
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

export default connect(
  state => ({
    loading: state.topics.all.loading,
    topics: getAllFilteredTopics(state),
    error: state.topics.all.error
  }),
  {
    getAllTopics,
    setFilter
  }
)(TopicsTable);
