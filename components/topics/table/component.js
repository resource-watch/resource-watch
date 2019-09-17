import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';
import SearchInput from 'components/ui/SearchInput';

// constants
import { INITIAL_PAGINATION } from './constants';

// Table components
import EditAction from './actions/EditAction';
import DeleteAction from './actions/DeleteAction';

// TDs
import NameTD from './td/name';
import PublishedTD from './td/published';
import PreviewTD from './td/preview';
import RoleTD from './td/role';
import OwnerTD from './td/owner';

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

  state = {
    pagination: INITIAL_PAGINATION,
    topics: this.props.topics.map(_topic => ({
      ..._topic,
      owner: _topic.user ? _topic.user.name || (_topic.user.email || '').split('@')[0] : '',
      role: _topic.user ? _topic.user.role || '' : ''
    }))
  };

  componentWillMount() {
    const { getAllTopics, authorization } = this.props;
    getAllTopics({ includes: 'user' }, { Authorization: authorization });
  }

  componentWillReceiveProps(nextProps) {
    const { topics } = this.props;
    const { topics: nextTopics } = nextProps;
    const { pagination } = this.state;
    const topicsChanged = topics.length !== nextTopics.length;

    this.setState({
      pagination: {
        ...pagination,
        size: nextTopics.length,
        ...topicsChanged && { page: 1 },
        pages: Math.ceil(nextTopics.length / pagination.limit)
      },
      topics: nextTopics.map(_topic => ({
        ..._topic,
        owner: _topic.user ? _topic.user.name || (_topic.user.email || '').split('@')[0] : '',
        role: _topic.user ? _topic.user.role || '' : ''
      }))
    });
  }

  onChangePage = (page) => {
    const { pagination } = this.state;

    this.setState({
      pagination: {
        ...pagination,
        page
      }
    });
  }

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
      loading,
      error,
      authorization
    } = this.props;
    const { pagination, topics } = this.state;

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
              { label: 'Owner', value: 'owner', td: OwnerTD },
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
            manualPagination
            onChangePage={this.onChangePage}
            onRowDelete={() => this.props.getAllTopics()}
            pagination={pagination}
          />
        )}
      </div>
    );
  }
}

export default TopicsTable;
