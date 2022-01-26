import {
  useState,
  useCallback,
} from 'react';

// components
import CardPlaceholder from 'components/card-placeholder';
import Field from 'components/form/Field';
import Input from 'components/form/Input';

// hooks
import {
  useMe,
} from 'hooks/user';

// utils
import { logEvent } from 'utils/analytics';

export default function MyDataComingSoon() {
  const {
    data: user,
  } = useMe();
  const [form, setForm] = useState({
    email: user?.email || '',
  });

  const onSubmit = useCallback(async () => {
    logEvent('Explore Menu', 'My Data', 'clicks on "I\'m interested" button');
  }, []);

  const onChangeEmail = useCallback((value) => {
    setForm({
      ...form,
      ...{ email: value },
    });
  }, [form]);

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
          We are exploring ways to let you bring your data to the platform.
          Would you use this feature? Let us know.
        </p>

        <form
          id="my-data-sign-up"
          className="c-form my-data-form"
          // Pardot doesn't support submitting data to form handlers via Ajax requests.
          action="https://connect.wri.org/l/120942/2021-06-01/53bndz"
          onSubmit={onSubmit}
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

          { /* pardot honeypot field – anti-spam protection */}
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
          <button
            type="submit"
            className="c-button -primary -compressed"
          >
            I’m interested
          </button>
        </form>
      </div>
      <CardPlaceholder />
      <CardPlaceholder />
    </div>
  );
}
