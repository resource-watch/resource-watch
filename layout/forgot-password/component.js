import React, { PureComponent } from 'react';
import { toastr } from 'react-redux-toastr';
import { Link } from 'routes';

// components
import Layout from 'layout/layout/layout-app';
import Field from 'components/form/Field';
import Input from 'components/form/Input';

// services
import UserService from 'services/user';

// constants
import { FORM_ELEMENTS } from './constants';

class ForgotPassword extends PureComponent {
  state ={ email: '' };

  onSubmit = (e) => {
    if (e) e.preventDefault();
    FORM_ELEMENTS.validate();
    const isValid = FORM_ELEMENTS.isValid();
    const { email } = this.state;

    if (!isValid) return;

    setTimeout(() => {
      this.userService.forgotPassword({ email })
        .then(() => {
          toastr.success('Reset password requested', 'Please, check your inbox and follow instructions to reset your password.');
        })
        .catch(({ message }) => { toastr.error('Something went wrong', `${message}`); });
    }, 0);
  }

  userService = new UserService({ apiURL: process.env.CONTROL_TOWER_URL });

  render() {
    const { email } = this.state;

    return (
      <Layout
        title="Resource Watch Sign-in/Register"
        description="Resource Watch Sign-in/Register"
      >
        <div className="l-log-in">
          <div className="l-container">
            <div className="content">
              <div className="log-in-container">
                <div className="wrapper">
                  <div className="column">
                    <h2 className="c-title">Reset your password</h2>
                  </div>
                  <div className="column">
                    <span>To reset your password, type your email address:</span>
                  </div>
                  <div className="column medium-6">
                    <form onSubmit={this.onSubmit}>
                      <Field
                        ref={(c) => { if (c) FORM_ELEMENTS.elements.email = c; }}
                        onChange={value => this.setState({ email: value })}
                        className="-fluid -log-in"
                        validations={['required', 'email']}
                        properties={{
                          name: 'email',
                          label: 'Email',
                          required: true,
                          default: email,
                          placeholder: 'example@resourcewatch.org'
                        }}
                      >
                        {Input}
                      </Field>
                      <div className="c-button-container form-buttons">
                        <ul className="-log-in">
                          <li>
                            <button className="c-button -primary">
                              Reset
                            </button>
                          </li>
                          <li>
                            <Link route="sign-in">
                              <a className="c-button -tertirary">Sign in</a>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default ForgotPassword;
