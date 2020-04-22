import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import Icon from 'components/ui/icon';
import LoginRequired from 'components/ui/login-required';

// Tooltip
import { Tooltip } from 'vizzuality-components';
import CollectionsPanel from 'components/collections-panel';
import { getTooltipContainer } from 'utils/tooltip';

// helpers
import { belongsToACollection } from 'components/collections-panel/collections-panel-helpers';

// Utils
import { logEvent } from 'utils/analytics';

import './styles.scss';

class ExploreDatasetsActionsComponent extends PureComponent {
  static propTypes = {
    dataset: PropTypes.object.isRequired,
    layer: PropTypes.object.isRequired,
    layerGroups: PropTypes.array.isRequired,
    toggleMapLayerGroup: PropTypes.func.isRequired,
    resetMapLayerGroupsInteraction: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  };

  isActive = () => {
    const { dataset, layerGroups } = this.props;
    return !!layerGroups.find(l => l.dataset === dataset.id);
  }

  handleToggleLayerGroup = (event) => {
    event.stopPropagation();
    const { dataset, toggleMapLayerGroup, resetMapLayerGroupsInteraction } = this.props;
    const isActive = this.isActive();

    toggleMapLayerGroup({ dataset, toggle: !isActive });
    resetMapLayerGroupsInteraction();
  }

  render() {
    const { dataset, layer, user } = this.props;
    const isActive = this.isActive();
    const userIsLoggedIn = user.token;
    const datasetName = dataset && dataset.metadata && dataset.metadata[0] &&
      dataset.metadata[0].info && dataset.metadata[0].info.name;
    
    const isInACollection = belongsToACollection(user, dataset);
    const starIconName = classnames({
      'icon-star-full': isInACollection,
      'icon-star-empty': !isInACollection
    });
    const starIconClass = classnames({
      '-small': true,
      '-filled': isInACollection,
      '-empty': !isInACollection
    });

    return (
      <div className="c-explore-datasets-actions">
        <button
          className={classnames({
            'c-button': true,
            '-secondary': !isActive,
            '-primary': isActive,
            '-compressed': true,
            '-disable': !layer,
            '-fullwidth': true
          })}
          disabled={!layer}
          onClick={this.handleToggleLayerGroup}
        >
          {isActive ? 'Active' : 'Add to map'}
        </button>
        {/* Favorite dataset icon */}
        <LoginRequired
          clickCallback={() => {
            if (!userIsLoggedIn) {
              logEvent('Explore Menu', 'Anonymous user Clicks Star', datasetName);
            }
          }}
        >
          <Tooltip
            overlay={
              <CollectionsPanel
                resource={dataset}
                resourceType="dataset"
                context="Explore Menu"
                onClick={e => e.stopPropagation()}
                onKeyPress={e => e.stopPropagation()}
              />
            }
            overlayClassName="c-rc-tooltip"
            placement="bottomRight"
            trigger="click"
            getTooltipContainer={getTooltipContainer}
            monitorWindowResize
          >
            <button
              className="c-button -secondary -compressed"
              tabIndex={-1}
              onClick={(event) => {
                event.stopPropagation();
                if (userIsLoggedIn) {
                  logEvent('Explore Menu', 'Authenticated user Clicks Star', datasetName);
                }
              }}
            >
              <Icon
                name={starIconName}
                className={starIconClass}
              />
            </button>
          </Tooltip>
        </LoginRequired>
      </div>
    );
  }
}

export default ExploreDatasetsActionsComponent;
