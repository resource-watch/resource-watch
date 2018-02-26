import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import Icon from 'components/ui/Icon';

// Tooltip
import Tooltip from 'rc-tooltip/dist/rc-tooltip';

class LegendItemButtonVisibility extends PureComponent {
  static propTypes = {
    activeLayer: PropTypes.object,
    visible: PropTypes.bool,
    onChangeVisibility: PropTypes.func
  }

  render() {
    const { activeLayer, visible } = this.props;

    return (
      <Tooltip
        overlay="Visibility"
        overlayClassName="c-rc-tooltip -default"
        overlayStyle={{
          color: '#fff'
        }}
        placement="top"
        trigger="hover"
        mouseLeaveDelay={0}
        destroyTooltipOnHide
      >
        <button
          type="button"
          className="toggle"
          onClick={() => this.props.onChangeVisibility(activeLayer, !visible)}
          aria-label="Toggle the visibility"
        >
          <Icon name={visible ? 'icon-hide' : 'icon-show'} />
        </button>
      </Tooltip>
    );
  }
}

export default LegendItemButtonVisibility;
