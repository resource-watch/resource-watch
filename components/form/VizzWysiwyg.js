import React from 'react';
import PropTypes from 'prop-types';

// Components
import VizzWysiwyg from '@vizzuality/wysiwyg';
import FormElement from './FormElement';

class Wysiwyg extends FormElement {
  constructor(props) {
    super(props);

    if (typeof window === 'undefined') {
      return;
    }

    this.state = {
      id: Date.now(),
      value: this.props.properties.default,
      valid: null,
      error: [],
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
        const stringifiedValue = JSON.stringify(value);
        this.props.onChange(stringifiedValue);
      }
    });
  }

  setValue(value) {
    this.setState({
      id: Date.now(),
      value,
    });
  }

  getValue() {
    const { value } = this.state;
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }

  render() {
    return (
      <VizzWysiwyg
        id={this.state.id}
        items={this.getValue()}
        blocks={this.props.properties.blocks}
        onChange={this.triggerChange}
        onUploadImage={this.props.properties.onUploadImage}
      />
    );
  }
}

Wysiwyg.propTypes = {
  properties: PropTypes.object.isRequired,
  onChange: PropTypes.func,
};

export default Wysiwyg;
