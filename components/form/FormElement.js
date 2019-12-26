import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';

import Validator from './Validator';

class FormElement extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // NOTE: Please add a default value such as ''
      // otherwise React will throw a warning
      value: this.props.properties.default || '',
      valid: null,
      error: []
    };

    // VALIDATOR
    this.validator = new Validator();

    // BINDINGS
    this.triggerChange = this.triggerChange.bind(this);
    this.triggerValidate = this.triggerValidate.bind(this);
  }

  componentDidMount() {
    if (this.state.value && this.state.value.length) {
      this.triggerValidate();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const hasValue = Object.prototype.hasOwnProperty.call(nextProps.properties, 'value');
    const isNew = nextProps.properties.value !== this.state.value;
    if (hasValue && isNew) {
      this.setState({ value: nextProps.properties.value }, () => {
        this.triggerValidate();
      });
    }
  }

  componentDidUpdate(prevProps) {
    const prevPropsParsed = pick(prevProps, ['properties', 'validations']);
    const currentPropsParsed = pick(this.props, ['properties', 'validations']);

    if (!isEqual(prevPropsParsed, currentPropsParsed)) {
      this.triggerValidate();
    }
  }


  triggerValidate() {
    const { validations: validationsProps } = this.props;
    const { validations: validationsState, value } = this.state;

    const validations = validationsState || validationsProps;

    const isValuePresent = (Array.isArray(value)) ? value.length > 0 : value;
    let valid;
    let error;

    // Check if it has validations &&
    //       if a value is defined ||
    //       if required validation is present
    if (validations && (isValuePresent || validations.indexOf('required') !== -1)) {
      const validateArr = this.validator.validate(validations, value);
      valid = validateArr.every(element => element.valid);
      error = (!valid) ? validateArr.map(element => element.error) : [];
    } else {
      valid = (isValuePresent) ? true : null;
      error = [];
    }

    // Save the valid and the error in the state
    this.setState({
      valid,
      error
    }, () => {
      if (this.props.onValid) this.props.onValid(valid, error);
    });
  }

  isValid() {
    return this.state.valid;
  }
}

FormElement.propTypes = {
  properties: PropTypes.object.isRequired,
  validations: PropTypes.array,
  onValid: PropTypes.func
};

export default FormElement;
