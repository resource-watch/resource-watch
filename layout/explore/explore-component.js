/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Components
import Page from 'layout/page';
import Layout from 'layout/layout/layout-app';

// Explore components
import ExploreSidebar from 'layout/explore/explore-sidebar';
import ExploreHeader from 'layout/explore/explore-header';
import ExploreDatasetsHeader from 'layout/explore/explore-datasets-header';
import ExploreDatasets from 'layout/explore/explore-datasets';

class Explore extends Page {
  static propTypes = {
    explore: PropTypes.object
  };

  render() {
    return (
      <Layout
        title="Explore"
        description="Explore description"
        className="-fullscreen"
        category="Dataset"
      >
        <div className="c-page-explore">
          <ExploreSidebar>
            <ExploreHeader />
            <ExploreDatasetsHeader />
            <ExploreDatasets />
          </ExploreSidebar>
        </div>
      </Layout>
    );
  }
}

export default Explore;
