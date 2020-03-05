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
  static propTypes = {
    open: PropTypes.bool,
    tab: PropTypes.string,
    tags: PropTypes.array,
    options: PropTypes.object,
    selected: PropTypes.object,
    search: PropTypes.string,
    sortSelected: PropTypes.string,
    shouldAutoUpdateSortDirection: PropTypes.bool,
    section: PropTypes.string.isRequired,

    // ACTIONS
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
    setSidebarSection: PropTypes.func.isRequired
  }

  onChangeSearch = (search) => {
    if (search.length === 0 && this.props.sortSelected === 'relevance') {
      this.props.resetFiltersSort();
    }
    this.props.setFiltersSearch(search);
    if (search.length > 0 && this.props.shouldAutoUpdateSortDirection) {
      this.props.setSortSelected('relevance');
      this.props.setSortDirection(-1);
    }
    this.fetchDatasets();
    logEvent('Explore Menu', 'search', search);
  }

  onToggleSelected = (payload) => {
    this.props.toggleFiltersSelected(payload);
    this.fetchDatasets();
  }

  onChangeSelected = (payload = []) => {
    const { tab } = this.props;

    this.props.setFiltersSelected({ key: tab, list: payload });

    this.fetchDatasets();
    logEvent('Explore Menu', `filter ${tab}`, payload.join(','));
  }

  onResetSelected = () => {
    this.props.resetFiltersSelected();
    if (this.props.sortSelected === 'relevance') {
      this.props.resetFiltersSort();
    }
    this.fetchDatasets();
    logEvent('Explore Menu', 'Clear filters', 'click');
  }

  fetchDatasets() {
    this.props.setDatasetsPage(1);
    this.props.fetchDatasets();
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
      collections
    } = this.props;

    return (
      <div className="c-explore-menu" >

        <DatasetSearch
          open={open}
          tab={tab}
          list={tags}
          search={search}
          options={options}
          selected={selected}
          onChangeOpen={this.props.setFiltersOpen}
          onChangeTab={this.props.setFiltersTab}
          onChangeSearch={this.onChangeSearch}
          onToggleSelected={this.onToggleSelected}
          onChangeSelected={this.onChangeSelected}
          onResetSelected={this.onResetSelected}
        />

        <div className="menu-options">
          <div
            className={classnames({
                'menu-option': true,
                '-active': section === EXPLORE_SECTIONS.DISCOVER
              })}
            role="button"
            tabIndex={0}
            onKeyPress={() => setSidebarSection(EXPLORE_SECTIONS.DISCOVER)}
            onClick={() => setSidebarSection(EXPLORE_SECTIONS.DISCOVER)}
          >
            <Icon name={`icon-discover-${section === EXPLORE_SECTIONS.DISCOVER ? 'on' : 'off'}`} />
            Discover
          </div>
          <div
            className={classnames({
                'menu-option': true,
                '-active': section === EXPLORE_SECTIONS.ALL_DATA
              })}
            role="button"
            tabIndex={0}
            onKeyPress={() => setSidebarSection(EXPLORE_SECTIONS.ALL_DATA)}
            onClick={() => setSidebarSection(EXPLORE_SECTIONS.ALL_DATA)}
          >
            <Icon name={`icon-all-${section === EXPLORE_SECTIONS.ALL_DATA ? 'on' : 'off'}`} />
            All data
          </div>
          <div
            className={classnames({
                'menu-option': true,
                '-active': section === EXPLORE_SECTIONS.NEAR_REAL_TIME
              })}
            role="button"
            tabIndex={0}
            onKeyPress={() => setSidebarSection(EXPLORE_SECTIONS.NEAR_REAL_TIME)}
            onClick={() => setSidebarSection(EXPLORE_SECTIONS.NEAR_REAL_TIME)}
          >
            <Icon name={`icon-recent-${section === EXPLORE_SECTIONS.NEAR_REAL_TIME ? 'on' : 'off'}`} />
            Near Real-Time
          </div>
          <div
            className={classnames({
                'menu-option': true,
                '-active': section === EXPLORE_SECTIONS.TOPICS
              })}
            role="button"
            tabIndex={0}
            onKeyPress={() => setSidebarSection(EXPLORE_SECTIONS.TOPICS)}
            onClick={() => setSidebarSection(EXPLORE_SECTIONS.TOPICS)}
          >
            <Icon name={`icon-topics-${section === EXPLORE_SECTIONS.TOPICS ? 'on' : 'off'}`} />
            Topics
          </div>

          <hr />

          {collections.map(collection => (
            <div
              className={classnames({
                'menu-option': true,
                collection: true,
                '-active': section === EXPLORE_SECTIONS.COLLECTIONS && selectedCollection === collection.id
                })}
              role="button"
              tabIndex={0}
              onKeyPress={() => {
                setSidebarSection(EXPLORE_SECTIONS.COLLECTIONS);
                setSidebarSelectedCollection(collection.id);
              }}
              onClick={() => {
                setSidebarSection(EXPLORE_SECTIONS.COLLECTIONS);
                setSidebarSelectedCollection(collection.id);
              }}
            >
              <span className="collection-name">{collection.name}</span>
            </div>
          ))}
        </div>
      </div >
    );
  }
}

export default ExploreMenuComponent;
