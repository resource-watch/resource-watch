import { useState, useCallback } from 'react';

// components
import CardPlaceholder from 'components/card-placeholder';
import Field from 'components/form/Field';
import Input from 'components/form/Input';

// hooks
import { useMe } from 'hooks/user';

// constants
import { PARDOT_FORM_HANDLER } from 'constants/app';

const MyDataComingSoon = (): JSX.Element => {
  const { data: user } = useMe();
  const [form, setForm] = useState({
    email: user?.email || '',
  });

  const onChangeEmail = useCallback(
    (value: typeof form.email) => {
      setForm({
        ...form,
        ...{ email: value },
      });
    },
    [form],
  );

  return (
    <div className="c-explore-my-data-coming-soon">
      <CardPlaceholder />
      <div className="card-coming-soon">
        <h4>
          Would you like to see your data on&nbsp;
          <br />
          Resource Watch?
        </h4>
        <p>
          We are exploring ways to let you bring your data to the platform. Would you use this
          feature? Let us know.
        </p>

        <form
          id="my-data-sign-up"
          className="c-form my-data-form"
          // ! Pardot doesn't support submitting data to form handlers via Ajax requests:
          // ! https://help.salesforce.com/s/articleView?id=pardot_considerations_for_using_form_handlers.htm&type=5&language=en_US
          action={PARDOT_FORM_HANDLER}
        >
          <Field
            validations={['required', 'email']}
            className="-fluid"
            onChange={onChangeEmail}
            properties={{
              name: 'email',
              label: 'Email',
              type: 'email',
              default: form.email,
              placeholder: 'Your email address',
              disabled: !!user?.email,
              required: true,
            }}
          >
            {Input}
          </Field>
          {/* pardot honeypot field – anti-spam protection */}
          <Field
            className="-pi-hidden"
            properties={{
              name: 'pi_extra_field',
              label: 'Comments',
              type: 'text',
              required: false,
            }}
          >
            {Input}
          </Field>
          <button type="submit" className="c-button -primary -compressed">
            I&apos;m interested
          </button>
        </form>
      </div>
      <CardPlaceholder />
      <CardPlaceholder />
    </div>
  );
};

export default MyDataComingSoon;
