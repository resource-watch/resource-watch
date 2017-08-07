import React from 'react';
import PropTypes from 'prop-types';

// Components
import FormElement from './FormElement';

let AceEditor;
if (typeof window !== 'undefined') {
  /* eslint-disable */
  require('brace');
  require('brace/mode/json');
  require('brace/theme/github');
  AceEditor = require('react-ace').default;
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
    if (nextProps.properties.value) {
      this.setState({
        value: JSON.stringify(nextProps.properties.value || {}, null, 2)
      });
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
        <AceEditor
          name={this.props.properties.name}
          mode="json"
          theme="github"
          value={this.state.value}
          tabSize={2}
          width="100%"
          wrapEnabled
          showPrintMargin={false}
          editorProps={{ $blockScrolling: true }}
          onChange={this.triggerChange}
        />
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
