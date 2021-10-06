import {
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import classnames from 'classnames';

// utils
import { logEvent } from 'utils/analytics';

// components
import Paginator from 'components/ui/Paginator';
import Icon from 'components/ui/icon';
import { TOPICS } from 'layout/explore/explore-topics/constants';
import ExploreDatasetsSort from 'layout/explore/explore-datasets-header/explore-datasets-sort';
import DatasetList from './list';
import ExploreDatasetsActions from './explore-datasets-actions';

// Styles
import './styles.scss';

export default function ExploreDatasets(props) {
  const {
    datasets: {
      selected,
      list,
      total,
      limit,
      page,
      loading,
    },
    selectedTags,
    search,
    setDatasetsPage,
    fetchDatasets,
  } = props;

  const relatedDashboards = useMemo(
    () => TOPICS.filter((topic) => selectedTags.find((tag) => tag.id === topic.id))
      .map((_dashboard) => ({
        ..._dashboard,
        ..._dashboard.slug === 'ocean-watch' && {
          label: 'Ocean Watch',
        },
      })),
    [selectedTags],
  );

  const fetchDatasetsPerPage = useCallback((_page) => {
    setDatasetsPage(_page);
    fetchDatasets();
  }, [setDatasetsPage, fetchDatasets]);

  useEffect(() => {
    fetchDatasetsPerPage(1);
  }, [fetchDatasetsPerPage]);

  const classValue = classnames({
    'c-explore-datasets': true,
    '-hidden': selected,
  });

  return (
    <div className={classValue}>
      <div className="explore-datasets-header">
        <div className="left-container">
          <ExploreDatasetsSort />
          <div className="tags-container">
            {selectedTags.length > 0
              && selectedTags.map((t) => (
                <button
                  key={t.id}
                  className="c-button -primary -compressed"
                  onClick={() => {
                    props.toggleFiltersSelected({ tag: t, tab: 'topics' });
                    fetchDatasetsPerPage(1);
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
                  fetchDatasetsPerPage(1);
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

      {relatedDashboards.length > 0
        && (
        <div className="related-dashboards">
          <div className="header">
            <h4>Related dashboards</h4>
            <Link href="/dashboards">
              <a className="header-button">
                SEE ALL
              </a>
            </Link>
          </div>
          {relatedDashboards.map((dashboard) => (
            <Link href={`/dashboards/${dashboard.slug}`}>
              <div
                className="dashboard-button"
                style={{
                  background: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.30)),url(${dashboard.backgroundURL})`,
                  'background-position': 'center',
                  'background-size': 'cover',
                }}
                onClick={() => logEvent('Explore Menu', 'Select Dashboard', dashboard.label)}
                role="button"
                tabIndex={0}
                onKeyPress={() => {}}
              >
                <div className="dashboard-title">
                  {dashboard.label}
                </div>
              </div>
            </Link>
          ))}
        </div>
        )}

      {!list.length && !loading
        && (
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
        )}

      <DatasetList
        loading={loading}
        numberOfPlaceholders={20}
        list={list}
        actions={(
          <ExploreDatasetsActions />
        )}
      />

      {!!list.length && total > limit
        && (
        <Paginator
          options={{
            page,
            limit,
            size: total,
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

            fetchDatasetsPerPage(p);
          }}
        />
        )}

    </div>
  );
}

ExploreDatasets.propTypes = {
  datasets: PropTypes.shape({
    selected: PropTypes.string.isRequired,
    list: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    ).isRequired,
    total: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
  }).isRequired,
  selectedTags: PropTypes.arrayOf(
    PropTypes.shape(),
  ).isRequired,
  search: PropTypes.string.isRequired,
  fetchDatasets: PropTypes.func.isRequired,
  setDatasetsPage: PropTypes.func.isRequired,
  toggleFiltersSelected: PropTypes.func.isRequired,
  resetFiltersSort: PropTypes.func.isRequired,
  setFiltersSearch: PropTypes.func.isRequired,
};
