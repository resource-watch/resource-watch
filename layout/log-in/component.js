import React, { PureComponent } from 'react';
import { toastr } from 'react-redux-toastr';

// components
import Layout from 'layout/layout/layout-app';
import Field from 'components/form/Field';
import Input from 'components/form/Input';

// services
import UserService from 'services/UserService';

// constants
import { FORM_ELEMENTS } from './constants';

class Login extends PureComponent {
  state ={
    email: '',
    password: '',
    repeatPassword: '',
    register: false
  };

  onSubmit = (e) => {
    if (e) e.preventDefault();
    FORM_ELEMENTS.validate();
    const isValid = FORM_ELEMENTS.isValid();
    const { register, ...userSettings } = this.state;

    if (!isValid) return;

    setTimeout(() => {
      // register user
      if (register) {
        this.userService.registerUser(userSettings)
          .then(() => toastr.success('Confirm registration', 'You will receieve an email shortly. Please confirm your registration.'))
          .catch(err => toastr.error('Something went wrong', err));
      } else {
        // log-in user
        this.userService.loginUser(userSettings)
          .catch(err => toastr.error('Something went wrong', err));
      }
    }, 0);
  }

  userService = new UserService({ apiURL: process.env.CONTROL_TOWER_URL });

  render() {
    const {
      email,
      password,
      repeatPassword,
      register
    } = this.state;

    return (
      <Layout
        title="Resource Watch Sign-in/Register"
        description="Resource Watch Sign-in/Register"
      >
        <div className="l-log-in-layout">
          <div className="l-container">
            <div className="content">
              <div className="log-in-container">
                <div className="wrapper">
                  <div className="row">
                    <div className="column small-12">
                      <h2 className="c-title">{register ? 'Sign up' : 'Log-in'}</h2>
                    </div>
                    <div className="column small-12 medium-5">
                      <span>Access with your email</span>
                      <form onSubmit={this.onSubmit}>
                        <Field
                          ref={(c) => { if (c) FORM_ELEMENTS.elements.email = c; }}
                          onChange={value => this.setState({ email: value })}
                          className="-fluid"
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
                        <Field
                          ref={(c) => { if (c) FORM_ELEMENTS.elements.password = c; }}
                          onChange={value => this.setState({ password: value })}
                          className="-fluid"
                          validations={['required']}
                          properties={{
                            name: 'password',
                            label: 'Password',
                            required: true,
                            default: password,
                            type: 'password',
                            placeholder: '*********'
                          }}
                        >
                          {Input}
                        </Field>

                        {register &&
                          <Field
                            ref={(c) => { if (c) FORM_ELEMENTS.elements.repeatPassword = c; }}
                            onChange={value => this.setState({ repeatPassword: value })}
                            className="-fluid"
                            validations={['required', {
                              type: 'equal',
                              data: password,
                              condition: 'Passwords don\'t match'
                            }]}
                            properties={{
                              name: 'repeat-password',
                              label: 'Repeat Password',
                              required: true,
                              default: repeatPassword,
                              type: 'password',
                              placeholder: '*********'
                            }}
                          >
                            {Input}
                          </Field>}

                        <div className="c-button-container form-buttons">
                          <ul>
                            <li>
                              <button className="c-button -primary">
                                {register ? 'Register' : 'Log in'}
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="c-button -tertirary"
                                onClick={() => { this.setState({ register: !register }); }}
                              >
                                {!register ? 'Register' : 'I have an account'}
                              </button>
                            </li>
                          </ul>
                        </div>
                      </form>
                    </div>
                    <div className="column small-12 medium-5 large-offset-2">
                      <span className="social-media-intro">...or with your social media account</span>
                      <ul className="social-btn-list">
                        <li className="social-btn-item">
                          <a
                            href="/auth/google"
                            className="c-button -google -fullwidth"
                          >
                            Google
                          </a>
                        </li>
                        <li className="social-btn-item">
                          <a
                            href="/auth/facebook"
                            className="c-button -facebook -fullwidth"
                          >
                            facebook
                          </a>
                        </li>
                        <li className="social-btn-item">
                          <a
                            href="/auth/twitter"
                            className="c-button -twitter -fullwidth"
                          >
                            Twitter
                          </a>
                        </li>
                      </ul>
                    </div>
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

export default Login;
