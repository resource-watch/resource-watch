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
        onKeyPress={() => setSidebarAnchor('overview')}
        role="button"
        tabIndex={0}
      >
             OVERVIEW
      </a>
      <a
        onClick={() => setSidebarAnchor('layers')}
        onKeyPress={() => setSidebarAnchor('layers')}
        role="button"
        tabIndex={0}
      >
             LAYERS
      </a>
      <a
        onClick={() => setSidebarAnchor('visualization')}
        onKeyPress={() => setSidebarAnchor('visualization')}
        role="button"
        tabIndex={0}
      >
             VISUALIZATION
      </a>
      <a
        onClick={() => setSidebarAnchor('further_information')}
        onKeyPress={() => setSidebarAnchor('further_information')}
        role="button"
        tabIndex={0}
      >
             FURTHER INFORMATION
      </a>
    </div>
  );
}

ExploreDetailFooterComponent.propTypes = { setSidebarAnchor: PropTypes.func.isRequired };

export default ExploreDetailFooterComponent;
