import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Link } from 'routes';

// Responsive
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';

// Components
import Paginator from 'components/ui/Paginator';
import Icon from 'components/ui/icon';
import Spinner from 'components/ui/Spinner';
import { TOPICS } from 'layout/explore/explore-topics/constants';

// Explore components
import DatasetList from './list';
import ExploreDatasetsSort from 'layout/explore/explore-datasets-header/explore-datasets-sort';
import ExploreDatasetsTags from './explore-datasets-tags';
import ExploreDatasetsActions from './explore-datasets-actions';

// Styles
import './styles.scss';

class ExploreDatasetsComponent extends React.Component {
  static propTypes = {
    list: PropTypes.array,
    page: PropTypes.number,
    total: PropTypes.number,
    limit: PropTypes.number,
    options: PropTypes.object,
    responsive: PropTypes.object,
    selectedTags: PropTypes.array.isRequired,
    search: PropTypes.string.isRequired,

    // Actions
    fetchDatasets: PropTypes.func.isRequired,
    setDatasetsPage: PropTypes.func.isRequired,
    toggleFiltersSelected: PropTypes.func.isRequired,
    resetFiltersSort: PropTypes.func.isRequired,
    setFiltersSearch: PropTypes.func.isRequired
  };

  // onTagSelected = (tag) => {
  //   const options = Object.keys(this.props.options).map(o => this.props.options[o]);

  //   const tab = (options.find((o) => {
  //     const labels = (tag && tag.labels) || [];
  //     return o.type === labels[1];
  //   }) || {}).value || 'custom';

  //   this.props.toggleFiltersSelected({
  //     tab,
  //     tag
  //   });
  //   this.fetchDatasets(1);
  // }

  fetchDatasets = debounce((page) => {
    this.props.setDatasetsPage(page);
    this.props.fetchDatasets();
  });

  render() {
    const {
      list,
      page,
      limit,
      total,
      responsive,
      selectedTags,
      search,
      loading
    } = this.props;

    const relatedDashboards =
      TOPICS.filter(topic => selectedTags.find(tag => tag.id === topic.id));

    return (
      <div className="c-explore-datasets">
        {loading && <Spinner isLoading className="-light" />}
        <div className="explore-datasets-header">
          <div className="left-container">
            <ExploreDatasetsSort />
            <div className="tags-container">
              {selectedTags.length > 0 &&
                selectedTags.map(t => (
                  <button
                    key={t.id}
                    className="c-button -primary -compressed"
                    onClick={() => {
                      this.props.toggleFiltersSelected({ tag: t, tab: 'topics' });
                      this.fetchDatasets();
                    }}
                  >
                    <span
                      className="button-text"
                      title={t.label.toUpperCase()}
                    >
                      {t.label.toUpperCase()}
                    </span>
                    <Icon
                      name="icon-cross"
                      className="-tiny"
                    />
                  </button>
                ))}
              {search && (
                <button
                  key="text-filter"
                  className="c-button -primary -compressed"
                  onClick={() => {
                    this.props.resetFiltersSort();
                    this.props.setFiltersSearch('');
                    this.fetchDatasets();
                  }}
                >
                  {`TEXT: ${search.toUpperCase()}`}
                  <Icon
                    name="icon-cross"
                    className="-tiny"
                  />
                </button>
              )}
            </div>
          </div>
          <div className="number-of-datasets">
            {`${total} ${total === 1 ? 'DATASET' : 'DATASETS'}`}
          </div>
        </div>

        {relatedDashboards.length > 0 &&
        <div className="related-dashboards">
          <div className="header">
            <h4>Related dashboards</h4>
            <Link to="dashboards">
              <a className="header-button">
                            SEE ALL
              </a>
            </Link>
          </div>
          {relatedDashboards.map(dashboard => (
            <Link to="dashboards_detail" params={{ slug: dashboard.slug }}>
              <div
                className="dashboard-button"
                style={{ 'background-image': `url(${dashboard.backgroundURL}` }}
              >
                <div className="dashboard-title">
                  {dashboard.label}
                </div>
              </div>
            </Link>
          ))}
        </div>
        }

        {!list.length &&
          <div className="request-data-container">
            <div className="request-data-text">
              Oops! We couldn&#39;t find data for your search...
            </div>
            <a
              className="c-button -primary"
              href="https://docs.google.com/forms/d/e/1FAIpQLSfXsPGQxM6p8KloU920t5Tfhx9FYFOq8-Rjml07UDH9EvsI1w/viewform"
              target="_blank"
              rel="noopener noreferrer"
            >
              Request data
            </a>
          </div>
        }

        {!!list.length &&
          <DatasetList
            list={list}
            tags={
              <ExploreDatasetsTags
                onTagSelected={this.onTagSelected}
              />
            }
            actions={
              <MediaQuery
                minDeviceWidth={breakpoints.medium}
                values={{ deviceWidth: responsive.fakeWidth }}
              >
                <ExploreDatasetsActions />
              </MediaQuery>
            }
          />
        }

        {!!list.length &&
          <Paginator
            options={{
              page,
              limit,
              size: total
            }}
            onChange={(p) => {
              // Scroll to the top of the list
              if (window.scrollTo && document.querySelector('.sidebar-content').scrollTo) {
                window.scrollTo(0, 0);
                document.querySelector('.sidebar-content').scrollTo(0, 0);
              }

              this.fetchDatasets(p);
            }}
          />
        }

      </div>
    );
  }
}

export default ExploreDatasetsComponent;
