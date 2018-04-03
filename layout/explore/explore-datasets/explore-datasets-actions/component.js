import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Next
import { Link } from 'routes';

class ExploreDatasetsActionsComponent extends React.Component {
  static propTypes = {
    dataset: PropTypes.object,
    layer: PropTypes.object,
    layerGroups: PropTypes.array,

    // Actions
    toggleMapLayerGroup: PropTypes.func
  };

  isActive = () => {
    const { dataset, layerGroups } = this.props;
    return !!layerGroups.find(l => l.dataset === dataset.id);
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
          onClick={() => this.props.toggleMapLayerGroup({ dataset, toggle: !isActive })}
        >
          {isActive ? 'Remove from map' : 'Add to map'}
        </button>

        <Link
          route="explore_detail"
          params={{ id: dataset.id }}
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
