import React from 'react';
import PropTypes from 'prop-types';

import FormElement from './FormElement';

class TextArea extends FormElement {
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
      <textarea
        {...properties}
        value={this.state.value}
        id={`input-${properties.name}`}
        onChange={this.triggerChange}
      />
    );
  }
}

TextArea.propTypes = {
  properties: PropTypes.object.isRequired,
  validations: PropTypes.array,
  onChange: PropTypes.func
};

export default TextArea;
