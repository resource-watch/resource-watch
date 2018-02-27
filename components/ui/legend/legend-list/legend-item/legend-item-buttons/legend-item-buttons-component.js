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
    interaction: PropTypes.bool,

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
    const { layers, readonly, interaction } = this.props;
    const timelineLayers = this.getTimelineLayers();

    return (
      <div className="item-actions">
        {/* MULTILAYER */}
        {layers.length > 1 && !timelineLayers.length && !readonly && (
          <LegendItemButtonLayers
            {...this.props}
          />
        )}

        {/* OPACITY */}
        {!readonly &&
          <LegendItemButtonOpacity
            {...this.props}
          />
        }

        {/* VISIBILITY */}
        {!readonly &&
          <LegendItemButtonVisibility
            {...this.props}
          />
        }

        {interaction &&
          <LegendItemButtonInfo
            {...this.props}
          />
        }

        {/* INFO */}

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
