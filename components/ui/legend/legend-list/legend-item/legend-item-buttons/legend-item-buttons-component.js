import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';

// Components
import LegendItemButtonLayers from './legend-item-button-layers';
import LegendItemButtonOpacity from './legend-item-button-opacity';
import LegendItemButtonVisibility from './legend-item-button-visibility';
import LegendItemButtonInfo from './legend-item-button-info';
import LegendItemButtonRemove from './legend-item-button-remove';

class LegendItemButtons extends PureComponent {
  static propTypes = {
    layers: PropTypes.array,
    readonly: PropTypes.bool,

    // FUNC
    onChangeLayer: PropTypes.func,
    onChangeOpacity: PropTypes.func
  }

  /**
   * HELPERS
   * - getTimelineLayers
  */
  getTimelineLayers = () => {
    const { layers } = this.props;

    return sortBy(
      layers.filter(l => l.layerConfig.timeline),
      l => l.layerConfig.order
    );
  }

  render() {
    const { layers, readonly } = this.props;
    const timelineLayers = this.getTimelineLayers();

    return (
      <div className="item-actions">
        {/* MULTILAYER */}
        {!!layers.length && !timelineLayers.length && (
          <LegendItemButtonLayers
            {...this.props}
          />
        )}

        {/* OPACITY */}
        <LegendItemButtonOpacity
          {...this.props}
        />

        {/* VISIBILITY */}
        <LegendItemButtonVisibility
          {...this.props}
        />

        {/* INFO */}
        <LegendItemButtonInfo
          {...this.props}
        />

        {/* CLOSE */}
        {!readonly &&
          <LegendItemButtonRemove
            {...this.props}
          />
        }
      </div>
    );
  }
}

export default LegendItemButtons;
