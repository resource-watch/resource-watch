import React from 'react';
import Button from 'components/ui/Button';
import Page from 'components/app/layout/Page';


class MyRWEditProfile extends React.Component {

  triggerSaveProfile() {

  }

  render() {
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
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

export default MyRWEditProfile;
