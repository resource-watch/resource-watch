import React from 'react';
import PropTypes from 'prop-types';

// Components
import FormElement from './FormElement';

let Editor
if (typeof window !== 'undefined') {
  Editor = require('react-quill');
  // require all blots
  require('components/wysiwyg/IframeBlot');
}


class Wysiwyg extends FormElement {
  static getValue(html) {
    return html;
  }

  constructor(props) {
    super(props);

    if (typeof window === 'undefined') {
      return;
    }

    this.state = {
      value: Wysiwyg.getValue(this.props.properties.default),
      valid: null,
      error: []
    };
  }

  componentDidMount() {
    this.attachQuillRefs();
  }

  componentDidUpdate() {
    this.attachQuillRefs();
  }

  attachQuillRefs = () => {
    if (typeof this.reactQuillRef.getEditor !== 'function') return;
    this.quill = this.reactQuillRef.getEditor();
  }

  /**
   * UI EVENTS
   * - triggerChange
  */
  triggerChange(value) {
    this.setState({ value }, () => {
      // Validate
      this.triggerValidate();

      if (this.props.onChange) {
        this.props.onChange(value);
      }
    });
  }

  render() {
    const { value } = this.state;

    return (
      <div className="c-wysiwyg">
        <this.props.toolbar.component
          quill={this.quill}
        />

        <Editor
          ref={(c) => { this.reactQuillRef = c; }}
          theme="snow"
          value={value}
          onChange={this.triggerChange}
          modules={{
            toolbar: this.props.toolbar.container
          }}
          // toolbar={this.props.toolbar}
          // toolbarCustomButtons={this.props.toolbarCustomButtons}
        />
      </div>
    );
  }
}

Wysiwyg.propTypes = {
  properties: PropTypes.object.isRequired,
  onChange: PropTypes.func
};

export default Wysiwyg;
