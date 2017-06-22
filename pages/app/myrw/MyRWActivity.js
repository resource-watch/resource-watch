import React from 'react';
import { Link } from 'routes';
import Page from 'components/app/layout/Page';
import Button from 'components/ui/Button';


class MyRWActivity extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      starredDashboards: [],
      starredInsights: []
    };
  }

  handleGoToDashboards() {

  }

  handleGoToInsights() {

  }

  render() {
    const { starredDashboards, starredInsights } = this.state;

    return (
      <Page
        title="My Resource Watch Activity"
        description="My Resource Watch Activity description"
      >
        <div className="p-myrw-activity">
          <div className="c-page">
            <div className="today-section">
              <div className="row">
                <div className="column small-12">
                  <h1>Today</h1>
                </div>
              </div>
              <div className="row">
                <div className="column small-12">
                  <div className="starred-dashboards">
                    <h2>{starredDashboards.length} starred dashboards</h2>
                    <Button
                      properties={{
                        type: 'button',
                        className: '-primary -end'
                      }}
                      onClick={this.handleGoToDashboards}
                    >
                    Go to dashboards
                    </Button>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="column small-12">
                  <div className="starred-insights">
                    <h2>{starredInsights.length} starred insights</h2>
                    <Button
                      properties={{
                        type: 'button',
                        className: '-primary -end'
                      }}
                      onClick={this.handleGoToInsights}
                    >
                    Go to insights
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

export default MyRWActivity;
