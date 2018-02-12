import React from 'react';

// Services
import { toastr } from 'react-redux-toastr';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import TextArea from 'components/form/TextArea';

// Constants
import { FORM_ELEMENTS, STATE_DEFAULT } from './constants';


class ContactUsForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, STATE_DEFAULT, {
      form: STATE_DEFAULT.form
    });
  }

  /**
   * UI EVENTS
   * - onSubmit
   * - onChange
  */
  onSubmit = (event) => {
    event.preventDefault();

    // Validate the form
    FORM_ELEMENTS.validate(this.state.form);

    // Set a timeout due to the setState function of react
    setTimeout(() => {
      const valid = FORM_ELEMENTS.isValid(this.state.form);

      if (valid) {
        toastr.success('Success', 'Your message has been sent!');
      } else {
        toastr.error('Error', 'Fill all the required fields or correct the invalid values');
      }
    }, 0);
  }

  onChange(obj) {
    const form = Object.assign({}, this.state.form, obj);
    this.setState({ form });
  }

  render() {
    return (
      <div className="c-contact-us">
        <form className="c-form" onSubmit={this.onSubmit} noValidate>
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.email = c; }}
            onChange={value => this.onChange({ email: value })}
            validations={['required']}
            className="-fluid"
            properties={{
              name: 'email',
              label: 'Email',
              type: 'email',
              required: true,
              default: this.state.form.email
            }}
          >
            {Input}
          </Field>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.message = c; }}
            onChange={value => this.onChange({ message: value })}
            className="-fluid"
            properties={{
              name: 'message',
              label: 'Message',
              default: this.state.form.message
            }}
          >
            {TextArea}
          </Field>

          <div className="actions-container -align-right">
            <button type="submit" className="c-btn -primary">
                Send
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default ContactUsForm;
