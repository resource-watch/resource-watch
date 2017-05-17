import React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/github';

import FormElement from './FormElement';


class Code extends FormElement {
  constructor(props) {
    super(props);

    this.state = {
      value: JSON.stringify(this.props.properties.default || {}, null, 2),
      valid: null,
      error: []
    };
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
    return (
      <AceEditor
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
}

Code.propTypes = {
  properties: React.PropTypes.object.isRequired,
  validations: React.PropTypes.array,
  onChange: React.PropTypes.func
};

export default Code;
