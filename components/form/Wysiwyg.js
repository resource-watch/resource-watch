import React from 'react';
import PropTypes from 'prop-types';

import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

// Components
import FormElement from './FormElement';

class Wysiwyg extends FormElement {

  static getValue(html) {
    const draft = htmlToDraft(html);

    if (html) {
      const contentState = ContentState.createFromBlockArray(draft.contentBlocks);
      return EditorState.createWithContent(contentState);
    }

    return '';
  }

  constructor(props) {
    super(props);

    this.state = {
      value: Wysiwyg.getValue(this.props.properties.default),
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
      // Validate
      this.triggerValidate();

      if (this.props.onChange) {
        const content = this.state.value.getCurrentContent();
        this.props.onChange(draftToHtml(convertToRaw(content)));
      }
    });
  }

  render() {
    const { value } = this.state;
    return (
      <Editor
        editorState={value}
        toolbar={this.props.toolbar}
        onEditorStateChange={this.triggerChange}
      />
    );
  }
}

Wysiwyg.propTypes = {
  properties: PropTypes.object.isRequired,
  onChange: PropTypes.func
};

export default Wysiwyg;
