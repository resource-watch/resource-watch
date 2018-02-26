import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import Icon from 'components/ui/Icon';

import LegendItemButtonLayers from './legend-item-button-layers';
import LegendItemButtonOpacity from './legend-item-button-opacity';

class LegendItemButtons extends PureComponent {
  static propTypes = {
    layers: PropTypes.array,
    activeLayer: PropTypes.object,

    // FUNC
    onChangeLayer: PropTypes.func,
    onChangeOpacity: PropTypes.func
  }

  render() {
    const { layers, activeLayer } = this.props;

    return (
      <div className="item-actions">
        {/* MULTILAYER */}
        {layers.length > 1 && (
          <LegendItemButtonLayers
            {...this.props}
            onChange={this.props.onChangeLayer}
          />
        )}

        {/* OPACITY */}
        <LegendItemButtonOpacity
          {...this.props}
          onChange={this.props.onChangeOpacity}
        />

        {/* VISIBILITY */}
        <button
          type="button"
          className="toggle"
          onClick={() => this.onToggleLayerGroupVisibility(activeLayer)}
          aria-label="Toggle the visibility"
        >
          <Icon name={activeLayer.visible ? 'icon-hide' : 'icon-show'} />
        </button>

        {/* INFO */}
        <button
          type="button"
          className="info"
          onClick={() => this.onLayerInfoModal(activeLayer)}
          aria-label="More information"
        >
          <Icon name="icon-info" />
        </button>

        {/* CLOSE */}
        <button
          type="button"
          className="close"
          onClick={() => this.onRemoveLayerGroup(activeLayer)}
          aria-label="Remove"
        >
          <Icon name="icon-cross" />
        </button>
      </div>
    );
  }
}

export default LegendItemButtons;
