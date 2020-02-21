import React from 'react';
import PropTypes from 'prop-types';

// Styles
import './styles.scss';

function ExploreDetailFooterComponent(props) {
  const { setSidebarAnchor } = props;
  return (
    <div className="c-explore-detail-footer">
      <a
        onClick={() => setSidebarAnchor('overview')}
        onKeyPress={() => setSidebarAnchor('visualization')}
        role="button"
      >
             OVERVIEW
      </a>
      <a
        onClick={() => setSidebarAnchor('layers')}
        onKeyPress={() => setSidebarAnchor('visualization')}
        role="button"
      >
             LAYERS
      </a>
      <a
        onClick={() => setSidebarAnchor('visualization')}
        onKeyPress={() => setSidebarAnchor('visualization')}
        role="button"
      >
             VISUALIZATION
      </a>
      <a
        onClick={() => setSidebarAnchor('further_information')}
        onKeyPress={() => setSidebarAnchor('visualization')}
        role="button"
      >
             FURTHER INFORMATION
      </a>
    </div>
  );
}

ExploreDetailFooterComponent.propTypes = { setSidebarAnchor: PropTypes.func.isRequired };

export default ExploreDetailFooterComponent;
