import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import Icon from 'components/ui/Icon';

// Tooltip
import Tooltip from 'rc-tooltip/dist/rc-tooltip';
import LegendOpacityTooltip from './legend-item-button-opacity-tooltip';

class LegendItemButtonOpacity extends PureComponent {
  static propTypes = {
    layers: PropTypes.array,
    activeLayer: PropTypes.object,
    visible: PropTypes.bool,

    onChange: PropTypes.func
  }

  render() {
    const { layers, visible, activeLayer } = this.props;

    return (
      <Tooltip
        overlay={
          <LegendOpacityTooltip
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
          className={`opacity ${classnames({ '-disabled': !visible })}`}
          disabled={!visible}
          aria-label="Change opacity"
        >
          <Icon name="icon-opacity" />
        </button>
      </Tooltip>
    );
  }
}

export default LegendItemButtonOpacity;
