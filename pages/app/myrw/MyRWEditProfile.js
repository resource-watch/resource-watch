import React from 'react';

import Button from 'components/ui/Button';
import Checkbox from 'components/form/Checkbox';
import Page from 'components/app/layout/Page';
import UserService from 'services/UserService';
import Field from 'components/form/Field';
import Input from 'components/form/Input';


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
      user: {}
    };

    this.userService = new UserService({ apiURL: process.env.CONTROL_TOWER_URL });
  }

  componentWillMount() {
    this.userService.getLoggedUser().then((response) => {
      console.log('get logged user: ', response);
    }).catch((err) => {
      console.log(err);
    });
  }

  triggerSaveProfile() {

  }

  handleFormChange(value) {
    this.setState(Object.assign(this.state, value));
  }

  render() {
    const { user } = this.state;

    return (
      <Page
        title="My Resource Watch Edit Profile"
        description="My Resource Watch Edit Profile description"
      >
        <div className="c-page p-myrw-edit-profile">
          <div className="row">
            <div className="column small-12">
              <div className="title-section">
                <h2>Edit Profile</h2>
                <Button
                  properties={{
                    type: 'button',
                    className: '-primary -end'
                  }}
                  onClick={this.triggerSaveProfile}
                >
                  Save
                </Button>
              </div>
              <fieldset className="c-field-container">
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.name = c; }}
                  onChange={value => this.handleFormChange({ name: value })}
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
                  onChange={value => this.handleFormChange({ email: value })}
                  validations={['required']}
                  properties={{
                    name: 'email',
                    label: 'Email',
                    type: 'email',
                    required: true,
                    default: user.email
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
                    default: user.new_password
                  }}
                >
                  {Input}
                </Field>
              </fieldset>
              <h5>Photo</h5>
              <div className="photo-container">
                Add
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

                    }}
                  >
                    {Checkbox}
                  </Field>
                </div>
                <Button
                  properties={{
                    type: 'button',
                    className: '-primary -end'
                  }}
                  onClick={this.triggerSaveProfile}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

export default MyRWEditProfile;
