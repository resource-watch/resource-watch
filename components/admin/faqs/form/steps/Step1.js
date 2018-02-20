import React from 'react';
import PropTypes from 'prop-types';

// Constants
import { FORM_ELEMENTS } from 'components/admin/faqs/form/constants';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import TextArea from 'components/form/TextArea';
import FileImage from 'components/form/FileImage';
import Select from 'components/form/SelectInput';
import Checkbox from 'components/form/Checkbox';

class Step1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      form: props.form
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ form: nextProps.form });
  }

  render() {
    // Reset FORM_ELEMENTS
    FORM_ELEMENTS.elements = {};

    return (
      <fieldset className="c-field-container">
        {/* QUESTION */}
        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.question = c; }}
          onChange={value => this.props.onChange({ question: value })}
          className="-fluid"
          validations={['required']}
          properties={{
            name: 'question',
            label: 'Question',
            required: true,
            default: this.state.form.question
          }}
        >
          {TextArea}
        </Field>

        {/* QUESTION */}
        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.answer = c; }}
          onChange={value => this.props.onChange({ answer: value })}
          className="-fluid"
          validations={['required']}
          properties={{
            name: 'answer',
            label: 'Answer',
            required: true,
            default: this.state.form.answer
          }}
        >
          {TextArea}
        </Field>
      </fieldset>
    );
  }
}

Step1.propTypes = {
  id: PropTypes.string,
  form: PropTypes.object,
  onChange: PropTypes.func
};

export default Step1;
