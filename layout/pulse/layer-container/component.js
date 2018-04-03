import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Hammer from 'react-hammerjs';

class LayerContainerComponent extends PureComponent {
  handleSwipe() {
    const { layerActive, displayed, setDisplayed } = this.props;
    if (layerActive) {
      setDisplayed(!displayed);
    }
  }

  render() {
    const { displayed, children } = this.props;
    return (
      <Hammer
        onSwipe={() => this.handleSwipe()}
        direction="DIRECTION_VERTICAL"
      >
        <div className={`c-layer-container ${displayed ? '-displayed' : ''}`}>
          {children}
        </div>
      </Hammer>
    );
  }
}

LayerContainerComponent.propTypes = {
  displayed: PropTypes.bool,
  layerActive: PropTypes.object,
  children: PropTypes.node,
  setDisplayed: PropTypes.func
};

export default LayerContainerComponent;
