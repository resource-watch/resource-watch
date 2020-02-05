import React from 'react';
import PropTypes from 'prop-types';
import TetherComponent from 'react-tether';
import classnames from 'classnames';

import { connect } from 'react-redux';
import { setTooltipPosition } from 'redactions/tooltip';

class Tooltip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Horizontal offset of the tooltip's tip from its
      // initial position (center)
      tipOffset: 0
    };

    // Bindings
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  UNSAFE_componentWillReceiveProps({ tooltip }) {
    if (tooltip.follow && tooltip.follow !== this.props.tooltip.follow) {
      document.addEventListener('mousemove', this.onMouseMove);
    }

    const stopFollowing = tooltip.follow === false && tooltip.follow !== this.props.tooltip.follow;
    const isEmpty = !tooltip.opened && tooltip.opened !== this.props.tooltip.opened;

    if (stopFollowing || isEmpty) {
      document.removeEventListener('mousemove', this.onMouseMove);
    }
  }

  componentDidUpdate() {
    requestAnimationFrame(() => this.updateTipPosition());
  }

  onMouseMove({ clientX, clientY }) {
    this.props.setTooltipPosition({ x: window.scrollX + clientX, y: window.scrollY + clientY });
  }

  getContent() {
    return this.props.tooltip.children
      ? (
        <this.props.tooltip.children
          {...this.props.tooltip.childrenProps}
          onResize={() => this.tether && this.tether.position()}
        />
      )
      : null;
  }

  getStyles() {
    const topPos = this.props.tooltip.position.y;
    const bottomPos = this.props.tooltip.position.x;
    if (this.el) {
      // TODO: modify topPos and bottomPos for recalculating toooltip
      // position if it is out of viewport
    }
    return {
      position: 'absolute',
      top: `${topPos}px`,
      left: `${bottomPos}px`,
      width: '1px',
      height: '1px',
      visibility: 'hidden'
    };
  }

  /**
   * Update the horizontal position of the tooltip's tip based
   * on the position of the tooltip i.e. if the tooltip is placed
   * too close to the sides of the screen, the tooltip won't be
   * cut but the tip must be moved
   */
  updateTipPosition() {
    if (!this.el) return;

    // Position of the target dot from the sides of the screen
    const target = {
      left: this.props.tooltip.position.x,
      right: window.innerWidth - this.props.tooltip.position.x
    };

    // Horizontal offset that must be applied to the tooltip's
    // tip when pinned to a side (when the tooltip should be
    // partially hidden on one of its sides but the library
    // prevent it)
    let tipOffset = 0;

    const width = this.el.parentNode.getBoundingClientRect().width;

    if (width / 2 > target.left) {
      tipOffset = target.left - (width / 2);
    } else if (width / 2 > target.right) {
      tipOffset = (width / 2) - target.right;
    }

    if (tipOffset !== this.state.tipOffset) {
      this.setState({ tipOffset });
    }
  }

  render() {
    const direction = this.props.tooltip.direction;
    const className = this.props.tooltip.className;

    const tooltipClasses = classnames({
      'c-tooltip': true,
      '-hidden': !this.props.tooltip.opened,
      '-arrow-top': direction === 'top',
      '-arrow-bottom': direction === 'bottom',
      [className]: !!className
    });

    return (
      <TetherComponent
        ref={(node) => { this.tether = node; }}
        attachment={`${direction} center`}
        targetAttachment="top center"
        constraints={[{
          // Don't change this without making sure the tooltip doesn't
          // disappear in an embedded widget when the cursor is at the
          // top of the iframe or when the tooltip is close to the edges
          // of the screen
          to: 'window',
          // We don't pin at the top or the bottom because the tooltip
          // is either displayed above or below the target
          pin: ['left', 'right']
        }]}
        classes={{ element: tooltipClasses }}
        offset={`${(direction === 'bottom' ? 1 : -1) * 20}px 0`} // The offset is needed for the follow option
      >
        <div
          style={this.getStyles()}
        />
        { this.props.tooltip.opened &&
          <div ref={(node) => { this.el = node; }}>
            {this.getContent()}
            <div className="tip" style={{ left: `calc(50% + (${this.state.tipOffset}px))` }} />
          </div>
        }
      </TetherComponent>
    );
  }
}

Tooltip.propTypes = {
  // STORE
  tooltip: PropTypes.object,
  setTooltipPosition: PropTypes.func
};

const mapStateToProps = ({ tooltip }) => ({ tooltip });

const mapDispatchToProps = { setTooltipPosition };

export default connect(mapStateToProps, mapDispatchToProps)(Tooltip);
