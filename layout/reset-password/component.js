import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// components
import Layout from 'layout/layout/layout-app';
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Spinner from 'components/ui/Spinner';

// services
import UserService from 'services/UserService';

// constants
import { FORM_ELEMENTS, TOKEN_ERROR_MESSAGE } from './constants';

class ResetPassword extends PureComponent {
  static propTypes = { tokenEmail: PropTypes.string }

  static defaultProps = { tokenEmail: null }

  state ={
    password: '',
    repeatPassword: '',
    saving: false
  };

  componentDidMount() {
    const { tokenEmail } = this.props;

    if (!tokenEmail) toastr.error(TOKEN_ERROR_MESSAGE);
  }

  onSubmit = (e) => {
    if (e) e.preventDefault();
    FORM_ELEMENTS.validate();
    const isValid = FORM_ELEMENTS.isValid();
    const { tokenEmail } = this.props;
    const { password, repeatPassword } = this.state;

    if (!isValid) return;

    if (!tokenEmail) toastr.error(TOKEN_ERROR_MESSAGE);

    setTimeout(() => {
      this.setState({ saving: true }, () => {
        this.userService.resetPassword(tokenEmail, { password, repeatPassword })
          .then(() => {
            this.setState({ saving: false });
          })
          .catch((err) => {
            this.setState({ saving: false });
            err.json()
              .then(({ errors } = {}) => {
                (errors || []).forEach(_error => toastr.error('Something went wrong', `${_error.status}:${_error.detail}`));
              });
          });
      });
    }, 0);
  }

  userService = new UserService({ apiURL: process.env.CONTROL_TOWER_URL });

  render() {
    const {
      password,
      repeatPassword,
      saving
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
                      <h2 className="c-title">Reset Password</h2>
                    </div>
                    <div className="column small-12 medium-5">
                      <span>Type your new password:</span>
                      <form onSubmit={this.onSubmit}>
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
                        {!saving && (
                          <div className="c-button-container form-buttons">
                            <ul>
                              <li>
                                <button className="c-button -primary">
                                  Save and login
                                </button>
                              </li>
                            </ul>
                          </div>)}
                        {saving && (
                          <div style={{ position: 'relative', padding: 20 }}>
                            <Spinner isLoading className="-transparent" />
                          </div>)}
                      </form>
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

export default ResetPassword;
