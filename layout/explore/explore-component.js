/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Responsive
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';

// Components
import Page from 'layout/page';
import Layout from 'layout/layout/layout-app';

// Explore components
import ExploreSidebar from 'layout/explore/explore-sidebar';
import ExploreHeader from 'layout/explore/explore-header';
import ExploreDatasetsHeader from 'layout/explore/explore-datasets-header';
import ExploreDatasets from 'layout/explore/explore-datasets';

import ExploreMap from 'layout/explore/explore-map';

class Explore extends React.Component {
  static propTypes = {
    responsive: PropTypes.object
  };

  render() {
    const { responsive } = this.props;
    return (
      <Layout
        title="Explore"
        description="Explore description"
        className="-fullscreen"
        category="Dataset"
      >
        <div className="c-page-explore">
          <ExploreSidebar>
            <div className="row">
              <div className="column small-12">
                <ExploreHeader />
                <ExploreDatasetsHeader />
                <ExploreDatasets />
              </div>
            </div>
          </ExploreSidebar>

          {/* Desktop map */}
          <MediaQuery
            minDeviceWidth={breakpoints.medium}
            values={{ deviceWidth: responsive.fakeWidth }}
          >
            <ExploreMap />
          </MediaQuery>

        </div>
      </Layout>
    );
  }
}

export default Explore;
