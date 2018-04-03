import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
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
    const classNames = classnames({
      'c-layer-container': true,
      '-displayed': displayed
    });

    return (
      <Hammer
        onSwipe={() => this.handleSwipe()}
        direction="DIRECTION_VERTICAL"
      >
        <div className={classNames}>
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
