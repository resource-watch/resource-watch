import {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import DatasetSearch from 'components/datasets/search';
import Icon from 'components/ui/icon';

// hooks
import useFetchCollections from 'hooks/collection/fetch-collections';

// Utils
import { logEvent } from 'utils/analytics';
import { EXPLORE_SECTIONS } from 'layout/explore/constants';

// Styles
import './styles.scss';

const ExploreMenu = ({
  token,
  open,
  options,
  tab,
  tags,
  search,
  selected,
  section,
  selectedCollection,
  setSidebarSection,
  setSidebarSelectedCollection,
  setFiltersOpen,
  setFiltersTab,
  userIsLoggedIn,
  selectedDataset,
  setDatasetsPage,
  fetchDatasets,
  resetFiltersSort,
  setSortSelected,
  setSortDirection,
  sortSelected,
  shouldAutoUpdateSortDirection,
  setFiltersSearch,
  toggleFiltersSelected,
  setFiltersSelected,
  resetFiltersSelected,
}) => {
  const {
    data: collections,
  } = useFetchCollections(
    token,
    {
      sort: 'name',
    },
    {
      initialData: [],
      initialStale: true,
      enabled: !!token,
    },
  );

  const loadDatasets = useCallback(() => {
    setDatasetsPage(1);
    fetchDatasets();
  }, [setDatasetsPage, fetchDatasets]);

  const onChangeTextSearch = useCallback((_search) => {
    if (!_search && sortSelected === 'relevance') {
      resetFiltersSort();
    }
    setFiltersSearch(_search);
    if (_search && shouldAutoUpdateSortDirection) {
      setSortSelected('relevance');
      setSortDirection(-1);
    }

    setSidebarSection(EXPLORE_SECTIONS.ALL_DATA);
    loadDatasets();
    logEvent('Explore Menu', 'search', _search);
  }, [
    resetFiltersSort,
    setFiltersSearch,
    setSortSelected,
    setSortDirection,
    setSidebarSection,
    loadDatasets,
    shouldAutoUpdateSortDirection,
    sortSelected,
  ]);

  const onToggleSelected = useCallback((payload) => {
    if (section !== EXPLORE_SECTIONS.ALL_DATA) {
      setSidebarSection(EXPLORE_SECTIONS.ALL_DATA);
    }
    toggleFiltersSelected({ tag: payload, tab: 'topics' });
    loadDatasets();
  }, [section, setSidebarSection, toggleFiltersSelected, loadDatasets]);

  const onChangeSelected = useCallback((payload = []) => {
    setFiltersSelected({ key: tab, list: payload });

    loadDatasets();
    logEvent('Explore Menu', `filter ${tab}`, payload.join(','));
  }, [setFiltersSelected, tab, loadDatasets]);

  const onResetSelected = useCallback(() => {
    resetFiltersSelected();

    if (sortSelected === 'relevance') {
      resetFiltersSort();
    }

    loadDatasets();
    logEvent('Explore Menu', 'Clear filters', 'click');
  }, [resetFiltersSelected, sortSelected, resetFiltersSort, loadDatasets]);

  const collectionsWithDatasets = useMemo(() => collections
    .filter(({ resources }) => resources.find(({ type }) => type === 'dataset')), [collections]);

  return (
    <div className={classnames({
      'c-explore-menu': true,
      '-hidden': selectedDataset,
    })}
    >
      <DatasetSearch
        open={open}
        tab={tab}
        list={tags}
        search={search}
        options={options}
        selected={selected}
        onChangeOpen={setFiltersOpen}
        onChangeTab={setFiltersTab}
        onChangeTextSearch={onChangeTextSearch}
        onToggleSelected={onToggleSelected}
        onChangeSelected={onChangeSelected}
        onResetSelected={onResetSelected}
      />

      <div className="menu-options">
        <div
          className={classnames({
            'menu-option': true,
            '-active': section === EXPLORE_SECTIONS.DISCOVER,
          })}
          role="button"
          tabIndex={0}
          onKeyPress={() => {
            setSidebarSection(EXPLORE_SECTIONS.DISCOVER);
            logEvent('Explore Menu', 'Clicks tab', EXPLORE_SECTIONS.DISCOVER);
          }}
          onClick={() => {
            setSidebarSection(EXPLORE_SECTIONS.DISCOVER);
            logEvent('Explore Menu', 'Clicks tab', EXPLORE_SECTIONS.DISCOVER);
          }}
        >
          <Icon name={`icon-discover-${section === EXPLORE_SECTIONS.DISCOVER ? 'on' : 'off'}`} />
          Discover
        </div>
        <div
          className={classnames({
            'menu-option': true,
            '-active': section === EXPLORE_SECTIONS.ALL_DATA,
          })}
          role="button"
          tabIndex={0}
          onKeyPress={() => {
            setSidebarSection(EXPLORE_SECTIONS.ALL_DATA);
            logEvent('Explore Menu', 'Clicks tab', EXPLORE_SECTIONS.ALL_DATA);
          }}
          onClick={() => {
            setSidebarSection(EXPLORE_SECTIONS.ALL_DATA);
            logEvent('Explore Menu', 'Clicks tab', EXPLORE_SECTIONS.ALL_DATA);
          }}
        >
          <Icon name={`icon-all-${section === EXPLORE_SECTIONS.ALL_DATA ? 'on' : 'off'}`} />
          All Data
        </div>
        <div
          className={classnames({
            'menu-option': true,
            '-active': section === EXPLORE_SECTIONS.NEAR_REAL_TIME,
          })}
          role="button"
          tabIndex={0}
          onKeyPress={() => {
            setSidebarSection(EXPLORE_SECTIONS.NEAR_REAL_TIME);
            logEvent('Explore Menu', 'Clicks tab', EXPLORE_SECTIONS.NEAR_REAL_TIME);
          }}
          onClick={() => {
            setSidebarSection(EXPLORE_SECTIONS.NEAR_REAL_TIME);
            logEvent('Explore Menu', 'Clicks tab', EXPLORE_SECTIONS.NEAR_REAL_TIME);
          }}
        >
          <Icon name={`icon-recent-${section === EXPLORE_SECTIONS.NEAR_REAL_TIME ? 'on' : 'off'}`} />
          Near Real-Time
        </div>
        <div
          className={classnames({
            'menu-option': true,
            '-active': section === EXPLORE_SECTIONS.TOPICS,
          })}
          role="button"
          tabIndex={0}
          onKeyPress={() => {
            setSidebarSection(EXPLORE_SECTIONS.TOPICS);
            logEvent('Explore Menu', 'Clicks tab', EXPLORE_SECTIONS.TOPICS);
          }}
          onClick={() => {
            setSidebarSection(EXPLORE_SECTIONS.TOPICS);
            logEvent('Explore Menu', 'Clicks tab', EXPLORE_SECTIONS.TOPICS);
          }}
        >
          <Icon name={`icon-topics-${section === EXPLORE_SECTIONS.TOPICS ? 'on' : 'off'}`} />
          Topics
        </div>
        <div
          className={classnames({
            'menu-option': true,
            '-active': section === EXPLORE_SECTIONS.AREAS_OF_INTEREST,
          })}
          role="button"
          tabIndex={0}
          onKeyPress={() => {
            setSidebarSection(EXPLORE_SECTIONS.AREAS_OF_INTEREST);
            logEvent('Explore Menu', 'Clicks tab', EXPLORE_SECTIONS.AREAS_OF_INTEREST);
          }}
          onClick={() => {
            setSidebarSection(EXPLORE_SECTIONS.AREAS_OF_INTEREST);
            logEvent('Explore Menu', 'Clicks tab', EXPLORE_SECTIONS.AREAS_OF_INTEREST);
          }}
        >
          <Icon name={`icon-aoi-${section === EXPLORE_SECTIONS.AREAS_OF_INTEREST ? 'on' : 'off'}`} />
          Areas of Interest
        </div>

        <hr />
        <div
          className={classnames({
            'menu-option': true,
            '-active': section === EXPLORE_SECTIONS.MY_DATA,
          })}
          role="button"
          tabIndex={0}
          data-cy="my-data-tab"
          onKeyPress={() => {
            setSidebarSection(EXPLORE_SECTIONS.MY_DATA);
            logEvent('Explore Menu', 'Clicks tab', EXPLORE_SECTIONS.MY_DATA);
          }}
          onClick={() => {
            setSidebarSection(EXPLORE_SECTIONS.MY_DATA);
            logEvent('Explore Menu', 'Clicks tab', EXPLORE_SECTIONS.MY_DATA);
          }}
        >
          <span className="section-name">My Data</span>
        </div>
        <div
          className={classnames({
            'menu-option': true,
            '-active': section === EXPLORE_SECTIONS.FAVORITES,
          })}
          role="button"
          tabIndex={0}
          onKeyPress={() => {
            setSidebarSection(EXPLORE_SECTIONS.FAVORITES);
            logEvent('Explore Menu', 'Clicks tab', EXPLORE_SECTIONS.FAVORITES);
          }}
          onClick={() => {
            setSidebarSection(EXPLORE_SECTIONS.FAVORITES);
            logEvent('Explore Menu', 'Clicks tab', EXPLORE_SECTIONS.FAVORITES);
          }}
        >
          <span className="collection-name">My Favorites</span>
        </div>
        {userIsLoggedIn && collectionsWithDatasets.map((collection) => (
          <div
            key={collection.id}
            className={classnames({
              'menu-option': true,
              collection: true,
              '-active': section === EXPLORE_SECTIONS.COLLECTIONS && selectedCollection === collection.id,
            })}
            role="button"
            tabIndex={0}
            onKeyPress={() => {
              setSidebarSection(EXPLORE_SECTIONS.COLLECTIONS);
              setSidebarSelectedCollection(collection.id);
              logEvent('Explore Menu', 'Clicks tab', EXPLORE_SECTIONS.COLLECTIONS);
            }}
            onClick={() => {
              setSidebarSection(EXPLORE_SECTIONS.COLLECTIONS);
              setSidebarSelectedCollection(collection.id);
              logEvent('Explore Menu', 'Clicks tab', EXPLORE_SECTIONS.COLLECTIONS);
            }}
          >
            <span className="collection-name">{collection.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

ExploreMenu.defaultProps = {
  token: null,
  selectedCollection: null,
  selectedDataset: null,
};

ExploreMenu.propTypes = {
  token: PropTypes.string,
  open: PropTypes.bool.isRequired,
  tab: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  options: PropTypes.shape({}).isRequired,
  selected: PropTypes.shape({}).isRequired,
  search: PropTypes.string.isRequired,
  sortSelected: PropTypes.string.isRequired,
  shouldAutoUpdateSortDirection: PropTypes.bool.isRequired,
  section: PropTypes.string.isRequired,
  userIsLoggedIn: PropTypes.bool.isRequired,
  selectedCollection: PropTypes.string,
  selectedDataset: PropTypes.string,
  fetchDatasets: PropTypes.func.isRequired,
  setDatasetsPage: PropTypes.func.isRequired,
  setFiltersOpen: PropTypes.func.isRequired,
  setFiltersTab: PropTypes.func.isRequired,
  setFiltersSearch: PropTypes.func.isRequired,
  setFiltersSelected: PropTypes.func.isRequired,
  setSortSelected: PropTypes.func.isRequired,
  setSortDirection: PropTypes.func.isRequired,
  toggleFiltersSelected: PropTypes.func.isRequired,
  resetFiltersSelected: PropTypes.func.isRequired,
  resetFiltersSort: PropTypes.func.isRequired,
  setSidebarSection: PropTypes.func.isRequired,
  setSidebarSelectedCollection: PropTypes.func.isRequired,
};

export default ExploreMenu;
