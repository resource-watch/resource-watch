import React from 'react';

import FormElement from './FormElement';

class Input extends FormElement {
  /**
   * UI EVENTS
   * - triggerChange
  */
  triggerChange(e) {
    this.setState({ value: e.currentTarget.value }, () => {
      // Trigger validation
      this.triggerValidate();
      // Publish the new value to the form
      if (this.props.onChange) this.props.onChange(this.state.value);
    });
  }

  render() {
    const { properties } = this.props;

    return (
      <input
        {...properties}
        value={this.state.value}
        id={`input-${properties.name}`}
        onChange={this.triggerChange}
      />
    );
  }
}

Input.propTypes = {
  properties: React.PropTypes.object.isRequired,
  validations: React.PropTypes.array,
  onChange: React.PropTypes.func
};

export default Input;
