import React from 'react';
import { Link } from 'routes';
import Page from 'components/app/layout/Page';


class MyRWActivity extends React.Component {

  render() {

    return (
      <Page
        title="My Resource Watch Activity"
        description="My Resource Watch Activity description"
      >
        <div className="p-myrw-activity">
          <div className="c-page">

          </div>
        </div>
      </Page>
    );
  }
}

export default MyRWActivity;
