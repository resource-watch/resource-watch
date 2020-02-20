import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class ExploreDatasetsActionsComponent extends PureComponent {
  static propTypes = {
    dataset: PropTypes.object,
    layer: PropTypes.object,
    layerGroups: PropTypes.array,
    toggleMapLayerGroup: PropTypes.func.isRequired,
    resetMapLayerGroupsInteraction: PropTypes.func.isRequired,
    setSelectedDataset: PropTypes.func.isRequired
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
    const { dataset, layer, setSelectedDataset } = this.props;
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

        <button
          className="c-button -tertiary -compressed"
          onClick={() => setSelectedDataset(dataset.id)}
        >
            Details
        </button>
      </div>
    );
  }
}

export default ExploreDatasetsActionsComponent;
