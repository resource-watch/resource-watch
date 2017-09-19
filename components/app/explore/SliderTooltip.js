import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Components
import Slider from 'rc-slider';

class SliderTooltip extends React.Component {
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

  render() {
    const { className, options } = this.props;

    return (
      <div className="c-explore-slider-tooltip" ref={(node) => { this.el = node; }}>
        <Slider
          className={className}
          min={options.min}
          max={options.max}
          step={options.step}
          defaultValue={options.defaultValue}
          onAfterChange={this.props.onChange}
        />
        <div className="actions-container">
          <button className="c-button -primary" onClick={this.props.onClose}>Done</button>
          <button className="c-button" onClick={() => this.props.onChange(options.max)}>Reset</button>
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
  step: 0.1,
  defaultValue: 1
};

export default SliderTooltip;
