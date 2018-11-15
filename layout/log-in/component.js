import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { Link } from 'routes';
import ReCAPTCHA from 'react-google-recaptcha';

// components
import Layout from 'layout/layout/layout-app';
import Field from 'components/form/Field';
import Input from 'components/form/Input';

// services
import UserService from 'services/UserService';

// constants
import { FORM_ELEMENTS } from './constants';

class Login extends PureComponent {
  static propTypes = { setUser: PropTypes.func.isRequired }

  state ={
    email: '',
    password: '',
    repeatPassword: '',
    captcha: null,
    register: false
  };

  onSubmit = (e) => {
    if (e) e.preventDefault();
    FORM_ELEMENTS.validate();
    const isValid = FORM_ELEMENTS.isValid();
    const { setUser } = this.props;
    const { register, captcha, ...userSettings } = this.state;

    if (captcha === null && register) toastr.error('Please fill the captcha');

    if (!isValid || (captcha === null && register)) return;

    setTimeout(() => {
      // register user
      if (register) {
        this.userService.registerUser(userSettings)
          .then(() => {
            toastr.success('Confirm registration', 'You will receive an email shortly. Please confirm your registration.');
          })
          .catch(() => { toastr.error('Something went wrong'); });
      } else {
        // sign-in user
        this.userService.loginUser(userSettings)
          .then(({ data }) => {
            setUser(data);
            // redirects the user to /myrw once logged-in
            window.location.href = '/myrw';
          })
          .catch((err) => {
            err.json()
              .then(({ errors } = {}) => {
                (errors || []).forEach(_error => toastr.error('Something went wrong', `${_error.status}:${_error.detail}`));
              });
          });
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
                      <h2 className="c-title">{register ? 'Sign up' : 'Sign in'}</h2>
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
                        {!register && (
                          <Link to="forgot-password">
                            <a className="forgot-password-link">Have you forgotten your password?</a>
                          </Link>)}

                        {register &&
                          <Fragment>
                            <Field
                              ref={(c) => { if (c) FORM_ELEMENTS.elements.repeatPassword = c; }}
                              onChange={(value) => { this.setState({ repeatPassword: value }); }}
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
                            </Field>
                            <div className="recaptcha-container">
                              <ReCAPTCHA
                                sitekey="6LeBy3YUAAAAACLNnSGCnvok_tRDnQut-Mc7SBh8"
                                onChange={(value) => { this.setState({ captcha: value }); }}
                              />
                            </div>
                          </Fragment>
                        }
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
                    <div className="column small-12 medium-6 large-5 medium-offset-1 large-offset-2">
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
