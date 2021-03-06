import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// components
import Navigation from 'components/form/Navigation';
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Spinner from 'components/ui/Spinner';
import FileImage from 'components/form/FileImage';

// services
import { uploadPhoto } from 'services/user';
import {
  updateUser,
} from 'services/auth';

export const FORM_ELEMENTS = {
  elements: {},
  validate() {
    const { elements } = this;
    Object.keys(elements).forEach((k) => {
      elements[k].validate();
    });
  },
  isValid() {
    const { elements } = this;
    const valid = Object.keys(elements)
      .map((k) => elements[k].isValid())
      .filter((v) => v !== null)
      .every((element) => element);

    return valid;
  },
};
class Profile extends PureComponent {
  state = {
    user: this.props.user,
    step: 1,
    submitting: false,
    loading: false,
  }

  onSubmit = (event) => {
    event.preventDefault();

    // Validate the form
    FORM_ELEMENTS.validate(this.state.step);

    // Set a timeout due to the setState function of react
    setTimeout(async () => {
      // Validate all the inputs on the current step
      const valid = FORM_ELEMENTS.isValid(this.state.step);

      if (valid) {
        const {
          setUser,
          queryClient,
        } = this.props;
        const { user } = this.state;
        const { token, name, photo } = user;
        const userObj = {
          name,
          photo: photo || '',
        };

        this.setState({
          loading: true,
          submitting: true,
        });

        try {
          const updatedUser = await updateUser(userObj, token);
          setUser(updatedUser);
          queryClient.invalidateQueries('me');
          toastr.success('Profile updated successfully.');
        } catch (e) {
          toastr.error('Something went wrong', 'There was a problem updating your profile.');
        }

        this.setState({
          loading: false,
          submitting: false,
        });
      } else {
        toastr.error('Error', 'Fill all the required fields or correct the invalid values');
      }
    }, 0);
  }

  onChange = (value) => { this.setState({ user: { ...this.state.user, ...value } }); }

  render() {
    const { user, loading } = this.state;
    const {
      name,
      email,
      photo,
    } = user;

    if (loading) {
      return (
        <Spinner
          isLoading
          className="-light"
        />
      );
    }

    return (
      <div className="c-myrw-edit-profile">
        {/* <Spinner isLoading={loading} className="-light" /> */}
        <div className="row">
          <div className="column small-12">
            <form
              className="c-form"
              onSubmit={this.onSubmit}
              noValidate
            >
              <fieldset className="c-field-container">
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.name = c; }}
                  onChange={(value) => this.onChange({ name: value })}
                  validations={['required']}
                  properties={{
                    name: 'name',
                    label: 'Name',
                    type: 'text',
                    required: true,
                    default: name,
                  }}
                >
                  {Input}
                </Field>
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.email = c; }}
                  onChange={(value) => this.onChange({ email: value })}
                  properties={{
                    name: 'email',
                    label: 'Email',
                    type: 'email',
                    required: true,
                    default: email,
                    disabled: true,
                  }}
                >
                  {Input}
                </Field>

                <div className="c-field-row">
                  <div className="row l-row">
                    <div className="column small-12 medium-2">
                      <Field
                        ref={(c) => { if (c) FORM_ELEMENTS.elements.photo = c; }}
                        onChange={(value) => { this.onChange({ photo: value }); }}
                        className="-fluid"
                        mode="url"
                        getUrlImage={(file) => uploadPhoto(file, user)}
                        properties={{
                          name: 'photo',
                          label: 'Photo',
                          placeholder: 'Browse file',
                          default: photo,
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

Profile.propTypes = {
  user: PropTypes.shape({}).isRequired,
  setUser: PropTypes.func.isRequired,
  queryClient: PropTypes.shape({
    invalidateQueries: PropTypes.func.isRequired,
  }).isRequired,
};

export default Profile;
