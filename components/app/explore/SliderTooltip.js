import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import debounce from 'lodash/debounce';

// Components
import InputRange from 'react-input-range';


class SliderTooltip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.options.defaultValue
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.onMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onMouseDown);
  }

  @Autobind
  onMouseDown(e) {
    const clickOutside = this.el && this.el.contains && !this.el.contains(e.target);
    if (clickOutside) {
      this.props.onClose();
    }
  }

  @Autobind
  onChangeComplited(value) {
    this.setState({ value });
    this.props.onChange(value);
  }

  render() {
    const { className, options } = this.props;
    const updateValue = debounce(value => this.setState({ value }), 0);

    return (
      <div className="c-explore-slider-tooltip" ref={(node) => { this.el = node; }}>
        <InputRange
          className={className}
          minValue={options.min}
          maxValue={options.max}
          value={this.state.value}
          step={0.01}
          onChange={value => updateValue(value)}
          onChangeComplete={this.props.onChange}
        />
        <div className="actions-container">
          <button className="c-button -primary" onClick={this.props.onClose}>Done</button>
          <button className="c-button" onClick={() => this.onChangeComplited(options.max)}>Reset</button>
        </div>
      </div>
    );
  }
}

SliderTooltip.propTypes = {
  // Layer group
  className: PropTypes.string,
  options: PropTypes.object,
  // Callback to call when the layer changes with
  // the ID of the dataset and the ID of the layer
  onChange: PropTypes.func.isRequired,
  // Callback to close the tooltip
  onClose: PropTypes.func.isRequired
};

SliderTooltip.defaultProps = {
  min: 0,
  max: 1,
  step: 0.01,
  defaultValue: 1
};

export default SliderTooltip;
