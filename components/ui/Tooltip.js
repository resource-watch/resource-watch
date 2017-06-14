import React from 'react';
import TetherComponent from 'react-tether';
import { initStore } from 'store';
import withRedux from 'next-redux-wrapper';
import { toggleTooltip, setTooltipPosition } from 'redactions/tooltip';

class Tooltip extends React.Component {

  constructor(props) {
    super(props);

    // Bindings
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  componentWillReceiveProps({ tooltip }) {
    if (tooltip.follow && tooltip.follow !== this.props.tooltip.follow) {
      document.addEventListener('mousemove', this.onMouseMove);
    }
    const stopFollowing = tooltip.follow === false && tooltip.follow !== this.props.tooltip.follow;
    const isEmpty = !tooltip.opened && tooltip.opened !== this.props.tooltip.opened;
    if (stopFollowing || isEmpty) {
      document.removeEventListener('mousemove', this.onMouseMove);
    }
  }

  onMouseMove({ clientX, clientY }) {
    this.props.setTooltipPosition({ x: clientX, y: clientY });
    this.clientX = clientX;
    this.clientY = clientY;
  }

  getContent() {
    return this.props.tooltip.children ?
      <this.props.tooltip.children {...this.props.tooltip.childrenProps} /> : null;
  }

  getStyles() {
    const topPos = this.props.tooltip.position.y;
    const bottomPos = this.props.tooltip.position.x;
    if (this.el) {
      // TODO: modify topPos and bottomPos for recalculating toooltip
      // position if it is out of viewport
    }
    return {
      position: 'fixed',
      top: `${topPos}px`,
      left: `${bottomPos}px`,
      width: '1px',
      height: '1px',
      visibility: 'hidden'
    };
  }

  render() {
    return (
      <TetherComponent
        attachment="bottom center"
        targetAttachment="top center"
        constraints={[{
          to: 'window',
          pin: true
        }]}
        classes={{
          element: `c-tooltip ${this.props.tooltip.opened ? '' : '-hidden'}`
        }}
        offset="10px 0"
      >
        <div
          style={this.getStyles()}
        />
        { this.props.tooltip.opened &&
        <div
          ref={(node) => { this.el = node; }}
        >
          {this.getContent()}
        </div>
        }
      </TetherComponent>
    );
  }
}

Tooltip.propTypes = {
  // STORE
  tooltip: React.PropTypes.object,
  setTooltipPosition: React.PropTypes.func
};

const mapStateToProps = ({ tooltip }) => ({
  tooltip
});

const mapDispatchToProps = dispatch => ({
  toggleTooltip: () => { dispatch(toggleTooltip()); },
  setTooltipPosition: (pos) => { dispatch(setTooltipPosition(pos)); }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Tooltip);
