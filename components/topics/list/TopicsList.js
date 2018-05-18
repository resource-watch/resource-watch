import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';
import { getTopics, deleteTopic, setFilters } from 'redactions/admin/topics';

// Selectors
import getFilteredTopics from 'selectors/admin/topics';

// Components
import Spinner from 'components/ui/Spinner';
import SearchInput from 'components/ui/SearchInput';
import TopicsListCard from 'components/topics/list/TopicsListCard';

class TopicsList extends React.Component {
  static defaultProps = {
    routes: {
      index: '',
      detail: ''
    },
    getTopicsFilters: {},
    // Store
    topics: []
  };

  static propTypes = {
    routes: PropTypes.object,
    getTopicsFilters: PropTypes.object,

    // Store
    topics: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    filters: PropTypes.array,

    // Actions
    getTopics: PropTypes.func.isRequired,
    deleteTopic: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };

    this.onSearch = this.onSearch.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    const { getTopicsFilters } = this.props;

    this.props.setFilters([]);
    this.props.getTopics({
      filters: getTopicsFilters
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading !== this.state.loading) {
      this.setState({ loading: nextProps.loading });
    }
  }

  /**
   * UI EVENTS
   * - onSearch
  */
  onSearch(value) {
    if (!value.length) {
      this.props.setFilters([]);
    } else {
      this.props.setFilters([{ key: 'name', value }]);
    }
  }

  onDelete(topic) {
    toastr.confirm(`Are you sure that you want to delete: "${topic.name}"`, {
      onOk: () => {
        this.props.deleteTopic({
          id: topic.id
        })
          .then(() => {
            const { getTopicsFilters } = this.props;

            this.props.setFilters([]);
            this.props.getTopics({
              filters: getTopicsFilters
            });
            toastr.success('Success', `The topic "${topic.id}" - "${topic.name}" has been removed correctly`);
          })
          .catch((err) => {
            toastr.error('Error', `The topic "${topic.id}" - "${topic.name}" was not deleted. Try again. ${err}`);
          });
      }
    });
  }

  render() {
    const { topics, routes, filters } = this.props;
    const { loading } = this.state;

    return (
      <div className="c-topics-list">
        <Spinner
          className="-light"
          isLoading={loading}
        />

        <SearchInput
          input={{
            placeholder: 'Search topic'
          }}
          link={{
            label: 'New topic',
            route: routes.detail,
            params: { tab: 'topics', id: 'new' }
          }}
          onSearch={this.onSearch}
        />

        <div className="l-row row list">
          {topics.map(topic => (
            <div
              className="column list-item small-12 medium-4"
              key={topic.id}
            >
              <TopicsListCard
                topic={topic}
                routes={routes}
                onDelete={this.onDelete}
              />
            </div>
          ))}
          {!loading && topics.length === 0 && filters.length === 0 &&
            <div className="text-container">
              You currently have no topics
            </div>
          }
          {!loading && topics.length === 0 && filters.length > 0 &&
            <div className="text-container">
              There were no topics found with the text provided
            </div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  loading: state.topics.topics.loading,
  topics: getFilteredTopics(state),
  error: state.topics.topics.error,
  filters: state.clientTopics.filters
});

const mapDispatchToProps = {
  getTopics,
  deleteTopic,
  setFilters
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicsList);
