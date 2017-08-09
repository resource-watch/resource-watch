import React from 'react';
import { StickyContainer, Sticky } from 'react-sticky';

// Components
import Aside from 'components/ui/Aside';

// My RW Profile
// import MyRWProfileActivity from 'components/app/myrw/profile/MyRWProfileActivity';
import MyRWProfileEdit from 'components/app/myrw/profile/MyRWProfileEdit';

// Constants
const MYRW_SUBTABS = [
//   {
//   label: 'Activity',
//   value: 'activity',
//   route: 'myrw',
//   params: { tab: 'profile', subtab: 'activity' }
// },
  {
    label: 'Edit profile',
    value: 'edit',
    route: 'myrw',
    params: { tab: 'profile', subtab: 'edit' }
  }
];

class MyRWProfile extends React.Component {
  render() {
    const subtab = this.props.subtab || 'edit';

    return (
      <div className="c-page-section">
        <div className="l-container">
          <StickyContainer>
            <div className="row l-row">
              <div className="columns small-12 medium-3">
                <Sticky>
                  {
                    ({ style }) => (
                      <div style={style}>
                        <Aside
                          items={MYRW_SUBTABS}
                          selected={subtab}
                        />
                      </div>
                    )
                  }
                </Sticky>
              </div>

              <div className="columns small-12 medium-9">
                {subtab === 'edit' &&
                  <MyRWProfileEdit />
                }
              </div>

            </div>
          </StickyContainer>
        </div>
      </div>
    );
  }
}

MyRWProfile.propTypes = {
  subtab: React.PropTypes.string
};

export default MyRWProfile;
