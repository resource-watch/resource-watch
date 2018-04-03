import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import Icon from 'components/ui/Icon';

// Tooltip
import { Tooltip } from 'wri-api-components';

// Modal
import Modal from 'components/modal/modal-component';
import LayerInfoModal from 'components/modal/LayerInfoModal';

class LegendItemButtonInfo extends PureComponent {
  static propTypes = {
    activeLayer: PropTypes.object
  }

  state = {
    showInfoModal: false
  }

  render() {
    const { activeLayer } = this.props;
    const { showInfoModal } = this.state;
    return (
      <Tooltip
        overlay="Info"
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
          className="info"
          aria-label="More information"
          onClick={() => this.setState({ showInfoModal: true })}
        >
          <Icon name="icon-info" />

          <Modal
            isOpen={showInfoModal}
            className="-medium"
            onRequestClose={() => this.setState({ showInfoModal: false })}
          >
            <LayerInfoModal
              data={activeLayer}
            />
          </Modal>
        </button>
      </Tooltip>
    );
  }
}

export default LegendItemButtonInfo;
