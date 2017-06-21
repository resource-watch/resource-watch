import React from 'react';
import Button from 'components/ui/Button';
import Checkbox from 'components/form/Checkbox';
import Page from 'components/app/layout/Page';
import UserService from 'services/UserService';


class MyRWEditProfile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      user: null
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
              <div className="bottom-section">
                <Checkbox
                  properties={{
                    name: 'delete_account',
                    label: 'Delete account',
                    checked: false
                  }}
                />
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
