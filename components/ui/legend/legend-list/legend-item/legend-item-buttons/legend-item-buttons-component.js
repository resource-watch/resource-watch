import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import Icon from 'components/ui/Icon';

import LegendItemButtonLayers from './legend-item-button-layers';
import LegendItemButtonOpacity from './legend-item-button-opacity';
import LegendItemButtonVisibility from './legend-item-button-visibility';
import LegendItemButtonInfo from './legend-item-button-info';
import LegendItemButtonRemove from './legend-item-button-remove';

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
        <LegendItemButtonRemove
          {...this.props}
        />
      </div>
    );
  }
}

export default LegendItemButtons;
