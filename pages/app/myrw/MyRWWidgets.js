import React from 'react';
import { Link } from 'routes';
import Page from 'components/app/layout/Page';


class MyRWWidgets extends React.Component {

  render() {

    return (
      <Page
        title="My Resource Watch Widgets"
        description="My Resource Watch Widgets description"
      >
        <div className="p-myrw-widgets">
          <div className="c-page">

          </div>
        </div>
      </Page>
    );
  }
}

export default MyRWWidgets;
