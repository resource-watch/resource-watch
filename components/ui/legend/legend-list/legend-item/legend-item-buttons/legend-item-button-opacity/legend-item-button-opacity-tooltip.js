import React from 'react';
import PropTypes from 'prop-types';

// Components
import Slider from 'rc-slider/lib/Slider';

class LegendOpacityTooltip extends React.Component {
  static propTypes = {
    // Layers
    activeLayer: PropTypes.object.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    // Callback to call when the layer changes with
    // the ID of the dataset and the ID of the layer
    onChangeOpacity: PropTypes.func.isRequired
  };

  static defaultProps = {
    min: 0,
    max: 1,
    step: 0.01
  }

  state = {
    value: this.props.activeLayer.opacity || 1
  }

  onChange = (v) => {
    const { activeLayer } = this.props;

    this.setState({ value: v });
    this.props.onChangeOpacity(activeLayer, v);
  }

  render() {
    const {
      min, max, step
    } = this.props;

    const {
      value
    } = this.state;

    return (
      <div className="c-explore-slider-tooltip" ref={(node) => { this.el = node; }}>
        <h4>
          Opacity
        </h4>

        <div className="slider-tooltip-container">
          <Slider
            min={min}
            max={max}
            step={step}
            value={value}
            defaultValue={value}
            onChange={this.onChange}
            onAfterChange={this.onChange}
          />
        </div>

        {/* <div className="slider-tooltip-actions">
          <button
            className="c-button -secondary -compressed"
            onClick={() => this.onChange(max)}
          >
            Reset
          </button>
        </div> */}
      </div>
    );
  }
}

export default LegendOpacityTooltip;
