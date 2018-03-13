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

// Components
import Title from 'components/ui/Title';

// Explore components
import Sidebar from 'layout/explore/explore-sidebar';

class Explore extends Page {
  static propTypes = {
    explore: PropTypes.object
  };

  render() {
    const {
      explore
    } = this.props;

    return (
      <Layout
        title="Explore"
        description="Explore description"
        className="-fullscreen"
        category="Dataset"
      >
        <div className="c-page-explore">
          <Sidebar>
            Explore
          </Sidebar>
        </div>
      </Layout>
    );
  }
}

export default Explore;
