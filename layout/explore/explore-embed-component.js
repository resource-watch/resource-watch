import React, { PureComponent } from 'react';

// components
import Layout from 'layout/layout/layout-embed';
import ExploreMap from 'layout/explore/explore-map';

class EmbedExplore extends PureComponent {
  render() {
    return (
      <Layout
        title="Explore Data Sets — Resource Watch"
        description="Browse more than 200 global data sets on the state of our planet."
        className="-fullscreen"
      >
        <div className="c-embed-widget -map">
          <ExploreMap embed />
        </div>
      </Layout>
    );
  }
}

export default EmbedExplore;
