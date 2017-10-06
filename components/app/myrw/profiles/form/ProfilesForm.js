import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { Autobind } from 'es-decorators';

// Redux
import { connect } from 'react-redux';

// Components
import Button from 'components/ui/Button';
import Checkbox from 'components/form/Checkbox';
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Spinner from 'components/ui/Spinner';

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
  triggerSaveProfile() {
    const { user } = this.state;
    const userObj = { name: user.name, photo: user.photo || '' };

    this.setState({ loading: true });

    this.userService.updateUser(userObj, user.token)
      .then(() => {
        this.setState({
          loading: false
        });
      })
      .catch((err) => {
        toastr.error('There was a problem updating your user data');
        this.setState({ loading: false });
        console.error(err);
      });
  }

  handleFormChange(value) {
    this.setState(Object.assign(this.state.user, value));
  }

  render() {
    const { user, loading } = this.state;

    return (
      <div className="c-myrw-edit-profile">
        <Spinner isLoading={loading} className="-light" />
        <div className="row">
          <div className="column small-12">
            <fieldset className="c-field-container">
              <Field
                ref={(c) => { if (c) FORM_ELEMENTS.elements.name = c; }}
                onChange={value => this.handleFormChange({ name: value })}
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
                onChange={value => this.handleFormChange({ email: value })}
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
              <Field
                ref={(c) => { if (c) FORM_ELEMENTS.elements.new_password = c; }}
                onChange={value => this.handleFormChange({ new_password: value })}
                properties={{
                  name: 'new_password',
                  label: 'Change password',
                  type: 'password',
                  default: user.new_password,
                  disabled: true
                }}
              >
                {Input}
              </Field>
            </fieldset>
            <div className="photo-section">
              <h5>Photo</h5>
              <div className="photo-container">
                Add
              </div>
            </div>
            <div className="bottom-section">
              <div className="delete-account-checkbox">
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.wri_funded = c; }}
                  onChange={value => this.changeMetadata({ deleteAccount: value.checked })}
                  properties={{
                    name: 'delete_account',
                    label: 'Delete account',
                    checked: false,
                    disabled: true
                  }}
                >
                  {Checkbox}
                </Field>
              </div>
              <Button
                properties={{
                  type: 'button',
                  className: '-a -end'
                }}
                onClick={this.triggerSaveProfile}
              >
                Save
              </Button>
            </div>
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
