import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import Icon from 'components/ui/Icon';

// Tooltip
import Tooltip from 'rc-tooltip/dist/rc-tooltip';

class LegendItemButtonRemove extends PureComponent {
  static propTypes = {
    activeLayer: PropTypes.object,

    // ACTIONS
    onRemoveLayer: PropTypes.func
  }

  render() {
    const { activeLayer } = this.props;

    return (
      <Tooltip
        overlay="Remove"
        overlayClassName="c-rc-tooltip -default"
        overlayStyle={{
          color: '#fff'
        }}
        placement="top"
        trigger={['hover', 'click']}
        mouseLeaveDelay={0}
        destroyTooltipOnHide
      >
        <button
          type="button"
          className="close"
          onClick={() => this.props.onRemoveLayer(activeLayer)}
          aria-label="Remove"
        >
          <Icon name="icon-cross" />
        </button>
      </Tooltip>
    );
  }
}

export default LegendItemButtonRemove;
