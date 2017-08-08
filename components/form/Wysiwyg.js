import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

// Components
import FormElement from './FormElement';

let Editor;
if (typeof window !== 'undefined') {
  /* eslint-disable */
  AceEditor = require('react-draft-wysiwyg').Editor;
  /* eslint-enable */
}

class Code extends FormElement {
  constructor(props) {
    super(props);

    this.state = {
      value: JSON.stringify(this.props.properties.default || {}, null, 2),
      valid: null,
      error: []
    };
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (!isEqual(nextProps.properties.value, JSON.parse(this.state.value))) {
        this.setState({
          value: JSON.stringify(nextProps.properties.value || {}, null, 2)
        });
      }
    } catch (e) {
      // do nothing
    }
  }

  /**
   * UI EVENTS
   * - triggerChange
  */
  triggerChange(value) {
    this.setState({ value }, () => {
      try {
        // Trigger validation
        this.triggerValidate();
        // Publish the new value to the form
        const parsedValue = JSON.parse(value);
        if (this.props.onChange) this.props.onChange(parsedValue);
      } catch (err) {
        // console.error(err);
      }
    });
  }

  render() {
    if (typeof window !== 'undefined') {
      return (
        <Editor />
      );
    }

    return null;
  }
}

Code.propTypes = {
  properties: PropTypes.object.isRequired,
  validations: PropTypes.array,
  onChange: PropTypes.func
};

export default Code;
