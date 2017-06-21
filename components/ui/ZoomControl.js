import React from 'react';
import Icon from 'components/ui/Icon';

class ZoomControl extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      className: props.className
    };

    // BINDINGS
    this.triggerZoomIn = this.triggerZoomIn.bind(this);
    this.triggerZoomOut = this.triggerZoomOut.bind(this);
  }

  triggerZoomIn() {
    const newValue = this.state.value + 1;
    // if (newValue <= this.props.maxValue) {
    this.setState({ value: newValue });
    this.props.onZoomIn(newValue);
    // }
  }

  triggerZoomOut() {
    const newValue = this.state.value - 1;
    // if (newValue >= this.props.minValue) {
    this.setState({ value: newValue });
    this.props.onZoomOut(newValue);
    // }
  }

  render() {
    const { className, onZoomIn, onZoomOut } = this.props;

    return (
      <div
        className={`c-zoom-control btn-group ${className || ''}`}
      >
        <button onClick={(onZoomIn) ? this.triggerZoomIn : null}>
          <Icon className="-tiny" name="icon-plus" />
        </button>
        <button onClick={(onZoomOut) ? this.triggerZoomOut : null} >
          <Icon className="-tiny" name="icon-minus" />
        </button>
      </div>
    );
  }
}

ZoomControl.propTypes = {
  // maxValue: React.PropTypes.number,
  // minValue: React.PropTypes.number,
  value: React.PropTypes.number,
  className: React.PropTypes.string,

  // ACTIONS
  onZoomIn: React.PropTypes.func,
  onZoomOut: React.PropTypes.func
};

ZoomControl.defaultProps = {
  // maxValue: 10,
  // minValue: 0,
  value: 0
};

export default ZoomControl;
