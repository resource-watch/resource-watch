import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// Services
import { fetchDatasets } from 'services/dataset';

// Constants
import { EXPLORE_SECTIONS } from 'layout/explore/constants';

// Components
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
  const [highlightedDatasets, setHighlightedDatasets] = useState({ loading: true, list: [] });
  const { loading, list } = highlightedDatasets;

  useEffect(() => {
    fetchDatasets({
      'page[size]': 4,
      isHighlighted: true,
      includes: 'layer, metadata'
    })
      .then(data => setHighlightedDatasets({ loading: false, list: data }))
      .catch(err => toastr.error('Error loading highlighted datasets', err));
  }, []);

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
        <Spinner isLoading={loading} className="-light -relative" />
        {!loading &&
          <DatasetList
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
      </div>
      <div className="recent-updated discover-section">
        <div className="header">
          <h4>Recent updated</h4>
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
      </div>
      <div className="related-dashboards discover-section">
        <div className="header">
          <h4>Related dashboards</h4>
          {/* <Link/> didn't work for some reason... */}
          <a href="/dashboards" className="header-button">
                        SEE ALL
          </a>
        </div>
      </div>
    </div>
  );
}

ExploreDiscover.propTypes = {
  setSidebarSection: PropTypes.func.isRequired,
  responsive: PropTypes.object.isRequired
};

export default ExploreDiscover;
