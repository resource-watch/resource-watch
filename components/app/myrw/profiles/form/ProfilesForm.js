import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { Autobind } from 'es-decorators';

// Redux
import { connect } from 'react-redux';

// Components
import Navigation from 'components/form/Navigation';
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Spinner from 'components/ui/Spinner';
import FileImage from 'components/form/FileImage';

// Services
import UserService from 'services/UserService';

export const FORM_ELEMENTS = {
  elements: {
  },
  validate() {
    const elements = this.elements;
    Object.keys(elements).forEach((k) => {
      elements[k].validate();
    });
  },
  isValid() {
    const elements = this.elements;
    const valid = Object.keys(elements)
      .map(k => elements[k].isValid())
      .filter(v => v !== null)
      .every(element => element);

    return valid;
  }
};


class MyRWEditProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user,
      step: 1,
      stepLength: 1,
      submitting: false,
      loading: true
    };

    // User service
    this.userService = new UserService({ apiURL: process.env.CONTROL_TOWER_URL });
  }

  componentDidMount() {
    this.userService.getLoggedUser(this.props.user.token)
      .then((response) => {
        this.setState({
          loading: false,
          user: Object.assign(this.state.user, response)
        });
      })
      .catch(err => console.error(err));
  }

  @Autobind
  onSubmit(event) {
    event.preventDefault();

    // Validate the form
    FORM_ELEMENTS.validate(this.state.step);

    // Set a timeout due to the setState function of react
    setTimeout(() => {
      // Validate all the inputs on the current step
      const valid = FORM_ELEMENTS.isValid(this.state.step);

      if (valid) {
        const { user } = this.state;
        const userObj = { name: user.name, photo: user.photo || '' };

        this.setState({ loading: true, submitting: true });

        this.userService.updateUser(userObj, user.token)
          .then(() => {
            // Needs to be improved by the API
            window.location = '/login';
          })
          .catch((err) => {
            toastr.error('There was a problem updating your user data');
            this.setState({ loading: false, submitting: false });
            console.error(err);
          });
      } else {
        toastr.error('Error', 'Fill all the required fields or correct the invalid values');
      }
    }, 0);
  }

  triggerFormChange(value) {
    this.setState(Object.assign(this.state.user, value));
  }

  render() {
    const { user, loading } = this.state;

    return (
      <div className="c-myrw-edit-profile">
        <Spinner isLoading={loading} className="-light" />
        <div className="row">
          <div className="column small-12">
            <form className="c-form" onSubmit={this.onSubmit} noValidate>
              <fieldset className="c-field-container">
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.name = c; }}
                  onChange={value => this.triggerFormChange({ name: value })}
                  validations={['required']}
                  properties={{
                    name: 'name',
                    label: 'Name',
                    type: 'text',
                    required: true,
                    default: user.name
                  }}
                >
                  {Input}
                </Field>
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.email = c; }}
                  onChange={value => this.triggerFormChange({ email: value })}
                  properties={{
                    name: 'email',
                    label: 'Email',
                    type: 'email',
                    required: true,
                    default: user.email,
                    disabled: true
                  }}
                >
                  {Input}
                </Field>

                <div className="c-field-row">
                  <div className="row l-row">
                    <div className="column small-12 medium-2">
                      <Field
                        ref={(c) => { if (c) FORM_ELEMENTS.elements.photo = c; }}
                        onChange={(value) => {
                          this.triggerFormChange({ photo: value });
                        }}
                        className="-fluid"
                        mode="url"
                        getUrlImage={file => this.userService.uploadPhoto(file, user)}
                        properties={{
                          name: 'photo',
                          label: 'Photo',
                          placeholder: 'Browse file',
                          baseUrl: process.env.STATIC_SERVER_URL,
                          default: this.state.user.photo
                        }}
                      >
                        {FileImage}
                      </Field>
                    </div>
                  </div>
                </div>
              </fieldset>

              <Navigation
                step={this.state.step}
                stepLength={this.state.step}
                submitting={this.state.submitting}
                hideCancel
                onStepChange={this.triggerSaveProfile}
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

MyRWEditProfile.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(MyRWEditProfile);
