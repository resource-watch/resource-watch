import React from 'react';
import PropTypes from 'prop-types';

class SwitchOptions extends React.Component {
  constructor(props) {
    super(props);

    // BINDINGS
    this.onChange = this.onChange.bind(this);
    this.onToggle = this.onToggle.bind(this);
  }

  /**
   * UI EVENTS
   * - onChange
   * - onToggle
  */
  onChange(e) {
    // Send object
    const selectedObj = this.props.options.find(option =>
      option.value === e.currentTarget.dataset.value
    );
    this.props.onChange(selectedObj);
  }

  onToggle() {
    // Send object
    const selectedObj = this.props.options.find(option => option.value !== this.props.selected);
    this.props.onChange(selectedObj);
  }

  render() {
    const { selected, options } = this.props;
    const position = (selected === options[0].value) ? '-left' : '-right';

    return (
      <div className="c-switch-options">
        <span
          className={`switch-label ${(selected === options[0].value) ? '-selected' : ''}`}
          data-value={options[0].value}
          onClick={this.onChange}
        >
          {options[0].label}
        </span>

        <span
          className={`switch-element ${position}`}
          onClick={this.onToggle}
        >
          <span />
        </span>

        <span
          className={`switch-label ${(selected === options[1].value) ? '-selected' : ''}`}
          data-value={options[1].value}
          onClick={this.onChange}
        >
          {options[1].label}
        </span>
      </div>
    );
  }
}

SwitchOptions.propTypes = {
  selected: PropTypes.string,
  options: PropTypes.array.isRequired, // It should be an array of 2 elements
  onChange: PropTypes.func
};

export default SwitchOptions;
