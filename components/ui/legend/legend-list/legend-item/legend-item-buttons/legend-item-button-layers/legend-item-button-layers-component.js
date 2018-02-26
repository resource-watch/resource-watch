import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import Icon from 'components/ui/Icon';

// Tooltip
import Tooltip from 'rc-tooltip/dist/rc-tooltip';
import LegendLayersTooltip from './legend-item-button-layers-tooltip';

class LegendItemButtonLayers extends PureComponent {
  static propTypes = {
    layers: PropTypes.array,
    activeLayer: PropTypes.object,

    onChange: PropTypes.func
  }

  render() {
    const { layers, activeLayer } = this.props;

    return (
      <Tooltip
        overlay={
          <LegendLayersTooltip
            layers={layers}
            activeLayer={activeLayer}
            onChange={this.props.onChange}
          />
        }
        overlayClassName="c-rc-tooltip -default"
        overlayStyle={{
          color: '#fff'
        }}
        placement="top"
        trigger="click"
      >
        <button
          type="button"
          className="layers"
          aria-label="Select other layer"
        >
          <Icon name="icon-layers" />
        </button>
      </Tooltip>
    );
  }
}

export default LegendItemButtonLayers;
