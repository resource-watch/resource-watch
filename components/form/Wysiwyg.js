import React from 'react';
import PropTypes from 'prop-types';

// Components
import FormElement from './FormElement';

let Editor
if (typeof window !== 'undefined') {
  Editor = require('react-quill');
  // require all blots
  require('components/wysiwyg/IframeBlot');
  require('components/wysiwyg/WidgetLayoutBlot');
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
      error: [],
      isQuillRef: false
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

    if (!this.state.isQuillRef) {
      this.setState({ isQuillRef: true });
    }
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
        {this.props.toolbar &&
          <this.props.toolbar.component
            quill={this.quill}
          />
        }

        <Editor
          ref={(c) => { this.reactQuillRef = c; }}
          theme="snow"
          value={value}
          onChange={this.triggerChange}
          modules={{
            ...!!this.props.toolbar && { toolbar: this.props.toolbar.container }
          }}
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
