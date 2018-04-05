import React, { PureComponent } from 'react';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Select from 'components/form/SelectInput';

// Constants
import { FORM_COUNTRIES } from './constants';

class NewsletterModalComponent extends PureComponent {

  render() {
    return (
      <div className="c-newsletter-modal">
        <h3>Sign up for the Resource Watch newsletter</h3>
        <p>Get the latest stoires on the data that powers your world.</p>
        <form
          className="c-form"
          accept-charset="UTF-8"
          method="post"
          action="https://go.pardot.com/l/120942/2018-01-25/3nzl13"
          id="pardot-form"
        >
          <Field
            validations={['required']}
            className="-fluid"
            properties={{
              name: 'first_name',
              label: 'First name',
              type: 'text',
              required: true
            }}
          >
            {Input}
          </Field>
          <Field
            validations={['required']}
            className="-fluid"
            properties={{
              name: 'last_name',
              label: 'Last name',
              type: 'text',
              required: true
            }}
          >
            {Input}
          </Field>
          <Field
            validations={['required', 'email']}
            className="-fluid"
            properties={{
              name: 'email',
              label: 'Email',
              type: 'email',
              required: true
            }}
          >
            {Input}
          </Field>
          <Field
            validations={['required']}
            className="-fluid"
            properties={{
              name: 'company',
              label: 'Company',
              type: 'text',
              required: true
            }}
          >
            {Input}
          </Field>
          <Field
            className="-fluid"
            properties={{
              name: 'job_title',
              label: 'Job title',
              type: 'text',
              required: false
            }}
          >
            {Input}
          </Field>
          <Field
            validations={['required']}
            className="-fluid"
            properties={{
              name: 'city',
              label: 'City',
              type: 'text',
              required: true
            }}
          >
            {Input}
          </Field>
          <Field
            validations={['required']}
            className="-fluid"
            options={FORM_COUNTRIES.options}
            properties={{
              name: 'country',
              label: 'Country',
              type: 'text',
              required: true
            }}
          >
            {Select}
          </Field>
          { /* pardot honeypot field */ }
          <Field
            className="-pi-hidden"
            properties={{
              name: 'pi_extra_field',
              label: 'Comments',
              type: 'text',
              required: false
            }}
          >
            {Input}
          </Field>

          <div className="actions-container -align-right">
            <button type="submit" className="c-btn -primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default NewsletterModalComponent;
