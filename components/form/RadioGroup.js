import React from 'react';
import PropTypes from 'prop-types';

// Components
import FormElement from './FormElement';

class RadioGroup extends FormElement {

  constructor(props) {
    super(props);

    this.state = {
      value: props.properties.default
    };
  }

  /**
   * UI EVENTS
   * - onChange
  */
  triggerChange(e) {
    // Set state
    this.setState({
      value: e.currentTarget.value
    }, () => {
      // Trigger validation
      this.triggerValidate();

      if (this.props.onChange) this.props.onChange(this.state.value);
    });
  }

  render() {
    const { properties, options } = this.props;
    const { value } = this.state;

    return (
      <div className={`c-radio-box ${this.props.className}`}>
        {options.map(item => (
          <div key={`${item.value}`} className="c-radio">
            <input
              {...properties}
              type="radio"
              name={name}
              id={`radio-${name}-${item.value}`}
              value={item.value}
              checked={item.value === value}
              onChange={this.triggerChange}
            />
            <label htmlFor={`radio-${name}-${item.value}`}>
              <span />
              {item.label}
            </label>
          </div>
        ))}
      </div>
    );
  }
}

RadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  properties: PropTypes.object.isRequired,
  className: PropTypes.string,
  onChange: PropTypes.func
};

export default RadioGroup;
