import React from 'react';
import PropTypes from 'prop-types';

// Utils
import { logEvent } from 'utils/analytics';

// Styles
import './styles.scss';

function ExploreDetailFooterComponent(props) {
  const {
    setSidebarAnchor,
    showVizualizationLink
  } = props;

  return (
    <div className="c-explore-detail-footer">
      <a
        onClick={() => {
          setSidebarAnchor('overview');
          logEvent('Explore (Detail)', 'Clicks to Scroll', 'Overview');
        }}
        onKeyPress={() => {
          setSidebarAnchor('overview');
          logEvent('Explore (Detail)', 'Clicks to Scroll', 'Overview');
        }}
        role="button"
        tabIndex={0}
      >
             OVERVIEW
      </a>
      <a
        onClick={() => {
          setSidebarAnchor('layers');
          logEvent('Explore (Detail)', 'Clicks to Scroll', 'Layers');
        }}
        onKeyPress={() => {
          setSidebarAnchor('layers');
          logEvent('Explore (Detail)', 'Clicks to Scroll', 'Layers');
        }}
        role="button"
        tabIndex={0}
      >
             LAYERS
      </a>
      {showVizualizationLink &&
        <a
          onClick={() => {
            setSidebarAnchor('visualization');
            logEvent('Explore (Detail)', 'Clicks to Scroll', 'Visualization');
          }}
          onKeyPress={() => {
            setSidebarAnchor('visualization');
            logEvent('Explore (Detail)', 'Clicks to Scroll', 'Visualization');
          }}
          role="button"
          tabIndex={0}
        >
              VISUALIZATION
        </a>
      }
      <a
        onClick={() => {
          setSidebarAnchor('further_information');
          logEvent('Explore (Detail)', 'Clicks to Scroll', 'Further information');
        }}
        onKeyPress={() => {
          setSidebarAnchor('further_information');
          logEvent('Explore (Detail)', 'Clicks to Scroll', 'Further information');
        }}
        role="button"
        tabIndex={0}
      >
             FURTHER INFORMATION
      </a>
    </div>
  );
}

ExploreDetailFooterComponent.propTypes = { 
  setSidebarAnchor: PropTypes.func.isRequired,
  showVizualizationLink: PropTypes.bool
};

ExploreDetailFooterComponent.defaultProps = { 
  showVizualizationLink: true
};

export default ExploreDetailFooterComponent;
