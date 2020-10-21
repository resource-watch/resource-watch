import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import DatasetSearch from 'components/datasets/search';
import Icon from 'components/ui/icon';

// Utils
import { logEvent } from 'utils/analytics';
import { EXPLORE_SECTIONS } from 'layout/explore/constants';

// Styles
import './styles.scss';

class ExploreMenuComponent extends React.Component {
  onChangeTextSearch = (search) => {
    const {
      resetFiltersSort,
      setSortSelected,
      setSortDirection,
      setSidebarSection,
      sortSelected,
      shouldAutoUpdateSortDirection,
      setFiltersSearch,
    } = this.props;

    if (!search && sortSelected === 'relevance') {
      resetFiltersSort();
    }
    setFiltersSearch(search);
    if (search && shouldAutoUpdateSortDirection) {
      setSortSelected('relevance');
      setSortDirection(-1);
      setSidebarSection(EXPLORE_SECTIONS.ALL_DATA);
    }
    this.fetchDatasets();
    logEvent('Explore Menu', 'search', search);
  }

  onToggleSelected = (payload) => {
    const { section, setSidebarSection, toggleFiltersSelected } = this.props;

    if (section !== EXPLORE_SECTIONS.ALL_DATA) {
      setSidebarSection(EXPLORE_SECTIONS.ALL_DATA);
    }
    toggleFiltersSelected({ tag: payload, tab: 'topics' });
    this.fetchDatasets();
  }

  onChangeSelected = (payload = []) => {
    const {
      tab,
      setFiltersSelected,
    } = this.props;

    setFiltersSelected({ key: tab, list: payload });

    this.fetchDatasets();
    logEvent('Explore Menu', `filter ${tab}`, payload.join(','));
  }

  onResetSelected = () => {
    const {
      resetFiltersSelected,
      sortSelected,
      resetFiltersSort,
    } = this.props;

    resetFiltersSelected();

    if (sortSelected === 'relevance') {
      resetFiltersSort();
    }

    this.fetchDatasets();
    logEvent('Explore Menu', 'Clear filters', 'click');
  }

  fetchDatasets() {
    const {
      setDatasetsPage,
      fetchDatasets,
    } = this.props;

    setDatasetsPage(1);
    fetchDatasets();
  }

  render() {
    const {
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
      collections,
      selectedDataset,
    } = this.props;

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
          onChangeTextSearch={this.onChangeTextSearch}
          onToggleSelected={this.onToggleSelected}
          onChangeSelected={this.onChangeSelected}
          onResetSelected={this.onResetSelected}
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
            <span className="collection-name">Your favorites</span>
          </div>
          {userIsLoggedIn && collections.map((collection) => (
            <div
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
  }
}

ExploreMenuComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  tab: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  selected: PropTypes.shape({}).isRequired,
  search: PropTypes.string.isRequired,
  sortSelected: PropTypes.string.isRequired,
  shouldAutoUpdateSortDirection: PropTypes.bool.isRequired,
  section: PropTypes.string.isRequired,
  collections: PropTypes.arrayOf(
    PropTypes.shape({}).isRequired,
  ).isRequired,
  userIsLoggedIn: PropTypes.bool.isRequired,
  selectedCollection: PropTypes.string.isRequired,
  selectedDataset: PropTypes.string.isRequired,
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

export default ExploreMenuComponent;
