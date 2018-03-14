import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Next
import { Link } from 'routes';

class ExploreDatasetsActionsComponent extends React.Component {
  static propTypes = {
    dataset: PropTypes.object,
    layer: PropTypes.object,
    layers: PropTypes.array,

    // Actions
    setMapLayers: PropTypes.func
  };

  isActive = () => {
    const { dataset, layers } = this.props;
    return !!layers.find(l => l.dataset === dataset.id);
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
          onClick={() => this.props.setMapLayers(layer)}
        >
          {isActive ? 'Active' : 'Add to map'}
        </button>

        <Link
          route="explore_detail"
          params={{ id: dataset.id }}
        >
          <a className="c-button -tertiary -compressed">
            More info
          </a>
        </Link>
      </div>
    );
  }
}

export default ExploreDatasetsActionsComponent;
