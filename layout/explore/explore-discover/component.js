import React from 'react';
import PropTypes from 'prop-types';

// Constants
import { EXPLORE_SECTIONS } from 'layout/explore/constants';

// Styles
import './styles.scss';

function ExploreDiscover(props) {
  const { setSidebarSection } = props;
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

ExploreDiscover.propTypes = { setSidebarSection: PropTypes.func.isRequired };

export default ExploreDiscover;
