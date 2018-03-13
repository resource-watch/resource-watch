/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// // Explore Detail Component
// import ExploreHeader from 'layout/explore/explore-header';
// import ExploreInfo from 'layout/explore/explore-info';
// import ExploreRelatedTools from 'layout/explore/explore-related-tools';
// import ExploreButtons from 'layout/explore/explore-buttons';
// import ExploreTags from 'layout/explore/explore-tags';
// import ExploreWidgetEditor from 'layout/explore/explore-widget-editor';

// Components
import Page from 'layout/page';
import Layout from 'layout/layout/layout-app';

// Explore components
import ExploreSidebar from 'layout/explore/explore-sidebar';
import ExploreHeader from 'layout/explore/explore-header';

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
          </ExploreSidebar>
        </div>
      </Layout>
    );
  }
}

export default Explore;
