import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// Constants
import { EXPLORE_SECTIONS } from 'layout/explore/constants';
import { TOPICS } from 'layout/explore/explore-topics/constants';

// Services
import { fetchRWConfig } from 'services/config';
import { fetchDatasets } from 'services/dataset';

// Components
import TopicsList from 'layout/explore/explore-topics/list';
import Spinner from 'components/ui/Spinner';

// Responsive
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';

// Explore components
import DatasetList from 'layout/explore/explore-datasets/list';
import ExploreDatasetsActions from 'layout/explore/explore-datasets/explore-datasets-actions';

// Styles
import './styles.scss';

function ExploreDiscover(props) {
  const { setSidebarSection, responsive } = props;
  const [config, setConfig] = useState({ relatedTopics: [] });
  const [highlightedDatasets, setHighlightedDatasets] = useState({ loading: true, list: [] });
  const [recentUpdatedDatasets, setRecentUpdatedDatasets] = useState({ loading: true, list: [] });
  const [recentlyAddedDatasets, setRecentlyAddedDatasets] = useState({ loading: true, list: [] });

  useEffect(() => {
    const tempConfig = fetchRWConfig();
    setConfig(tempConfig);

    // ---- Highlighted datasets ----
    fetchDatasets({
      'page[size]': 4,
      'applicationConfig.rw.highlighted': 'true',
      includes: 'layer,metadata,widget'
    })
      .then(data => setHighlightedDatasets({ loading: false, list: data }))
      .catch(err => toastr.error('Error loading highlighted datasets', err));

    // ----- Recently updated datasets -------
    fetchDatasets({
      'page[size]': 4,
      sort: '-dataLastUpdated',
      includes: 'layer,metadata,widget',
      'concepts[0][0]': 'near_real_time'
    })
      .then(data => setRecentUpdatedDatasets({ loading: false, list: data }))
      .catch(err => toastr.error('Error loading recently updated datasets', err));

    // ----- Recently added datasets --------
    fetchDatasets({
      'page[size]': 4,
      sort: '-createdAt',
      includes: 'layer,metadata,widget'
    })
      .then(data => setRecentlyAddedDatasets({ loading: false, list: data }))
      .catch(err => toastr.error('Error loading recently added datasets', err));
  }, []);

  const { relatedTopics } = config;

  return (
    <div className="c-explore-discover">
      <div className="trending-datasets discover-section">
        <div className="header">
          <h4>Trending datasets</h4>
          <div
            className="header-button"
            role="button"
            tabIndex={-1}
            onClick={() => setSidebarSection(EXPLORE_SECTIONS.ALL_DATA)}
            onKeyPress={() => setSidebarSection(EXPLORE_SECTIONS.ALL_DATA)}
          >
                        SEE ALL DATA
          </div>
        </div>
        <Spinner isLoading={highlightedDatasets.loading} className="-light -relative" />
        {!highlightedDatasets.loading &&
          <DatasetList
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
        }
      </div>
      <div className="related-topics discover-section">
        <div className="header">
          <h4>Related topics</h4>
          <div
            className="header-button"
            role="button"
            tabIndex={-1}
            onClick={() => setSidebarSection(EXPLORE_SECTIONS.TOPICS)}
            onKeyPress={() => setSidebarSection(EXPLORE_SECTIONS.TOPICS)}
          >
                        SEE ALL
          </div>
        </div>
        {relatedTopics.length > 0 &&
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
          <h4>Recently added datasets</h4>
          <div
            className="header-button"
            role="button"
            tabIndex={-1}
            onClick={() => setSidebarSection(EXPLORE_SECTIONS.ALL_DATA)}
            onKeyPress={() => setSidebarSection(EXPLORE_SECTIONS.ALL_DATA)}
          >
                        SEE ALL DATA
          </div>
        </div>
        <Spinner isLoading={recentlyAddedDatasets.loading} className="-light -relative" />
        {!recentlyAddedDatasets.loading &&
          <DatasetList
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
        }
      </div>
      <div className="recent-updated discover-section">
        <div className="header">
          <h4>Recent updated datasets</h4>
          <div
            className="header-button"
            role="button"
            tabIndex={-1}
            onClick={() => setSidebarSection(EXPLORE_SECTIONS.NEAR_REAL_TIME)}
            onKeyPress={() => setSidebarSection(EXPLORE_SECTIONS.NEAR_REAL_TIME)}
          >
                        SEE ALL DATA
          </div>
        </div>
        <Spinner isLoading={recentUpdatedDatasets.loading} className="-light -relative" />
        {!recentUpdatedDatasets.loading &&
          <DatasetList
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
        }
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
  responsive: PropTypes.object.isRequired
};

export default ExploreDiscover;
