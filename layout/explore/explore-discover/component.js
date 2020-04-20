import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import classnames from 'classnames';

// Constants
import { EXPLORE_SECTIONS } from 'layout/explore/constants';
import { TOPICS } from 'layout/explore/explore-topics/constants';

// Services
import { fetchExploreConfig } from 'services/config';
import { fetchDatasets } from 'services/dataset';

// Components
import TopicsList from 'layout/explore/explore-topics/list';

// Responsive
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';

// Explore components
import DatasetList from 'layout/explore/explore-datasets/list';
import ExploreDatasetsActions from 'layout/explore/explore-datasets/explore-datasets-actions';

// Utils
import { logEvent } from 'utils/analytics';

// Styles
import './styles.scss';

function ExploreDiscover(props) {
  const {
    setSidebarSection,
    responsive,
    selectedDataset,
    setSortSelected,
    setSortIsUserSelected
  } = props;
  const [config, setConfig] = useState(null);
  const [highlightedDatasets, setHighlightedDatasets] = useState({ loading: true, list: [] });
  const [recentUpdatedDatasets, setRecentUpdatedDatasets] = useState({ loading: true, list: [] });
  const [recentlyAddedDatasets, setRecentlyAddedDatasets] = useState({ loading: true, list: [] });

  useEffect(() => {
    fetchExploreConfig()
      .then((result) => {
        setConfig(result);

        // ---- Highlighted datasets ----
        fetchDatasets({
          'page[size]': 4,
          published: true,
          'applicationConfig.rw.highlighted': 'true',
          includes: 'layer,metadata,widget'
        })
          .then(data => setHighlightedDatasets({ loading: false, list: data }))
          .catch(err => toastr.error('Error loading highlighted datasets', err));

        // ----- Recently updated datasets -------
        fetchDatasets({
          'page[size]': 4,
          published: true,
          sort: '-dataLastUpdated',
          includes: 'layer,metadata,widget',
          'concepts[0][0]': 'near_real_time'
        })
          .then(data => setRecentUpdatedDatasets({ loading: false, list: data }))
          .catch(err => toastr.error('Error loading recently updated datasets', err));

        // ----- Recently added datasets --------
        fetchDatasets({
          'page[size]': 4,
          published: true,
          sort: '-createdAt',
          includes: 'layer,metadata,widget'
        })
          .then(data => setRecentlyAddedDatasets({ loading: false, list: data }))
          .catch(err => toastr.error('Error loading recently added datasets', err));
      })
      .catch(error => toastr.error('Error loading Explore configuration', error));
  }, []);

  const relatedTopics = config && config.explore.discover['related-topics'];

  return (
    <div className={classnames({
        'c-explore-discover': true,
        '-hidden': selectedDataset
      })}
    >
      <div className="trending-datasets discover-section">
        <div className="header">
          <h4>{config && config.explore.discover.subtitles['highlighted-datasets']}</h4>
          <div
            className="header-button"
            role="button"
            tabIndex={-1}
            onClick={() => {
              setSidebarSection(EXPLORE_SECTIONS.ALL_DATA);
              logEvent('Explore Menu', 'Click to See All Data', 'Highlighted datasets');
            }}
            onKeyPress={() => {
              setSidebarSection(EXPLORE_SECTIONS.ALL_DATA);
              logEvent('Explore Menu', 'Click to See All Data', 'Highlighted datasets');
            }}
          >
                        SEE ALL DATA
          </div>
        </div>
        <DatasetList
          loading={highlightedDatasets.loading}
          numberOfPlaceholders={4}
          list={highlightedDatasets.list}
          actions={
            <MediaQuery
              minDeviceWidth={breakpoints.medium}
              values={{ deviceWidth: responsive.fakeWidth }}
            >
              <ExploreDatasetsActions />
            </MediaQuery>
          }
        />
      </div>
      <div className="related-topics discover-section">
        <div className="header">
          <h4>{config && config.explore.discover.subtitles['related-topics']}</h4>
          <div
            className="header-button"
            role="button"
            tabIndex={-1}
            onClick={() => {
              setSidebarSection(EXPLORE_SECTIONS.TOPICS);
              logEvent('Explore Menu', 'Click to See All Topics');
            }}
            onKeyPress={() => {
              setSidebarSection(EXPLORE_SECTIONS.TOPICS);
              logEvent('Explore Menu', 'Click to See All Topics');
            }}
          >
                        SEE ALL
          </div>
        </div>
        {relatedTopics && relatedTopics.length > 0 &&
          <TopicsList
            topics={TOPICS.filter(t => relatedTopics.find(rT => rT === t.id))}
            onClick={(id) => {
              props.setFiltersSearch('');
              props.resetFiltersSort();
              props.setFiltersSelected({ key: 'topics', list: [id] });
              props.setDatasetsPage(1);
              props.fetchDatasets();
              props.setSidebarSection(EXPLORE_SECTIONS.ALL_DATA);
            }}
          />
        }
      </div>
      <div className="recently-added discover-section">
        <div className="header">
          <h4>{config && config.explore.discover.subtitles['recently-added-datasets']}</h4>
          <div
            className="header-button"
            role="button"
            tabIndex={-1}
            onClick={() => {
              setSidebarSection(EXPLORE_SECTIONS.ALL_DATA);
              setSortSelected('createdAt');
              setSortIsUserSelected();
              props.fetchDatasets();
              logEvent('Explore Menu', 'Click to See All Data', 'Recently Added Datasets');
            }}
            onKeyPress={() => {
              setSidebarSection(EXPLORE_SECTIONS.ALL_DATA);
              setSortSelected('createdAt');
              setSortIsUserSelected();
              props.fetchDatasets();
              logEvent('Explore Menu', 'Click to See All Data', 'Recently Added Datasets');
            }}
          >
                        SEE ALL DATA
          </div>
        </div>
        <DatasetList
          loading={recentlyAddedDatasets.loading}
          numberOfPlaceholders={4}
          list={recentlyAddedDatasets.list}
          actions={
            <MediaQuery
              minDeviceWidth={breakpoints.medium}
              values={{ deviceWidth: responsive.fakeWidth }}
            >
              <ExploreDatasetsActions />
            </MediaQuery>
          }
        />
      </div>
      <div className="recent-updated discover-section">
        <div className="header">
          <h4>{config && config.explore.discover.subtitles['recently-updated-datasets']}</h4>
          <div
            className="header-button"
            role="button"
            tabIndex={-1}
            onClick={() => {
              setSidebarSection(EXPLORE_SECTIONS.NEAR_REAL_TIME);
              logEvent('Explore Menu', 'Click to See All Data', 'Recently Updated Datasets');
            }}
            onKeyPress={() => {
              setSidebarSection(EXPLORE_SECTIONS.NEAR_REAL_TIME);
              logEvent('Explore Menu', 'Click to See All Data', 'Recently Updated Datasets');
            }}
          >
                        SEE ALL DATA
          </div>
        </div>
        <DatasetList
          loading={recentUpdatedDatasets.loading}
          numberOfPlaceholders={4}
          list={recentUpdatedDatasets.list}
          actions={
            <MediaQuery
              minDeviceWidth={breakpoints.medium}
              values={{ deviceWidth: responsive.fakeWidth }}
            >
              <ExploreDatasetsActions />
            </MediaQuery>
          }
        />
      </div>
    </div>
  );
}

ExploreDiscover.propTypes = {
  setSidebarSection: PropTypes.func.isRequired,
  setFiltersSearch: PropTypes.func.isRequired,
  resetFiltersSort: PropTypes.func.isRequired,
  setDatasetsPage: PropTypes.func.isRequired,
  fetchDatasets: PropTypes.func.isRequired,
  setFiltersSelected: PropTypes.func.isRequired,
  setSortSelected: PropTypes.func.isRequired,
  setSortIsUserSelected: PropTypes.func.isRequired,
  responsive: PropTypes.object.isRequired,
  selectedDataset: PropTypes.string.isRequired
};

export default ExploreDiscover;
