import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';

// components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Spinner from 'components/ui/Spinner';

// services
import { loginUser, registerUser } from 'services/user';

// constants
import { FORM_ELEMENTS } from './constants';

// styles
import './styles.scss';

class LoginModal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      captcha: null,
      register: false,
      loading: false,
    };
  }

  onSubmit = (e) => {
    if (e) e.preventDefault();
    FORM_ELEMENTS.validate();
    const isValid = FORM_ELEMENTS.isValid();
    const { setUser, redirect } = this.props;
    const { register, captcha, ...userSettings } = this.state;

    if (captcha === null && register) toastr.error('Please fill the captcha');

    if (!isValid || (captcha === null && register)) return;

    setTimeout(() => {
      // register user
      if (register) {
        this.setState({ loading: true }, () => {
          registerUser(userSettings)
            .then(() => {
              toastr.success('Confirm registration',
                'You will receive an email shortly. Please confirm your registration.');
            })
            .catch(() => { toastr.error('Something went wrong'); })
            .then(() => {
              this.setState({
                loading: false,
                register: false,
              });
            });
        });
      } else {
        // sign-in user
        loginUser(userSettings)
          .then((data) => {
            setUser(data);
            if (redirect) window.location.href = '/myrw';
          })
          .catch((err) => {
            const { status, statusText } = err.response;

            const message = status === 401
              ? 'Your email and password combination is incorrect.'
              : `${status}:${statusText}`;

            toastr.error(message);
          });
      }
    }, 0);
  }

  render() {
    const {
      email,
      password,
      register,
      loading,
    } = this.state;

    return (
      <div className="c-login-modal">
        <div className="content">
          <div className="log-in-container">
            {loading && <Spinner className="-light" isLoading />}
            <div className="row">
              <div className="column small-12">
                <h2 className="c-title">{register ? 'Sign up' : 'Sign in'}</h2>
              </div>
              <div className="column small-12 medium-5">
                <span>Access with your email</span>
                <form onSubmit={this.onSubmit}>
                  <Field
                    ref={(c) => { if (c) FORM_ELEMENTS.elements.email = c; }}
                    onChange={(value) => this.setState({ email: value })}
                    className="-fluid"
                    validations={['required', 'email']}
                    properties={{
                      name: 'email',
                      label: 'Email',
                      required: true,
                      default: email,
                      placeholder: 'example@resourcewatch.org',
                    }}
                  >
                    {Input}
                  </Field>
                  {!register && (
                    <Field
                      ref={(c) => { if (c) FORM_ELEMENTS.elements.password = c; }}
                      onChange={(value) => this.setState({ password: value })}
                      className="-fluid"
                      validations={['required']}
                      properties={{
                        name: 'password',
                        label: 'Password',
                        required: true,
                        default: password,
                        type: 'password',
                        placeholder: '*********',
                      }}
                    >
                      {Input}
                    </Field>
                  )}
                  {!register && (
                    <Link href="/forgot-password">
                      <a className="c-btn -clean forgot-password-link">
                        Have you forgotten your password?
                      </a>
                    </Link>
                  )}

                  {register && (
                    <div className="recaptcha-container">
                      <ReCAPTCHA
                        // https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do
                        sitekey={process.env.NEXT_PUBLIC_RW_ENV === 'test'
                          ? '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' : '6LeBy3YUAAAAACLNnSGCnvok_tRDnQut-Mc7SBh8'}
                        onChange={(value) => { this.setState({ captcha: value }); }}
                      />
                    </div>
                  )}
                  <div className="c-button-container form-buttons">
                    <ul>
                      <li>
                        <button
                          type="submit"
                          className="c-button -primary"
                        >
                          {register ? 'Register' : 'Log in'}
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          data-cy="register-button"
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
              <div className="column small-12 medium-5 medium-offset-2">
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
    );
  }
}

LoginModal.defaultProps = {
  redirect: true,
};

LoginModal.propTypes = {
  redirect: PropTypes.bool,
  setUser: PropTypes.func.isRequired,
};

export default LoginModal;
