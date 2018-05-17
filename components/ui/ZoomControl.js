import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/ui/Icon';

class ZoomControl extends React.Component {
  static propTypes = {
    // maxValue: PropTypes.number,
    // minValue: PropTypes.number,
    value: PropTypes.number,
    className: PropTypes.string,

    // ACTIONS
    onZoomIn: PropTypes.func,
    onZoomOut: PropTypes.func
  };

  static defaultProps = {
    // maxValue: 10,
    // minValue: 0,
    value: 0
  };

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
          <Icon className="-small" name="icon-plus" />
        </button>
        <button onClick={(onZoomOut) ? this.triggerZoomOut : null} >
          <Icon className="-small" name="icon-minus" />
        </button>
      </div>
    );
  }
}

export default ZoomControl;
