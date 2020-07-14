import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Link } from 'routes';
import classnames from 'classnames';

// Responsive
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';

// Utils
import { logEvent } from 'utils/analytics';

// Components
import Paginator from 'components/ui/Paginator';
import Icon from 'components/ui/icon';
import { TOPICS } from 'layout/explore/explore-topics/constants';

// Explore components
import ExploreDatasetsSort from 'layout/explore/explore-datasets-header/explore-datasets-sort';
import DatasetList from './list';
import ExploreDatasetsActions from './explore-datasets-actions';

// Styles
import './styles.scss';

function ExploreDatasetsComponent(props) {
  const {
    datasets: {
      selected,
      list,
      total,
      limit,
      page,
      loading
    },
    responsive,
    selectedTags,
    search
  } = props;

  const relatedDashboards =
    TOPICS.filter(topic => selectedTags.find(tag => tag.id === topic.id));

  const fetchDatasets = debounce((page) => {
    props.setDatasetsPage(page);
    props.fetchDatasets();
  });

  useEffect(() => {
    fetchDatasets(1);
  }, []);

  const classValue = classnames({
    'c-explore-datasets': true,
    '-hidden': selected
  });

  return (
    <div className={classValue}>
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
                    props.toggleFiltersSelected({ tag: t, tab: 'topics' });
                    fetchDatasets(1);
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
                  props.resetFiltersSort();
                  props.setFiltersSearch('');
                  fetchDatasets(1);
                }}
              >
                <span
                  className="button-text"
                  title={`TEXT: ${search.toUpperCase()}`}
                >
                  {`TEXT: ${search.toUpperCase()}`}
                </span>
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
                style={{
                  background: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.30)),url(${dashboard.backgroundURL})`,
                  'background-position': 'center',
                  'background-size': 'cover'
                }}
                onClick={() => logEvent('Explore Menu', 'Select Dashboard', dashboard.label)}
              >
                <div className="dashboard-title">
                  {dashboard.label}
                </div>
              </div>
            </Link>
          ))}
        </div>
      }

      {!list.length && !loading &&
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

      <DatasetList
        loading={loading}
        numberOfPlaceholders={20}
        list={list}
        actions={
          <MediaQuery
            minDeviceWidth={breakpoints.medium}
            values={{ deviceWidth: responsive.fakeWidth }}
          >
            <ExploreDatasetsActions />
          </MediaQuery>
        }
      />

      {!!list.length && total > limit &&
        <Paginator
          options={{
            page,
            limit,
            size: total
          }}
          onChange={(p) => {
            // ------- Scroll to the top of the list -------------------
            const sidebarContent = document.querySelector('.sidebar-content');
            if (window.scrollTo) {
              window.scrollTo(0, 0);
            }
            if (sidebarContent && sidebarContent.scrollTo) {
              sidebarContent.scrollTo(0, 0);
            }
            // ------------------------------------------------

            fetchDatasets(p);
          }}
        />
      }

    </div>
  );
}

ExploreDatasetsComponent.propTypes = {
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

export default ExploreDatasetsComponent;
