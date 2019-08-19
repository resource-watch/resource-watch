import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'routes';

class ExploreDatasetsActionsComponent extends PureComponent {
  static propTypes = {
    dataset: PropTypes.object,
    layer: PropTypes.object,
    layerGroups: PropTypes.array,
    toggleMapLayerGroup: PropTypes.func.isRequired,
    resetMapLayerGroupsInteraction: PropTypes.func.isRequired
  };

  isActive = () => {
    const { dataset, layerGroups } = this.props;
    return !!layerGroups.find(l => l.dataset === dataset.id);
  }

  handleToggleLayerGroup = () => {
    const { dataset, toggleMapLayerGroup, resetMapLayerGroupsInteraction } = this.props;
    const isActive = this.isActive();

    toggleMapLayerGroup({ dataset, toggle: !isActive });
    resetMapLayerGroupsInteraction();
  }

  render() {
    const { dataset, layer } = this.props;
    const isActive = this.isActive();

    return (
      <div className="actions">
        <button
          className={classnames({
            'c-button': true,
            '-secondary': !isActive,
            '-primary': isActive,
            '-compressed': true,
            '-disable': !layer
          })}
          disabled={!layer}
          onClick={this.handleToggleLayerGroup}
        >
          {isActive ? 'Remove from map' : 'Add to map'}
        </button>

        <Link
          route="explore_detail"
          params={{ id: dataset.slug }}
        >
          <a className="c-button -tertiary -compressed">
            Details
          </a>
        </Link>
      </div>
    );
  }
}

export default ExploreDatasetsActionsComponent;
