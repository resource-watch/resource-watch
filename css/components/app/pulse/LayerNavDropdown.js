import React from 'react';
import Switch from 'components/ui/Switch';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

class LayerNavDropdown extends React.Component {

  constructor(props) {
    super(props);

    this.triggerClick = this.triggerClick.bind(this);
  }

  triggerClick(e) {
    const { id, threedimensional, markertype } = e.currentTarget.dataset;
    this.props.toggleActiveLayer(id, threedimensional, markertype);
  }

  render() {
    const { layerActive, layers } = this.props;
    return (
      <div className="c-layer-nav-dropdown dropdown">
        <ul>
          {layers.map(layer =>
              (<li
                data-id={layer.id}
                data-threedimensional={layer['3d']}
                data-markertype={layer.markerType}
                key={layer.id}
                onClick={this.triggerClick}
              >
                <Switch active={(layerActive && (layerActive.id === layer.id))} />
                <span className="name">
                  {layer.label}
                </span>
              </li>)
          )}
        </ul>
      </div>
    );
  }

}

LayerNavDropdown.propTypes = {
  layers: React.PropTypes.array,
  layerActive: React.PropTypes.object,
  toggleActiveLayer: React.PropTypes.func,
};

export default LayerNavDropdown;
